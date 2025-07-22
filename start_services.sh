#!/bin/bash

# WasteSmart Prototype Service Starter
echo "🚀 Starting WasteSmart Prototype Services..."

# Function to check if port is in use
check_port() {
    lsof -i :$1 >/dev/null 2>&1
    return $?
}

# Kill existing processes on our ports
echo "🧹 Cleaning up existing processes..."
if check_port 8001; then
    echo "   Stopping ML service on port 8001..."
    pkill -f "python.*api.py" 2>/dev/null
fi

if check_port 3000; then
    echo "   Stopping API service on port 3000..."
    pkill -f "npm.*dev" 2>/dev/null
    pkill -f "node.*dist" 2>/dev/null
fi

# Wait a moment for cleanup
sleep 2

echo ""
echo "🤖 Starting ML Service (YOLOv8)..."
cd ml-service
python3 api.py &
ML_PID=$!
cd ..

# Wait for ML service to start
sleep 5

echo ""
echo "🔧 Starting Backend API Service..."
cd backend
npm run dev &
API_PID=$!
cd ..

# Wait for API service to start
sleep 3

echo ""
echo "✅ Services starting up..."
echo "   ML Service (YOLOv8): http://localhost:8001"
echo "   Backend API: http://localhost:3000"
echo ""
echo "📱 To start the mobile app:"
echo "   cd mobile && npm run web"
echo ""
echo "🧪 To test the prototype:"
echo "   python3 test_prototype.py"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $ML_PID 2>/dev/null
    kill $API_PID 2>/dev/null
    pkill -f "python.*api.py" 2>/dev/null
    pkill -f "npm.*dev" 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running
wait