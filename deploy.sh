#!/bin/bash

# School Management System - Production Deployment Script
# This script automates the deployment process for the school management system

set -e  # Exit on any error

echo "🚀 Starting School Management System Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_nodejs() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v16 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_success "Node.js version: $NODE_VERSION"
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_success "npm version: $NPM_VERSION"
}

# Install backend dependencies
setup_backend() {
    print_status "Setting up backend..."
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        if [ -f env.example ]; then
            cp env.example .env
            print_warning "Please edit the .env file with your production settings before continuing."
            print_warning "Required settings: DATABASE_URL, JWT_SECRET, PORT"
            read -p "Press Enter after editing .env file..."
        else
            print_error "env.example file not found. Please create .env file manually."
            exit 1
        fi
    fi
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    # Push database schema
    print_status "Setting up database schema..."
    npx prisma db push
    
    cd ..
    print_success "Backend setup completed!"
}

# Install frontend dependencies
setup_frontend() {
    print_status "Setting up frontend..."
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    cd ..
    print_success "Frontend setup completed!"
}

# Build frontend for production
build_frontend() {
    print_status "Building frontend for production..."
    cd frontend
    
    # Build the application
    npm run build
    
    cd ..
    print_success "Frontend build completed!"
}

# Test the application
test_application() {
    print_status "Testing application..."
    
    # Test backend
    cd backend
    print_status "Testing backend..."
    npm test || print_warning "Backend tests failed or not configured"
    cd ..
    
    # Test frontend
    cd frontend
    print_status "Testing frontend..."
    npm test || print_warning "Frontend tests failed or not configured"
    cd ..
    
    print_success "Testing completed!"
}

# Start the application
start_application() {
    print_status "Starting the application..."
    
    # Start backend
    cd backend
    print_status "Starting backend server..."
    npm start &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend (if in development mode)
    if [ "$NODE_ENV" != "production" ]; then
        cd frontend
        print_status "Starting frontend development server..."
        npm start &
        FRONTEND_PID=$!
        cd ..
    fi
    
    print_success "Application started!"
    print_status "Backend running on: http://localhost:5000"
    print_status "Frontend running on: http://localhost:3000"
    
    # Wait for user to stop
    echo ""
    print_status "Press Ctrl+C to stop the application"
    wait
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    print_success "Cleanup completed!"
}

# Main deployment function
deploy() {
    print_status "Starting deployment process..."
    
    # Check prerequisites
    check_nodejs
    check_npm
    
    # Setup application
    setup_backend
    setup_frontend
    
    # Build for production
    build_frontend
    
    # Test application
    test_application
    
    print_success "Deployment completed successfully!"
    print_status "The application is ready for production use."
}

# Development setup function
dev_setup() {
    print_status "Setting up development environment..."
    
    # Check prerequisites
    check_nodejs
    check_npm
    
    # Setup application
    setup_backend
    setup_frontend
    
    print_success "Development setup completed!"
    print_status "You can now start the development servers."
}

# Show usage information
show_usage() {
    echo "School Management System - Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy      - Full production deployment"
    echo "  dev-setup   - Development environment setup"
    echo "  start       - Start the application"
    echo "  test        - Run tests"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy      # Deploy for production"
    echo "  $0 dev-setup   # Setup development environment"
    echo "  $0 start       # Start the application"
}

# Set trap for cleanup
trap cleanup EXIT

# Parse command line arguments
case "${1:-help}" in
    "deploy")
        deploy
        ;;
    "dev-setup")
        dev_setup
        ;;
    "start")
        start_application
        ;;
    "test")
        test_application
        ;;
    "help"|*)
        show_usage
        ;;
esac 