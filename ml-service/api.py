#!/usr/bin/env python3
"""
WasteSmart ML Service - FastAPI server for food waste recognition
"""

import os
import base64
import io
import time
from typing import List, Dict, Any, Optional
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
import requests
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ultralytics import YOLO

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(
    title="WasteSmart ML Service",
    description="AI-powered food waste recognition service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
MODEL_PATH = os.getenv("MODEL_PATH", "models/yolov8n.pt")
MODEL = None
FOOD_CATEGORIES = [
    'apple', 'banana', 'orange', 'bread', 'cheese', 'yogurt',
    'plastic_bottle', 'pizza_box', 'coffee_cup', 'egg_shells'
]

class RecognitionRequest(BaseModel):
    image: str  # base64 encoded image
    location: Optional[str] = "SW1A 1AA"

class RecognitionResponse(BaseModel):
    success: bool
    detections: List[Dict[str, Any]]
    processing_time: float
    model_info: Dict[str, str]

def load_model():
    """Load YOLOv8 model"""
    global MODEL
    try:
        MODEL = YOLO(MODEL_PATH)
        print(f"✅ Model loaded: {MODEL_PATH}")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        # Use mock model for development
        MODEL = None

def preprocess_image(image_data: str) -> np.ndarray:
    """Preprocess base64 image data"""
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        image_array = np.array(image)
        
        return image_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")

def mock_recognition(image: np.ndarray, location: str) -> List[Dict[str, Any]]:
    """Mock recognition for development"""
    # Simulate processing time
    time.sleep(0.5)
    
    # Mock detections based on image size (simulating different items)
    height, width = image.shape[:2]
    
    detections = []
    
    # Simulate different items based on image characteristics
    if width > height:  # Landscape - likely packaging
        detections.append({
            'item': 'plastic_bottle',
            'confidence': 87.5,
            'bbox': [width//4, height//4, width//2, height//2],
            'bin_color': 'blue',
            'category': 'container',
            'disposal_note': 'Check if clean (recycling) or dirty (general waste)',
            'requires_user_input': True
        })
    else:  # Portrait - likely food
        detections.append({
            'item': 'banana',
            'confidence': 92.3,
            'bbox': [width//4, height//4, width//2, height//2],
            'bin_color': 'brown',
            'category': 'fruit',
            'disposal_note': 'Organic waste - compost bin',
            'requires_user_input': False
        })
    
    # Add location-specific guidance
    for detection in detections:
        detection['location_guidance'] = {
            'Westminster': f'{detection["item"].replace("_", " ").title()} - {detection["bin_color"]} bin',
            'Tower Hamlets': f'{detection["item"].replace("_", " ").title()} - {detection["bin_color"]} bin'
        }
    
    return detections

def real_recognition(image: np.ndarray) -> List[Dict[str, Any]]:
    """Real YOLOv8 recognition"""
    if MODEL is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Run inference
        results = MODEL(image)
        
        detections = []
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # Get coordinates
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    
                    # Get class and confidence
                    cls = int(box.cls[0].cpu().numpy())
                    conf = float(box.conf[0].cpu().numpy())
                    
                    # Map class to food item
                    if cls < len(FOOD_CATEGORIES):
                        item_name = FOOD_CATEGORIES[cls]
                        
                        # Determine bin color and category
                        bin_color, category, disposal_note = get_disposal_info(item_name)
                        
                        detection = {
                            'item': item_name,
                            'confidence': round(conf * 100, 1),
                            'bbox': [int(x1), int(y1), int(x2), int(y2)],
                            'bin_color': bin_color,
                            'category': category,
                            'disposal_note': disposal_note,
                            'requires_user_input': bin_color == 'blue'  # Recycling often needs verification
                        }
                        
                        detections.append(detection)
        
        return detections
    except Exception as e:
        print(f"Recognition error: {e}")
        return []

def get_disposal_info(item_name: str) -> tuple:
    """Get disposal information for an item"""
    disposal_rules = {
        'apple': ('brown', 'fruit', 'Organic waste - compost bin'),
        'banana': ('brown', 'fruit', 'Organic waste - compost bin'),
        'orange': ('brown', 'fruit', 'Organic waste - compost bin'),
        'bread': ('brown', 'bread', 'Organic waste - compost bin'),
        'cheese': ('black', 'dairy', 'General waste - not compostable'),
        'yogurt': ('blue', 'dairy', 'Check if clean (recycling) or dirty (general waste)'),
        'plastic_bottle': ('blue', 'container', 'Check if clean (recycling) or dirty (general waste)'),
        'pizza_box': ('brown', 'packaging', 'Greasy boxes to general waste, clean parts to recycling'),
        'coffee_cup': ('black', 'packaging', 'Most disposable cups not recyclable'),
        'egg_shells': ('brown', 'organic', 'Crush first, high calcium content')
    }
    
    return disposal_rules.get(item_name, ('black', 'unknown', 'Check local disposal rules'))

@app.on_event("startup")
async def startup_event():
    """Initialize the service"""
    print("🚀 Starting WasteSmart ML Service...")
    load_model()
    print("✅ ML Service ready!")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model": MODEL_PATH if MODEL else "mock",
        "timestamp": time.time()
    }

@app.post("/recognize")
async def recognize_food_waste(request: RecognitionRequest):
    """Recognize food waste items in image"""
    start_time = time.time()
    
    try:
        # Preprocess image
        image_array = preprocess_image(request.image)
        
        # Run recognition
        if MODEL is not None:
            detections = real_recognition(image_array)
        else:
            detections = mock_recognition(image_array, request.location)
        
        processing_time = time.time() - start_time
        
        return RecognitionResponse(
            success=True,
            detections=detections,
            processing_time=round(processing_time, 3),
            model_info={
                "model": MODEL_PATH if MODEL else "mock",
                "version": "1.0.0"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recognition failed: {str(e)}")

@app.post("/recognize/upload")
async def recognize_upload(
    file: UploadFile = File(...),
    location: str = Form("SW1A 1AA")
):
    """Recognize food waste from uploaded file"""
    start_time = time.time()
    
    try:
        # Read image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert to numpy array
        image_array = np.array(image)
        
        # Run recognition
        if MODEL is not None:
            detections = real_recognition(image_array)
        else:
            detections = mock_recognition(image_array, location)
        
        processing_time = time.time() - start_time
        
        return RecognitionResponse(
            success=True,
            detections=detections,
            processing_time=round(processing_time, 3),
            model_info={
                "model": MODEL_PATH if MODEL else "mock",
                "version": "1.0.0"
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recognition failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)