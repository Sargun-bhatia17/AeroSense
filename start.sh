#!/bin/bash

echo "🚀 Starting Aerospace Environment..."

# 1. Start the Node.js Backend
echo "📦 Starting Backend Server..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!

# 2. Start the React Frontend
echo "🎨 Starting Frontend Server..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "✅ Both services are starting up!"
echo "Press [CTRL+C] to stop all services."

# Wait for processes to exit so Ctrl+C kills both
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait