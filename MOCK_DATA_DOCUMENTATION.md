# WasteSmart Mock Data Documentation

This document outlines the comprehensive mock data implementation for WasteSmart, including 25+ food waste categories and realistic UK disposal scenarios.

## Overview

The mock data has been significantly expanded to support comprehensive testing of the WasteSmart application with realistic food waste recognition scenarios. This includes edge cases, multi-item scenarios, and UK-specific disposal guidance.

## File Locations

### Backend Mock Data
- **File**: `/backend/src/routes/items.ts`
- **Function**: `mockFoodItems` array
- **Purpose**: Provides searchable database of food items with disposal rules

### ML Service Mock Data
- **File**: `/ml-service/food_recognition.py` 
- **Function**: `_load_disposal_rules()` method
- **Purpose**: Maps detected items to disposal guidance
- **Enhanced Mock Service**: `/ml-service/enhanced_recognition.py`
- **Purpose**: Generates complete recognition scenarios for testing

## Food Categories Added (25+ Items)

### 1. Fresh Fruits (5 items)
- **Apple**: Stickers removal required, compostable
- **Banana**: Quick decomposition, high potassium
- **Orange**: Citrus benefits for compost, pest deterrent
- **Strawberry**: Remove packaging, moldy berries OK
- **Grapes**: Cut large bunches, stems compostable

### 2. Vegetables (5 items)  
- **Carrot**: Tops edible, excellent for compost
- **Potato**: Avoid green parts (solanine), skins OK
- **Lettuce**: All parts compostable, wilts quickly
- **Broccoli**: Chop stalks, edible when cooked
- **Onion**: Papery skins OK, slower decomposition

### 3. Proteins (3 items)
- **Cooked Chicken**: General waste, some councils collect separately
- **Fish**: Wrap well, bones need industrial composting
- **Egg Shells**: Crush first, high calcium content

### 4. Dairy (2 items)
- **Cheese**: General waste only, attracts pests
- **Yogurt**: Empty contents, check container recyclability

### 5. Grains & Bread (3 items)
- **Bread**: Break into pieces, moldy bread OK
- **Cooked Rice**: Small amounts only, may cause odors
- **Pasta**: Plain pasta OK, remove sauces

### 6. Beverages (2 items)
- **Coffee Grounds**: Excellent nitrogen source, filters OK
- **Tea Bag**: Most compostable now, check for plastic

### 7. Packaging & Containers (6 items)
- **Plastic Bottle**: Remove cap, rinse, check plastic number
- **Pizza Box**: Greasy boxes to general waste
- **Glass Jar**: Remove lid, different recycling streams
- **Tin Can**: Rinse, infinitely recyclable
- **Takeaway Container**: Most not recyclable, check symbols
- **Crisp Packet**: General waste, some supermarket collection

### 8. Contaminated Items (2 items)
- **Moldy Bread**: Fine for compost, may attract flies
- **Rotten Fruit**: Remove packaging, natural decomposition

## Bin Color Coding

- **Green (#4CAF50)**: Compost/Food Waste
- **Blue (#2196F3)**: Recycling  
- **Grey (#757575)**: General Waste
- **Orange (#FF9800)**: Special Disposal Required

## Mock Recognition Scenarios

The enhanced mock service provides 11 comprehensive scenarios:

### Single Item Scenarios
1. **Fresh Apple** - High confidence (92%)
2. **Moldy Bread** - Moderate confidence (78%)
3. **Pizza Box Dilemma** - Tricky disposal item (85%)

### Dual Item Scenarios  
4. **Banana and Peel** - Separated items (87-94%)
5. **Bottle and Cap** - Container with component (73-96%)

### Multi-Item Complex Scenarios
6. **Mixed Fruit Bowl** - 3 fruits in various states
7. **Takeaway Lunch Cleanup** - Mixed containers and food
8. **Kitchen Prep Waste** - 4 vegetable scraps + egg shells

### Edge Cases
9. **Low Confidence Mixed Items** - Unclear items (58-62%)
10. **Coffee Shop Waste** - Mixed beverage packaging
11. **Dairy and Meat Dilemma** - Items that can't be composted

## Features

### Realistic Confidence Scores
- High confidence: 85-96% (clear, good lighting)
- Moderate confidence: 75-84% (standard conditions) 
- Low confidence: 58-74% (challenging conditions, edge cases)

### Bounding Boxes
- Realistic coordinate ranges for 400x400 image
- Varying sizes based on item type
- Overlapping scenarios for multi-item detection

### UK-Specific Guidance
- Council variations by postcode prefix
- Local disposal rules and exceptions
- Special collection notes (e.g., crisp packets at supermarkets)

### Processing Times
- Realistic range: 800-2500ms
- Varies by scenario complexity
- Accounts for multi-item processing

## Usage Examples

### Backend API Testing
```bash
# Search for fruits
GET /api/v1/items/search?q=apple

# Get specific item
GET /api/v1/items/apple_001

# List by category  
GET /api/v1/items?category=Fruit
```

### Mock Recognition Service
```python
from enhanced_recognition import MockRecognitionService

service = MockRecognitionService()

# Random scenario
result = service.generate_mock_recognition()

# Specific scenario  
result = service.generate_mock_recognition("Mixed Fruit Bowl")

# List available scenarios
scenarios = service.get_available_scenarios()
```

## Testing Capabilities

### Item Search Testing
- Search by name, alternate names, categories
- Category filtering
- Pagination support

### Recognition Result Testing
- Single vs multi-item scenarios
- Confidence threshold testing
- Bounding box visualization
- Location-specific disposal rules

### Edge Case Testing  
- Low confidence scenarios
- Mixed material types
- Contaminated items
- Unclear/ambiguous items

## Integration Points

### Mobile App Integration
- Results display components
- Confidence threshold handling  
- Multi-item result processing
- Bounding box overlay testing

### Backend API Integration
- Item search functionality
- Disposal rule lookups
- Category filtering
- Location-based variations

### ML Service Integration  
- Recognition result formatting
- Confidence score processing
- Multi-item detection
- Processing time simulation

## Data Quality

### Comprehensive Coverage
- 25+ distinct food waste categories
- UK-specific disposal guidance
- Real-world disposal scenarios
- Edge cases and difficult items

### Realistic Scenarios
- Based on actual UK waste disposal rules  
- Confidence scores reflect real detection challenges
- Multi-item scenarios mirror actual usage
- Processing times based on actual ML inference

### Extensible Design
- Easy to add new categories
- Configurable confidence ranges
- Flexible scenario definitions
- Location-specific rule variations

## Future Enhancements

### Potential Additions
- Seasonal food items (Christmas, summer fruits)
- Regional UK variations (Scotland, Wales differences)
- Packaging material variations
- Quantity-based disposal guidance

### Testing Improvements
- Performance benchmarking scenarios
- User interaction simulation
- Error condition testing
- Network failure simulation

This comprehensive mock data system enables thorough testing of the WasteSmart application across all major use cases while providing realistic UK waste disposal guidance.