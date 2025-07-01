#!/bin/bash

echo "🚀 Starting build process..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Check if client directory exists
if [ ! -d "client" ]; then
    echo "❌ Client directory not found!"
    exit 1
fi

# Navigate to client directory
cd client

# Install client dependencies
echo "📦 Installing client dependencies..."
npm install

# Check if public directory exists
if [ ! -d "public" ]; then
    echo "❌ Client public directory not found!"
    exit 1
fi

# List public directory contents
echo "📁 Public directory contents:"
ls -la public/

# Check if index.html exists
if [ ! -f "public/index.html" ]; then
    echo "❌ index.html not found in public directory!"
    exit 1
fi

# Build the client
echo "🔨 Building client..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Client build successful!"
else
    echo "❌ Client build failed!"
    exit 1
fi

# Go back to root
cd ..

echo "🎉 Build process completed successfully!" 