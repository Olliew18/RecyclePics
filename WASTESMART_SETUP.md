# 🚀 WasteSmart Setup Guide

## Quick Start

Get WasteSmart running on your local machine in under 10 minutes!

### Prerequisites
- **Node.js 18+** and npm
- **Python 3.9+** and pip
- **Git**
- **PostgreSQL 13+** (optional for full features)

### 1. Clone the Repository
```bash
git clone https://github.com/Olliew18/RecyclePics.git
cd RecyclePics
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
cd backend
npm install
cd ..
```

#### Mobile App Dependencies
```bash
cd mobile
npm install
cd ..
```

#### ML Service Dependencies
```bash
cd ml-service
pip install -r requirements.txt
cd ..
```

### 3. Environment Setup

#### Create Environment Files
```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# ML service environment
cp ml-service/.env.example ml-service/.env
# Edit ml-service/.env with your settings
```

#### Database Setup (Optional)
```bash
# Install PostgreSQL
# Create database
createdb wastesmart_db

# Run migrations
cd backend
npm run migrate
```

### 4. Start the Services

#### Option A: Use the Startup Script
```bash
chmod +x start_services.sh
./start_services.sh
```

#### Option B: Start Manually
```bash
# Terminal 1: ML Service
cd ml-service
python api.py

# Terminal 2: Backend API
cd backend
npm run dev

# Terminal 3: Mobile App
cd mobile
npm run web
```

### 5. Test the Setup

#### Test ML Service
```bash
curl http://localhost:8001/health
# Should return: {"status": "healthy", "model": "yolov8n.pt"}
```

#### Test Backend API
```bash
curl http://localhost:3000/health
# Should return: {"status": "healthy", "version": "1.0.0"}
```

#### Test Mobile App
- Open http://localhost:8081 in your browser
- You should see the WasteSmart mobile interface

### 6. Run the Demo
```bash
python wastesmart_demo.py
```

## 🧪 Testing Your Setup

### Test Image Recognition
```bash
# Upload a test image
curl -X POST http://localhost:3000/api/v1/recognize \
  -F "image=@test_image.jpg" \
  -F "location=SW1A 1AA"
```

### Test Council Lookup
```bash
# Get council rules for Westminster
curl http://localhost:3000/api/v1/councils/SW1A%201AA
```

### Test Mobile App Features
1. **Camera Integration**: Point camera at food items
2. **Recognition**: See AI detect objects
3. **Guidance**: Get disposal instructions
4. **History**: View past recognitions

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8001
lsof -i :8081

# Kill the process
kill -9 <PID>
```

#### Python Dependencies
```bash
# Reinstall Python dependencies
cd ml-service
pip uninstall -r requirements.txt
pip install -r requirements.txt
```

#### Node Dependencies
```bash
# Clear npm cache and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../mobile
rm -rf node_modules package-lock.json
npm install
```

#### YOLOv8 Model Issues
```bash
# Download the model manually
cd ml-service
wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt
```

### Performance Issues

#### Slow Recognition
- Check if GPU is available
- Reduce image size in settings
- Use smaller YOLOv8 model (yolov8n.pt)

#### High Memory Usage
- Close other applications
- Restart services periodically
- Use lighter model variants

## 📱 Mobile App Development

### Development Commands
```bash
cd mobile

# Web development
npm run web

# iOS simulator
npm run ios

# Android emulator
npm run android

# Build for production
npm run build
```

### Testing on Device
```bash
# Install Expo Go on your phone
# Scan QR code from terminal
npm run web
```

## 🔬 ML Model Development

### Training Custom Model
```bash
cd ml-service

# Prepare your dataset
python prepare_dataset.py

# Train the model
python train.py --data food_waste.yaml --epochs 100

# Test the model
python test_model.py --weights runs/train/exp/weights/best.pt
```

### Model Optimization
```bash
# Convert to ONNX for faster inference
python export.py --weights yolov8n.pt --include onnx

# Quantize for mobile
python quantize.py --weights yolov8n.pt
```

## 🚀 Production Deployment

### Backend Deployment
```bash
# Build for production
cd backend
npm run build

# Start production server
npm start
```

### ML Service Deployment
```bash
# Use production WSGI server
cd ml-service
gunicorn api:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Mobile App Deployment
```bash
# Build for app stores
cd mobile
expo build:android
expo build:ios
```

## 📊 Monitoring

### Health Checks
```bash
# Check all services
curl http://localhost:8001/health
curl http://localhost:3000/health
```

### Logs
```bash
# View service logs
tail -f backend/logs/app.log
tail -f ml-service/logs/api.log
```

### Performance Metrics
- **Response Time**: < 3 seconds for recognition
- **Accuracy**: > 85% for common food items
- **Uptime**: > 99% availability

## 🔒 Security

### Environment Variables
- Never commit `.env` files
- Use strong passwords for databases
- Rotate API keys regularly

### API Security
- Rate limiting enabled
- Input validation on all endpoints
- CORS configured for production

### Data Privacy
- User data encrypted at rest
- GDPR compliance implemented
- Regular security audits

## 📚 Next Steps

### Development
1. **Custom Training**: Train on your own food waste dataset
2. **Feature Development**: Add new recognition categories
3. **Performance Optimization**: Improve response times
4. **Testing**: Add comprehensive test coverage

### Production
1. **Cloud Deployment**: Deploy to AWS/Azure/GCP
2. **Mobile App Stores**: Publish to iOS/Android stores
3. **Monitoring**: Set up production monitoring
4. **Scaling**: Handle increased user load

### Research
1. **Model Improvements**: Experiment with different architectures
2. **Dataset Expansion**: Collect more diverse food waste images
3. **User Studies**: Gather feedback from real users
4. **Performance Analysis**: Optimize for edge cases

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

**Need help?** Check the documentation or open an issue on GitHub! 🆘