#!/bin/bash
# Install Node.js and dependencies

# Update package manager
sudo yum update -y

# Install Node.js 20.x
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 for process management
sudo npm install -g pm2

echo "Dependencies installed successfully"
