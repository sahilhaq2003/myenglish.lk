#!/bin/bash
# Start the application

cd /var/www/html/myenglish

# Install frontend dependencies
npm install --production

# Build the frontend
npm run build

# Configure nginx to serve the built files
sudo tee /etc/nginx/conf.d/myenglish.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/html/myenglish/dist;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Restart nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "Application started successfully"
