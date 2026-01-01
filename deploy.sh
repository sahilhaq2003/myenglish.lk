#!/bin/bash

# MyEnglish.lk Automated Deployment Script
# This script automates the deployment process to AWS EC2

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration (Update these values)
EC2_HOST="${EC2_HOST:-}"
SSH_KEY="${SSH_KEY:-}"
APP_DIR="/var/www/html/myenglish"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Check if required variables are set
check_config() {
    if [ -z "$EC2_HOST" ]; then
        print_error "EC2_HOST not set. Please set it: export EC2_HOST=your-ec2-ip"
        exit 1
    fi
    
    if [ -z "$SSH_KEY" ]; then
        print_error "SSH_KEY not set. Please set it: export SSH_KEY=path/to/your-key.pem"
        exit 1
    fi
    
    if [ ! -f "$SSH_KEY" ]; then
        print_error "SSH key file not found: $SSH_KEY"
        exit 1
    fi
    
    print_status "Configuration validated"
}

# Test SSH connection
test_connection() {
    print_status "Testing SSH connection to $EC2_HOST..."
    if ssh -i "$SSH_KEY" -o ConnectTimeout=10 ec2-user@$EC2_HOST "echo 'Connection successful'" > /dev/null 2>&1; then
        print_status "SSH connection successful"
    else
        print_error "Cannot connect to EC2 instance"
        exit 1
    fi
}

# Build frontend locally
build_frontend() {
    print_status "Building frontend locally..."
    npm install
    npm run build
    print_status "Frontend build completed"
}

# Deploy to EC2
deploy_to_ec2() {
    print_status "Deploying to EC2..."
    
    # Create directories
    ssh -i "$SSH_KEY" ec2-user@$EC2_HOST "sudo mkdir -p $APP_DIR && sudo chown ec2-user:ec2-user $APP_DIR"
    
    # Upload dist folder
    print_status "Uploading frontend files..."
    scp -i "$SSH_KEY" -r dist/* ec2-user@$EC2_HOST:$APP_DIR/dist/
    
    # Upload server files
    print_status "Uploading server files..."
    scp -i "$SSH_KEY" -r server/* ec2-user@$EC2_HOST:$APP_DIR/server/
    scp -i "$SSH_KEY" package*.json ec2-user@$EC2_HOST:$APP_DIR/
    
    print_status "Files uploaded successfully"
}

# Setup and restart services on EC2
restart_services() {
    print_status "Restarting services on EC2..."
    
    ssh -i "$SSH_KEY" ec2-user@$EC2_HOST << 'EOF'
        cd /var/www/html/myenglish/server
        
        # Install dependencies if needed
        npm install --production
        
        # Restart backend with PM2
        pm2 restart myenglish-server || pm2 start index.js --name myenglish-server
        pm2 save
        
        # Reload nginx
        sudo systemctl reload nginx
        
        echo "Services restarted successfully"
EOF
    
    print_status "Services restarted"
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check if backend is running
    if ssh -i "$SSH_KEY" ec2-user@$EC2_HOST "pm2 list | grep myenglish-server" > /dev/null; then
        print_status "Backend is running"
    else
        print_warning "Backend might not be running properly"
    fi
    
    # Check if nginx is running
    if ssh -i "$SSH_KEY" ec2-user@$EC2_HOST "sudo systemctl is-active nginx" > /dev/null; then
        print_status "Nginx is running"
    else
        print_warning "Nginx might not be running properly"
    fi
}

# Show deployment info
show_deployment_info() {
    echo ""
    echo "========================================="
    echo "  Deployment Completed Successfully!    "
    echo "========================================="
    echo ""
    echo "  Application URL: http://$EC2_HOST"
    echo "  API Endpoint: http://$EC2_HOST/api"
    echo ""
    echo "  To view logs:"
    echo "  ssh -i \"$SSH_KEY\" ec2-user@$EC2_HOST 'pm2 logs'"
    echo ""
    echo "========================================="
}

# Main deployment process
main() {
    echo "╔══════════════════════════════════════╗"
    echo "║   MyEnglish.lk Deployment Script    ║"
    echo "╚══════════════════════════════════════╝"
    echo ""
    
    check_config
    test_connection
    build_frontend
    deploy_to_ec2
    restart_services
    verify_deployment
    show_deployment_info
}

# Run main function
main
