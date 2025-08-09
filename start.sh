#!/bin/bash

# PeakPath Startup Script
# Starts both frontend and backend development servers

echo "🚀 Starting PeakPath - AI-Powered CliftonStrengths Coaching Platform"
echo "=================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ to continue.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Please run this script from the peakpath root directory${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing root dependencies...${NC}"
    npm install
fi

# Check backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    cd backend && npm install && cd ..
fi

# Check frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    cd frontend && npm install && cd ..
fi

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env file not found. Creating from template...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${RED}🔑 Please add your Claude API key to backend/.env before continuing${NC}"
    echo -e "${BLUE}   Get your API key from: https://console.anthropic.com/${NC}"
    read -p "Press Enter to continue once you've added your API key..."
fi

# Check if Claude API key is set
if ! grep -q "CLAUDE_API_KEY=sk-" backend/.env 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Claude API key might not be set properly in backend/.env${NC}"
    echo -e "${BLUE}   Make sure it starts with 'sk-' and is from https://console.anthropic.com/${NC}"
fi

echo ""
echo -e "${PURPLE}🎯 Starting services:${NC}"
echo -e "${BLUE}   Frontend: http://localhost:8000${NC}"
echo -e "${BLUE}   Backend:  http://localhost:8001${NC}"
echo ""
echo -e "${GREEN}💡 Sample PDFs available in ./resources/ directory${NC}"
echo -e "${GREEN}📚 Full documentation in ./README.md${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Start both services using npm workspaces
npm run dev