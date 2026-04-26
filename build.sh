#!/bin/bash
set -e

echo "Installing root dependencies..."
npm install --legacy-peer-deps

echo "Installing backend dependencies..."
cd backend && npm install --legacy-peer-deps && cd ..

echo "Installing frontend dependencies..."
cd frontend-react && npm install --legacy-peer-deps && cd ..

echo "Building frontend..."
cd frontend-react && npx vite build && cd ..

echo "Build complete!"
