#!/bin/bash
# Stop the application

# Stop PM2 processes
pm2 delete myenglish-server 2>/dev/null || true

# Stop nginx
sudo systemctl stop nginx 2>/dev/null || true

echo "Application stopped"
