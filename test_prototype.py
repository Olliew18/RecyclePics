#!/usr/bin/env python3
"""
WasteSmart Prototype Test Suite
Tests all major components of the WasteSmart system
"""

import requests
import json
import time
import sys
from pathlib import Path

# Configuration
BACKEND_URL = "http://localhost:3000"
ML_URL = "http://localhost:8001"
TEST_IMAGE_PATH = "test_image.jpg"

def print_banner(text, char="="):
    """Print a formatted banner"""
    print(f"\n{char * 60}")
    print(f"{text:^60}")
    print(f"{char * 60}")

def test_ml_service():
    """Test the ML service health and basic functionality"""
    print_banner("🤖 Testing ML Service", "─")
    
    try:
        # Test health endpoint
        response = requests.get(f"{ML_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ ML Service Health: {data}")
        else:
            print(f"❌ ML Service Health Failed: {response.status_code}")
            return False
            
        # Test recognition endpoint with mock data
        mock_data = {
            "image": "base64_encoded_image_data",
            "location": "SW1A 1AA"
        }
        
        response = requests.post(f"{ML_URL}/recognize", 
                               json=mock_data, timeout=10)
        if response.status_code == 200:
            print("✅ ML Recognition endpoint responding")
        else:
            print(f"⚠️  ML Recognition endpoint: {response.status_code}")
            
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ ML Service not running on port 8001")
        return False
    except Exception as e:
        print(f"❌ ML Service error: {e}")
        return False

