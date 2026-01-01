#!/bin/bash
# MyEnglish.lk - Automated Installation Script
# This script installs everything needed on EC2

set -e

echo "========================================="
echo "  MyEnglish.lk Installation Starting    "
echo "========================================="
echo ""

# Update system
echo "📦 Step 1/6: Updating system packages..."
sudo yum update -y
echo "✅ System updated!"
echo ""

# Install Node.js
echo "📦 Step 2/6: Installing Node.js 20.x..."
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
echo "✅ Node.js installed!"
echo ""

# Install PM2
echo "📦 Step 3/6: Installing PM2 process manager..."
sudo npm install -g pm2
echo "✅ PM2 installed!"
echo ""

# Install Nginx
echo "📦 Step 4/6: Installing Nginx web server..."
sudo yum install -y nginx
echo "✅ Nginx installed!"
echo ""

# Install Git
echo "📦 Step 5/6: Installing Git..."
sudo yum install -y git
echo "✅ Git installed!"
echo ""

# Verify installations
echo "📦 Step 6/6: Verifying installations..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "PM2 version: $(pm2 --version)"
echo "Nginx version: $(nginx -v 2>&1)"
echo "Git version: $(git --version)"
echo ""

echo "========================================="
echo "  ✅ ALL INSTALLATIONS COMPLETE! 🎉     "
echo "========================================="
echo ""
echo "Your EC2 server is now ready for deployment!"
