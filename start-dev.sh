#!/bin/bash

# Script to start backend and frontend for testing

echo "🚀 Starting development servers..."

# Function to stop all processes on exit
cleanup() {
    echo "\n🛑 Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Handle signals for graceful shutdown
trap cleanup SIGINT SIGTERM

# Check directories exist
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found!"
    exit 1
fi

# Start backend on port 3645
echo "📦 Starting Backend on port 3645..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Start frontend on port 3646
echo "🌐 Starting Frontend on port 3646..."
cd frontend
npx next dev -p 3646 &
FRONTEND_PID=$!
cd ..

# Wait for servers to start
sleep 5

echo "✅ Servers started:"
echo "   🔧 Backend: http://localhost:3645"
echo "   🌐 Frontend: http://localhost:3646"
echo "   🧪 Xero test: http://localhost:3003"
echo ""
echo "💡 Press Ctrl+C to stop"

# Wait for processes to finish
wait