#!/bin/bash
set -e

echo "Installing dependencies..."
npm install
npm --prefix backend install
npm --prefix frontend-react install

echo "Building frontend..."
npm --prefix frontend-react run build

if [ ! -d "frontend-react/dist" ]; then
  echo "Error: frontend-react/dist directory does not exist after build!"
  exit 1
fi

echo "Build complete!"