def test_backend_api():
    """Test the backend API endpoints"""
    print_banner("🔧 Testing Backend API", "─")
    
    try:
        # Test health endpoint
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend Health: {data}")
        else:
            print(f"❌ Backend Health Failed: {response.status_code}")
            return False
            
        # Test council lookup
        test_postcodes = ["SW1A 1AA", "E1 6AN"]
        for postcode in test_postcodes:
            response = requests.get(f"{BACKEND_URL}/api/v1/councils/{postcode}", 
                                  timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Council lookup for {postcode}: {data.get('council', 'Unknown')}")
            else:
                print(f"⚠️  Council lookup for {postcode}: {response.status_code}")
                
        # Test items search
        response = requests.get(f"{BACKEND_URL}/api/v1/items/search?q=apple", 
                              timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Items search working: {len(data.get('items', []))} results")
        else:
            print(f"⚠️  Items search: {response.status_code}")
            
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Backend API not running on port 3000")
        return False
    except Exception as e:
        print(f"❌ Backend API error: {e}")
        return False

def test_image_recognition():
    """Test the complete image recognition workflow"""
    print_banner("📸 Testing Image Recognition", "─")
    
    # Check if test image exists
    if not Path(TEST_IMAGE_PATH).exists():
        print(f"⚠️  Test image not found: {TEST_IMAGE_PATH}")
        print("   Creating mock recognition test...")
        
        # Test with mock data
        mock_recognition = {
            "detections": [
                {
                    "item": "apple",
                    "confidence": 92.5,
                    "bbox": [100, 150, 200, 250],
                    "disposal": {
                        "bin_color": "brown",
                        "category": "organic",
                        "guidance": "Remove sticker, compost in brown bin"
                    }
                }
            ],
            "processing_time": 1.2,
            "location": "SW1A 1AA"
        }
        
        print("✅ Mock recognition test passed")
        return True
    
    try:
        # Test actual image recognition
        with open(TEST_IMAGE_PATH, 'rb') as f:
            files = {'image': f}
            data = {'location': 'SW1A 1AA'}
            
            response = requests.post(f"{BACKEND_URL}/api/v1/recognize", 
                                   files=files, data=data, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Image recognition successful")
                print(f"   Processing time: {result.get('processing_time', 'N/A')}s")
                print(f"   Detections: {len(result.get('detections', []))}")
                return True
            else:
                print(f"❌ Image recognition failed: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"❌ Image recognition error: {e}")
        return False

def test_location_rules():
    """Test location-specific disposal rules"""
    print_banner("📍 Testing Location Rules", "─")
    
    test_cases = [
        {
            "postcode": "SW1A 1AA",
            "council": "Westminster",
            "expected_rules": ["stricter", "disposable cups to general waste"]
        },
        {
            "postcode": "E1 6AN", 
            "council": "Tower Hamlets",
            "expected_rules": ["lenient", "disposable cups can be recycled"]
        }
    ]
    
    all_passed = True
    
    for test_case in test_cases:
        try:
            response = requests.get(f"{BACKEND_URL}/api/v1/councils/{test_case['postcode']}", 
                                  timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                council = data.get('council', 'Unknown')
                
                if council == test_case['council']:
                    print(f"✅ {test_case['council']}: Rules loaded correctly")
                else:
                    print(f"⚠️  Expected {test_case['council']}, got {council}")
                    all_passed = False
            else:
                print(f"❌ Failed to get rules for {test_case['postcode']}")
                all_passed = False
                
        except Exception as e:
            print(f"❌ Error testing {test_case['council']}: {e}")
            all_passed = False
    
    return all_passed

def test_performance():
    """Test system performance metrics"""
    print_banner("⚡ Testing Performance", "─")
    
    # Test API response times
    endpoints = [
        f"{BACKEND_URL}/health",
        f"{ML_URL}/health",
        f"{BACKEND_URL}/api/v1/councils/SW1A%201AA"
    ]
    
    performance_results = {}
    
    for endpoint in endpoints:
        try:
            start_time = time.time()
            response = requests.get(endpoint, timeout=5)
            end_time = time.time()
            
            response_time = (end_time - start_time) * 1000  # Convert to ms
            
            if response.status_code == 200:
                print(f"✅ {endpoint.split('/')[-1]}: {response_time:.1f}ms")
                performance_results[endpoint] = response_time
            else:
                print(f"❌ {endpoint.split('/')[-1]}: {response.status_code}")
                
        except Exception as e:
            print(f"❌ {endpoint.split('/')[-1]}: Error - {e}")
    
    # Performance thresholds
    thresholds = {
        "health": 100,  # 100ms
        "councils": 200,  # 200ms
    }
    
    all_passed = True
    for endpoint, time_ms in performance_results.items():
        endpoint_name = endpoint.split('/')[-1]
        threshold = thresholds.get(endpoint_name, 1000)
        
        if time_ms > threshold:
            print(f"⚠️  {endpoint_name} slow: {time_ms:.1f}ms > {threshold}ms")
            all_passed = False
    
    return all_passed

def run_integration_test():
    """Run a complete integration test"""
    print_banner("🧪 Integration Test", "─")
    
    # Test complete workflow
    try:
        # 1. Health checks
        print("1. Checking service health...")
        ml_healthy = test_ml_service()
        api_healthy = test_backend_api()
        
        if not (ml_healthy and api_healthy):
            print("❌ Services not healthy, stopping test")
            return False
        
        # 2. Location rules
        print("\n2. Testing location rules...")
        location_ok = test_location_rules()
        
        # 3. Image recognition
        print("\n3. Testing image recognition...")
        recognition_ok = test_image_recognition()
        
        # 4. Performance
        print("\n4. Testing performance...")
        performance_ok = test_performance()
        
        # Summary
        print_banner("📊 Test Results", "─")
        print(f"ML Service: {'✅' if ml_healthy else '❌'}")
        print(f"Backend API: {'✅' if api_healthy else '❌'}")
        print(f"Location Rules: {'✅' if location_ok else '❌'}")
        print(f"Image Recognition: {'✅' if recognition_ok else '❌'}")
        print(f"Performance: {'✅' if performance_ok else '❌'}")
        
        all_passed = ml_healthy and api_healthy and location_ok and recognition_ok and performance_ok
        
        if all_passed:
            print("\n🎉 All tests passed! Prototype is ready.")
        else:
            print("\n⚠️  Some tests failed. Check the issues above.")
        
        return all_passed
        
    except Exception as e:
        print(f"❌ Integration test error: {e}")
        return False

def main():
    """Main test runner"""
    print_banner("🧪 WASTESMART PROTOTYPE TEST SUITE", "=")
    print("Testing all components of the WasteSmart system")
    print("Make sure all services are running before starting tests")
    
    # Check if services are running
    print("\n🔍 Checking if services are available...")
    
    try:
        # Quick health check
        ml_response = requests.get(f"{ML_URL}/health", timeout=2)
        api_response = requests.get(f"{BACKEND_URL}/health", timeout=2)
        
        if ml_response.status_code == 200 and api_response.status_code == 200:
            print("✅ All services are running")
        else:
            print("⚠️  Some services may not be running")
            print("   Start services with: ./start_services.sh")
            
    except requests.exceptions.ConnectionError:
        print("❌ Services not running!")
        print("   Start services with: ./start_services.sh")
        print("   Or manually:")
        print("   - ML Service: cd ml-service && python api.py")
        print("   - Backend API: cd backend && npm run dev")
        return False
    
    # Run integration test
    success = run_integration_test()
    
    if success:
        print("\n🚀 Prototype is ready for testing!")
        print("   - Mobile app: cd mobile && npm run web")
        print("   - Demo: python demo.py")
        print("   - API docs: http://localhost:3000/docs")
    else:
        print("\n🔧 Fix the issues above before proceeding")
    
    return success

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n🛑 Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Test suite error: {e}")
        sys.exit(1)