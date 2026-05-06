#!/bin/bash

echo "🔍 Verifying Frontend Build..."
echo ""

# Check if we're in the Frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the Frontend directory."
    exit 1
fi

echo "✅ Found package.json"
echo ""

# Check Node version
echo "📦 Node version:"
node --version
echo ""

# Check npm version
echo "📦 npm version:"
npm --version
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Run build
echo "🔨 Building Next.js app..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Check the errors above."
    exit 1
fi
echo "✅ Build successful!"
echo ""

# Check if .next directory was created
if [ -d ".next" ]; then
    echo "✅ .next directory created"
    echo ""
    echo "📊 Build output size:"
    du -sh .next
else
    echo "❌ .next directory not found"
    exit 1
fi

echo ""
echo "🎉 Frontend build verification complete!"
echo ""
echo "To test locally, run:"
echo "  npm start"
echo ""
echo "The app should be available at http://localhost:3000"
