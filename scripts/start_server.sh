#!/bin/bash
# Start the backend server

cd /var/www/html/myenglish/server

# Install server dependencies
npm install --production

# Create/update .env file for backend
cat > .env << EOF
DB_HOST=${DB_HOST:-database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com}
DB_USER=${DB_USER:-admin}
DB_PASSWORD=${DB_PASSWORD:-myenglish2003}
DB_NAME=${DB_NAME:-myenglish_db}
DB_PORT=${DB_PORT:-3306}
PORT=3001
NODE_ENV=production
EOF

# Start server with PM2
pm2 delete myenglish-server 2>/dev/null || true
pm2 start index.js --name myenglish-server
pm2 save

echo "Server started successfully"
