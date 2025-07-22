# 🌱 WasteSmart - AI-Powered Food Waste Sorting

## Overview

WasteSmart is an intelligent food waste recognition system that helps users properly sort their food waste for recycling and composting. Using computer vision and machine learning, the app identifies food items and provides location-specific disposal guidance based on UK council rules.

## 🚀 Features

### Core Functionality
- **Real-time Object Detection**: YOLOv8-powered food waste recognition
- **Location-Specific Guidance**: Different rules for different UK councils
- **AR Camera Interface**: Point and shoot for instant results
- **Disposal Instructions**: Clear guidance on which bin to use
- **Environmental Impact**: Track your waste reduction progress

### Technical Features
- **Multi-Platform**: React Native mobile app with web interface
- **Scalable Backend**: Node.js/Express API with TypeScript
- **ML Integration**: Python FastAPI service with YOLOv8
- **Real-time Processing**: <3 second response time
- **Offline Capability**: Core features work without internet

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Mobile App    │────│   Backend API    │────│   ML Service    │
│   (Expo/RN)     │    │   (Express/TS)   │    │   (FastAPI/YOLOv8)
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
    Redux Store              PostgreSQL              YOLOv8 Model
    Camera/UI                Council Rules          Food Recognition
    Navigation               API Routes             Disposal Rules
```

## 🛠️ Technology Stack

### Frontend
- **React Native 0.80+** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** + RTK Query for state management
- **React Navigation 6** for routing
- **Expo Camera** for image capture

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** with PostGIS for location data
- **JWT** for authentication
- **Redis** for caching

### ML/AI
- **Python 3.9+** with FastAPI
- **YOLOv8** (Ultralytics) for object detection
- **OpenCV** for image processing
- **PIL** for image manipulation
- **ONNX** for model optimization

## 📱 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 13+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Olliew18/RecyclePics.git
cd RecyclePics
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Mobile app
cd ../mobile
npm install

# ML service
cd ../ml-service
pip install -r requirements.txt
```

3. **Set up environment variables**
```bash
# Copy example files
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the services**
```bash
# Start all services
./start_services.sh

# Or start individually:
# Backend API (Port 3000)
cd backend && npm run dev

# ML Service (Port 8001)
cd ml-service && python api.py

# Mobile App (Port 8081)
cd mobile && npm run web
```

## 🧪 Testing

### Run the Demo
```bash
python demo.py
```

### Test the API
```bash
# Health check
curl http://localhost:3000/health

# Image recognition
curl -X POST http://localhost:3000/api/v1/recognize \
  -F "image=@test_image.jpg"
```

### Test the Mobile App
```bash
cd mobile
npm run web  # Opens in browser
npm run ios  # iOS simulator
npm run android  # Android emulator
```

## 📊 Project Status

### ✅ Completed
- **Backend API**: Express.js server with TypeScript
- **Mobile App**: React Native with navigation and camera
- **ML Service**: YOLOv8 integration with FastAPI
- **Documentation**: Comprehensive project documentation
- **Demo Script**: Interactive demonstration

### 🔄 In Progress
- **Database Schema**: PostgreSQL setup with PostGIS
- **Custom Model Training**: Food waste dataset training
- **AR Overlay**: Real-time camera overlay
- **Testing Framework**: Unit and integration tests

### 📋 Planned
- **Production Deployment**: Cloud hosting setup
- **Mobile App Store**: iOS and Android releases
- **Advanced Analytics**: User behavior tracking
- **Multi-Language**: International expansion

## 🎯 Key Features

### Smart Recognition
- **30+ Food Categories**: Comprehensive waste item detection
- **Confidence Scoring**: Reliable identification with confidence levels
- **Edge Case Handling**: Contaminated vs clean items
- **Multi-Item Detection**: Recognize multiple items in one photo

### Location Intelligence
- **UK Council Rules**: Different disposal rules by location
- **Postcode Lookup**: Automatic council detection
- **Collection Schedules**: Local waste collection information
- **Special Instructions**: Council-specific disposal guidance

### User Experience
- **Intuitive Interface**: Simple point-and-shoot camera
- **Color-Coded Bins**: Visual bin identification
- **Accessibility**: WCAG 2.1 compliant design
- **Offline Support**: Core features without internet

### Environmental Impact
- **Waste Tracking**: Monitor your waste reduction
- **Carbon Footprint**: Calculate environmental impact
- **Progress Goals**: Set and track waste reduction targets
- **Community Challenges**: Compare with local users

## 🔧 Development

### Project Structure
```
WasteSmart/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── models/   # Database models
│   │   └── utils/    # Utility functions
│   └── tests/        # Backend tests
├── mobile/           # React Native mobile app
│   ├── src/
│   │   ├── screens/  # App screens
│   │   ├── components/ # Reusable components
│   │   └── store/    # Redux store
│   └── tests/        # Mobile tests
├── ml-service/       # Python ML service
│   ├── models/       # YOLOv8 models
│   ├── training/     # Training scripts
│   └── api.py        # FastAPI server
├── training/         # Model training data
├── docs/            # Documentation
└── shared/          # Shared utilities
```

### Development Commands
```bash
# Backend development
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests

# Mobile development
cd mobile
npm run web          # Web development
npm run ios          # iOS simulator
npm run android      # Android emulator

# ML service
cd ml-service
python api.py        # Start ML service
python train.py      # Train custom model
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- **TypeScript**: All code must be typed
- **ESLint**: Follow project linting rules
- **Testing**: Write tests for new features
- **Documentation**: Update docs for changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **YOLOv8**: Ultralytics for the object detection model
- **React Native**: Facebook for the mobile framework
- **FastAPI**: Sebastián Ramírez for the Python web framework
- **UK Councils**: For providing waste disposal guidance

## 📞 Support

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join community discussions
- **Documentation**: Check the docs folder
- **Email**: Contact the development team

---

**WasteSmart** - Making waste sorting smarter, one photo at a time! 🌱♻️