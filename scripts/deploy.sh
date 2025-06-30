#!/bin/bash

# StudyNotion Deployment Script
# This script helps deploy the application to various platforms

echo "🚀 StudyNotion Deployment Script"
echo "=================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy env.example to .env and configure your environment variables."
    exit 1
fi

# Build the client
echo "📦 Building client..."
cd client
npm run build
cd ..

# Check if build was successful
if [ ! -d "client/build" ]; then
    echo "❌ Error: Client build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Ask for deployment platform
echo ""
echo "Choose deployment platform:"
echo "1) Heroku"
echo "2) Railway"
echo "3) Vercel"
echo "4) Custom"
echo "5) Render"
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🚀 Deploying to Heroku..."
        if command -v heroku &> /dev/null; then
            git add .
            git commit -m "Deploy to Heroku"
            git push heroku main
        else
            echo "❌ Heroku CLI not found. Please install it first."
            echo "Install with: npm install -g heroku"
        fi
        ;;
    2)
        echo "🚀 Deploying to Railway..."
        if command -v railway &> /dev/null; then
            railway up
        else
            echo "❌ Railway CLI not found. Please install it first."
            echo "Install with: npm install -g @railway/cli"
        fi
        ;;
    3)
        echo "🚀 Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "❌ Vercel CLI not found. Please install it first."
            echo "Install with: npm install -g vercel"
        fi
        ;;
    4)
        echo "📋 Custom deployment instructions:"
        echo "1. Set up your environment variables"
        echo "2. Build the client: cd client && npm run build"
        echo "3. Start the server: npm start"
        echo "4. Configure your hosting platform"
        ;;
    5)
        echo "🚀 Deploying to Render..."
        # Build the application
        echo "📦 Building application..."
        npm run build

        # Check if build was successful
        if [ $? -eq 0 ]; then
            echo "✅ Build successful!"
            echo "🌐 Application is ready for deployment on Render"
            echo ""
            echo "📋 Next steps:"
            echo "1. Push your code to GitHub"
            echo "2. Connect your repository to Render"
            echo "3. Set environment variables in Render dashboard:"
            echo "   - MONGODB_URI"
            echo "   - JWT_SECRET"
            echo "   - GOOGLE_CLIENT_ID"
            echo "   - GOOGLE_CLIENT_SECRET"
            echo "4. Deploy!"
        else
            echo "❌ Build failed!"
            exit 1
        fi
        ;;
    *)
        echo "❌ Invalid choice!"
        exit 1
        ;;
esac

echo "✅ Deployment script completed!" 