#!/bin/bash

# Subscription Tracker Setup Script
echo "🚀 Setting up Subscription Tracker..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Node.js
if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check for npm
if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and npm are available${NC}"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm run install-all

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "  1. Run 'npm run dev' to start both servers"
echo "  2. Open http://localhost:3000 in your browser"
echo "  3. Start adding your subscriptions!"
echo ""
echo -e "${YELLOW}📚 Available commands:${NC}"
echo "  npm run dev     - Start both frontend and backend"
echo "  npm run server  - Start only the backend server"
echo "  npm run client  - Start only the frontend"
echo "  npm run build   - Build for production"
