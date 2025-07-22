#!/usr/bin/env python3
"""
Enhanced Mock Recognition Service for WasteSmart
Provides comprehensive testing scenarios for the WasteSmart prototype
"""

import random
import time
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from pathlib import Path

@dataclass
class Detection:
    """Represents a detected food waste item"""
    item: str
    confidence: float
    bbox: List[int]  # [x1, y1, x2, y2]
    category: str
    bin_color: str
    disposal_note: str
    requires_user_input: bool = False
    packaging_warning: bool = False

@dataclass
class RecognitionResult:
    """Complete recognition result"""
    detections: List[Detection]
    processing_time: float
    location: str
    council: str
    total_items: int
    environmental_impact: Dict[str, int]

class MockRecognitionService:
    """Enhanced mock service for comprehensive testing"""
    
    def __init__(self):
        self.scenarios = self._define_scenarios()
        self.food_items = self._load_food_items()
        self.councils = self._load_councils()
        
    def _define_scenarios(self) -> Dict[str, Dict[str, Any]]:
        """Define comprehensive testing scenarios"""
        return {
            "Fresh Apple": {
                "description": "Single fresh fruit detection",
                "items": ["apple"],
                "confidence_range": (85, 95),
                "complexity": "low"
            },
            "Moldy Bread": {
                "description": "Contaminated food item",
                "items": ["moldy_bread"],
                "confidence_range": (70, 85),
                "complexity": "medium"
            },
            "Pizza Box Dilemma": {
                "description": "Complex packaging disposal",
                "items": ["pizza_box"],
                "confidence_range": (75, 90),
                "complexity": "high"
            },
            "Banana and Peel": {
                "description": "Separated fruit and peel",
                "items": ["banana", "banana_peel"],
                "confidence_range": (80, 95),
                "complexity": "medium"
            },
            "Bottle and Cap": {
                "description": "Container with removable component",
                "items": ["plastic_bottle", "bottle_cap"],
                "confidence_range": (70, 95),
                "complexity": "medium"
            },
            "Mixed Fruit Bowl": {
                "description": "Multiple fruits in various states",
                "items": ["apple", "banana", "orange", "strawberry"],
                "confidence_range": (75, 90),
                "complexity": "high"
            },
            "Takeaway Lunch Cleanup": {
                "description": "Mixed containers and food waste",
                "items": ["takeaway_container", "plastic_bottle", "apple_core", "bread_crust"],
                "confidence_range": (65, 85),
                "complexity": "high"
            },
            "Kitchen Prep Waste": {
                "description": "Vegetable scraps and egg shells",
                "items": ["carrot_tops", "potato_peels", "onion_skins", "egg_shells"],
                "confidence_range": (80, 95),
                "complexity": "medium"
            },
            "Low Confidence Mixed Items": {
                "description": "Challenging lighting conditions",
                "items": ["unclear_item_1", "unclear_item_2", "unclear_item_3"],
                "confidence_range": (55, 75),
                "complexity": "high"
            },
            "Coffee Shop Waste": {
                "description": "Mixed beverage packaging",
                "items": ["coffee_cup", "plastic_lid", "coffee_grounds", "paper_napkin"],
                "confidence_range": (70, 90),
                "complexity": "medium"
            },
            "Dairy and Meat Dilemma": {
                "description": "Items that can't be composted",
                "items": ["cheese_wrapper", "cooked_chicken", "yogurt_container"],
                "confidence_range": (75, 90),
                "complexity": "medium"
            }
        }
    
    def _load_food_items(self) -> Dict[str, Dict[str, Any]]:
        """Load comprehensive food item definitions"""
        return {
            "apple": {
                "category": "fruit",
                "bin_color": "brown",
                "disposal_note": "Remove sticker, compost in brown bin",
                "requires_user_input": False,
                "packaging_warning": True,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "banana": {
                "category": "fruit",
                "bin_color": "brown",
                "disposal_note": "Quick decomposition, high potassium content",
                "requires_user_input": False,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "banana_peel": {
                "category": "organic",
                "bin_color": "brown",
                "disposal_note": "Excellent for compost, breaks down quickly",
                "requires_user_input": False,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "moldy_bread": {
                "category": "bread",
                "bin_color": "brown",
                "disposal_note": "Moldy bread is fine for compost, may attract flies",
                "requires_user_input": False,
                "packaging_warning": True,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "pizza_box": {
                "category": "packaging",
                "bin_color": "brown",
                "disposal_note": "Greasy boxes to general waste, clean parts to recycling",
                "requires_user_input": True,
                "packaging_warning": True,
                "location_rules": {
                    "Westminster": "Clean cardboard → recycling, greasy parts → general waste",
                    "Tower Hamlets": "Tear off clean parts for recycling, rest to general waste"
                }
            },
            "plastic_bottle": {
                "category": "container",
                "bin_color": "blue",
                "disposal_note": "Remove cap, rinse, check plastic number",
                "requires_user_input": True,
                "packaging_warning": True,
                "location_rules": {
                    "Westminster": "Recycling bin (blue) if clean, general waste if contaminated",
                    "Tower Hamlets": "Mixed recycling bin - must be clean and cap removed"
                }
            },
            "bottle_cap": {
                "category": "packaging",
                "bin_color": "blue",
                "disposal_note": "Separate from bottle, check local rules",
                "requires_user_input": True,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "Check if metal or plastic, separate recycling",
                    "Tower Hamlets": "Mixed recycling if clean"
                }
            },
            "orange": {
                "category": "fruit",
                "bin_color": "brown",
                "disposal_note": "Citrus benefits for compost, pest deterrent",
                "requires_user_input": False,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "strawberry": {
                "category": "fruit",
                "bin_color": "brown",
                "disposal_note": "Remove packaging, moldy berries OK",
                "requires_user_input": False,
                "packaging_warning": True,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "apple_core": {
                "category": "organic",
                "bin_color": "brown",
                "disposal_note": "Remove seeds if possible, core compostable",
                "requires_user_input": False,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "bread_crust": {
                "category": "bread",
                "bin_color": "brown",
                "disposal_note": "Break into pieces, moldy bread OK",
                "requires_user_input": False,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "carrot_tops": {
                "category": "vegetable",
                "bin_color": "brown",
                "disposal_note": "Tops edible, excellent for compost",
                "requires_user_input": False,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "potato_peels": {
                "category": "vegetable",
                "bin_color": "brown",
                "disposal_note": "Avoid green parts (solanine), skins OK",
                "requires_user_input": False,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "onion_skins": {
                "category": "vegetable",
                "bin_color": "brown",
                "disposal_note": "Papery skins OK, slower decomposition",
                "requires_user_input": False,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "egg_shells": {
                "category": "organic",
                "bin_color": "brown",
                "disposal_note": "Crush first, high calcium content",
                "requires_user_input": False,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "coffee_cup": {
                "category": "packaging",
                "bin_color": "black",
                "disposal_note": "Most disposable cups not recyclable",
                "requires_user_input": True,
                "packaging_warning": True,
                "location_rules": {
                    "Westminster": "General waste - disposable cups not recyclable",
                    "Tower Hamlets": "General waste - check for special collection"
                }
            },
            "plastic_lid": {
                "category": "packaging",
                "bin_color": "blue",
                "disposal_note": "Check plastic type, separate from cup",
                "requires_user_input": True,
                "packaging_warning": True,
                "location_rules": {
                    "Westminster": "Recycling if clean, general waste if contaminated",
                    "Tower Hamlets": "Mixed recycling if clean"
                }
            },
            "coffee_grounds": {
                "category": "organic",
                "bin_color": "brown",
                "disposal_note": "Excellent nitrogen source, filters OK",
                "requires_user_input": False,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "paper_napkin": {
                "category": "paper",
                "bin_color": "brown",
                "disposal_note": "Compostable if not heavily soiled",
                "requires_user_input": False,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "Food waste bin (brown) - collected weekly on Wednesdays",
                    "Tower Hamlets": "Green caddy for food waste - collected twice weekly"
                }
            },
            "cheese_wrapper": {
                "category": "packaging",
                "bin_color": "black",
                "disposal_note": "General waste only, attracts pests",
                "requires_user_input": False,
                "packaging_warning": True,
                "location_rules": {
                    "Westminster": "General waste - not recyclable",
                    "Tower Hamlets": "General waste - not recyclable"
                }
            },
            "cooked_chicken": {
                "category": "protein",
                "bin_color": "black",
                "disposal_note": "General waste, some councils collect separately",
                "requires_user_input": False,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "General waste - meat not compostable",
                    "Tower Hamlets": "General waste - meat not compostable"
                }
            },
            "yogurt_container": {
                "category": "packaging",
                "bin_color": "blue",
                "disposal_note": "Empty contents, check container recyclability",
                "requires_user_input": True,
                "packaging_warning": True,
                "location_rules": {
                    "Westminster": "Recycling if clean, general waste if contaminated",
                    "Tower Hamlets": "Mixed recycling if clean"
                }
            },
            "takeaway_container": {
                "category": "packaging",
                "bin_color": "black",
                "disposal_note": "Most not recyclable, check symbols",
                "requires_user_input": True,
                "packaging_warning": True,
                "location_rules": {
                    "Westminster": "General waste - most takeaway containers not recyclable",
                    "Tower Hamlets": "General waste - check for special collection"
                }
            },
            "unclear_item_1": {
                "category": "unknown",
                "bin_color": "black",
                "disposal_note": "Unable to identify clearly",
                "requires_user_input": True,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "General waste - when in doubt",
                    "Tower Hamlets": "General waste - when in doubt"
                }
            },
            "unclear_item_2": {
                "category": "unknown",
                "bin_color": "black",
                "disposal_note": "Low confidence detection",
                "requires_user_input": True,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "General waste - when in doubt",
                    "Tower Hamlets": "General waste - when in doubt"
                }
            },
            "unclear_item_3": {
                "category": "unknown",
                "bin_color": "black",
                "disposal_note": "Poor lighting conditions",
                "requires_user_input": True,
                "packaging_warning": False,
                "location_rules": {
                    "Westminster": "General waste - when in doubt",
                    "Tower Hamlets": "General waste - when in doubt"
                }
            }
        }
    
    def _load_councils(self) -> Dict[str, Dict[str, Any]]:
        """Load council-specific rules"""
        return {
            "Westminster": {
                "postcode_prefixes": ["SW1A", "SW1P", "SW1E", "SW1H", "SW1V", "SW1W", "SW1X", "SW1Y"],
                "rules": {
                    "disposable_cups": "general_waste",
                    "pizza_boxes": "split_disposal",
                    "plastic_bottles": "clean_recycling",
                    "collection_days": {
                        "compost": "Wednesday",
                        "recycling": "Monday", 
                        "general": "Tuesday"
                    }
                }
            },
            "Tower Hamlets": {
                "postcode_prefixes": ["E1", "E2", "E3", "E14"],
                "rules": {
                    "disposable_cups": "recycling",
                    "pizza_boxes": "split_disposal",
                    "plastic_bottles": "mixed_recycling",
                    "collection_days": {
                        "compost": "Thursday",
                        "recycling": "Friday",
                        "general": "Monday"
                    }
                }
            }
        }
    
    def _get_council_from_postcode(self, postcode: str) -> str:
        """Determine council from postcode"""
        prefix = postcode.split()[0]
        
        for council, data in self.councils.items():
            if prefix in data["postcode_prefixes"]:
                return council
        
        return "Westminster"  # Default
    
    def _generate_bbox(self, item_count: int, image_size: int = 400) -> List[List[int]]:
        """Generate realistic bounding boxes"""
        bboxes = []
        
        for i in range(item_count):
            # Generate realistic coordinates
            x1 = random.randint(20, image_size - 100)
            y1 = random.randint(20, image_size - 100)
            width = random.randint(60, 120)
            height = random.randint(60, 120)
            
            # Ensure box fits in image
            x2 = min(x1 + width, image_size - 20)
            y2 = min(y1 + height, image_size - 20)
            
            bboxes.append([x1, y1, x2, y2])
        
        return bboxes
    
    def generate_mock_recognition(self, scenario_name: Optional[str] = None, 
                                 location: str = "SW1A 1AA") -> RecognitionResult:
        """Generate a mock recognition result"""
        
        # Select scenario
        if scenario_name and scenario_name in self.scenarios:
            scenario = self.scenarios[scenario_name]
        else:
            # Random scenario
            scenario_name = random.choice(list(self.scenarios.keys()))
            scenario = self.scenarios[scenario_name]
        
        # Get council
        council = self._get_council_from_postcode(location)
        
        # Generate detections
        detections = []
        items = scenario["items"]
        bboxes = self._generate_bbox(len(items))
        confidence_range = scenario["confidence_range"]
        
        for i, item in enumerate(items):
            if item in self.food_items:
                item_data = self.food_items[item]
                
                # Generate confidence within range
                confidence = random.uniform(*confidence_range)
                
                # Create detection
                detection = Detection(
                    item=item,
                    confidence=confidence,
                    bbox=bboxes[i],
                    category=item_data["category"],
                    bin_color=item_data["bin_color"],
                    disposal_note=item_data["disposal_note"],
                    requires_user_input=item_data["requires_user_input"],
                    packaging_warning=item_data["packaging_warning"]
                )
                
                detections.append(detection)
        
        # Calculate processing time based on complexity
        complexity_times = {
            "low": (0.8, 1.5),
            "medium": (1.2, 2.2),
            "high": (1.8, 3.0)
        }
        
        time_range = complexity_times.get(scenario["complexity"], (1.0, 2.0))
        processing_time = random.uniform(*time_range)
        
        # Calculate environmental impact
        environmental_impact = {
            "compostable": len([d for d in detections if d.bin_color == "brown"]),
            "recyclable": len([d for d in detections if d.bin_color == "blue"]),
            "general_waste": len([d for d in detections if d.bin_color == "black"]),
            "special_disposal": len([d for d in detections if d.bin_color == "orange"])
        }
        
        return RecognitionResult(
            detections=detections,
            processing_time=processing_time,
            location=location,
            council=council,
            total_items=len(detections),
            environmental_impact=environmental_impact
        )
    
    def get_available_scenarios(self) -> List[str]:
        """Get list of available scenarios"""
        return list(self.scenarios.keys())
    
    def get_scenario_info(self, scenario_name: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a scenario"""
        if scenario_name in self.scenarios:
            return self.scenarios[scenario_name]
        return None

def main():
    """Demo the enhanced recognition service"""
    service = MockRecognitionService()
    
    print("🧪 Enhanced Mock Recognition Service")
    print("=" * 50)
    
    # Show available scenarios
    print("\n📋 Available Scenarios:")
    for i, scenario in enumerate(service.get_available_scenarios(), 1):
        info = service.get_scenario_info(scenario)
        print(f"{i:2d}. {scenario}")
        print(f"    {info['description']}")
        print(f"    Complexity: {info['complexity']}")
        print(f"    Items: {len(info['items'])}")
        print()
    
    # Generate a random recognition
    print("🎲 Generating Random Recognition...")
    result = service.generate_mock_recognition()
    
    print(f"\n📍 Location: {result.location}")
    print(f"🏛️  Council: {result.council}")
    print(f"⏱️  Processing Time: {result.processing_time:.2f}s")
    print(f"📦 Total Items: {result.total_items}")
    
    print(f"\n🌱 Environmental Impact:")
    for category, count in result.environmental_impact.items():
        if count > 0:
            print(f"   {category.replace('_', ' ').title()}: {count}")
    
    print(f"\n🔍 Detections:")
    for i, detection in enumerate(result.detections, 1):
        print(f"{i}. {detection.item.replace('_', ' ').title()}")
        print(f"   Confidence: {detection.confidence:.1f}%")
        print(f"   Bin: {detection.bin_color.upper()}")
        print(f"   Note: {detection.disposal_note}")
        if detection.requires_user_input:
            print("   ⚠️  Requires verification")
        if detection.packaging_warning:
            print("   📦 Check packaging")
        print()

if __name__ == "__main__":
    main()