# AWS Deployment Guide for MyEnglish.lk

This guide provides step-by-step instructions for deploying your MyEnglish.lk application to AWS.

## 🏗️ Architecture Overview

Your application will use:
- **AWS EC2** - Hosting the frontend and backend
- **AWS RDS MySQL** - Database (already configured)
- **AWS S3** (Optional) - Static asset storage
- **AWS CloudFront** (Optional) - CDN for faster content delivery
- **Elastic Load Balancer** (Optional) - High availability

## 📋 Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI installed and configured
3. Git installed on your local machine
4. Node.js 20.x installed

## 🚀 Deployment Methods

### Method 1: Direct EC2 Deployment (Recommended for Quick Start)

#### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. **Configuration:**
   - **Name:** myenglish-app
   - **AMI:** Amazon Linux 2023 or Ubuntu 22.04 LTS
   - **Instance Type:** t2.micro (Free tier) or t3.small (Recommended for production)
   - **Key Pair:** Create new or use existing SSH key
   - **Security Group:** 
     - Allow HTTP (80) from 0.0.0.0/0
     - Allow HTTPS (443) from 0.0.0.0/0
     - Allow SSH (22) from your IP
     - Allow Custom TCP (3001) from 0.0.0.0/0 (Backend API)
3. **Storage:** 20 GB gp3
4. Click "Launch Instance"

#### Step 2: Connect to EC2 Instance

```bash
# Windows (using PowerShell or Command Prompt)
ssh -i "your-key.pem" ec2-user@your-ec2-public-ip

# If using Ubuntu
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

#### Step 3: Install Dependencies on EC2

```bash
# Update system
sudo yum update -y  # For Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y  # For Ubuntu

# Install Node.js 20.x
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs  # For Amazon Linux
# OR
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs  # For Ubuntu

# Install PM2 for process management
sudo npm install -g pm2

# Install nginx
sudo yum install -y nginx  # For Amazon Linux
# OR
sudo apt install -y nginx  # For Ubuntu

# Install Git
sudo yum install -y git  # For Amazon Linux
# OR
sudo apt install -y git  # For Ubuntu
```

#### Step 4: Clone and Deploy Application

```bash
# Create application directory
sudo mkdir -p /var/www/html
cd /var/www/html

# Clone your repository
sudo git clone https://github.com/yourusername/myenglish.lk-main.git myenglish
cd myenglish

# Set proper permissions
sudo chown -R $USER:$USER /var/www/html/myenglish

# Install dependencies
npm install

# Build the frontend
npm run build

# Setup environment variables for backend
cd server
cat > .env << EOF
DB_HOST=database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=myenglish2003
DB_NAME=myenglish_db
DB_PORT=3306
PORT=3001
NODE_ENV=production
VITE_API_KEY=your_gemini_api_key_here
EOF

# Install server dependencies
npm install

# Start backend with PM2
pm2 start index.js --name myenglish-server
pm2 save
pm2 startup  # Follow the instructions to enable auto-start
```

#### Step 5: Configure Nginx

```bash
# Create nginx configuration
sudo tee /etc/nginx/conf.d/myenglish.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/html/myenglish/dist;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Frontend - React App
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Backend API
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
        proxy_read_timeout 90;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Test nginx configuration
sudo nginx -t

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### Step 6: Update Frontend API URL

Before building, make sure your frontend is pointing to the correct API URL:

```bash
# Edit .env file in root directory
cat > /var/www/html/myenglish/.env << EOF
VITE_API_URL=http://your-ec2-public-ip
VITE_API_KEY=your_gemini_api_key_here
EOF

# Rebuild frontend with new configuration
npm run build

# Reload nginx
sudo systemctl reload nginx
```

### Method 2: AWS Elastic Beanstalk (Easier Management)

#### Step 1: Install EB CLI

```bash
pip install awsebcli --upgrade
```

#### Step 2: Initialize Elastic Beanstalk

```bash
cd /path/to/your/project
eb init

# Follow prompts:
# - Select your region
# - Create new application: myenglish-app
# - Platform: Node.js
# - Setup SSH: Yes
```

#### Step 3: Create Environment

```bash
eb create myenglish-production

# This will:
# - Create an EC2 instance
# - Configure load balancer
# - Setup security groups
# - Deploy your application
```

#### Step 4: Configure Environment Variables

```bash
eb setenv \
  DB_HOST=database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com \
  DB_USER=admin \
  DB_PASSWORD=myenglish2003 \
  DB_NAME=myenglish_db \
  DB_PORT=3306 \
  NODE_ENV=production \
  VITE_API_KEY=your_gemini_api_key_here
```

#### Step 5: Deploy

```bash
# Deploy your application
eb deploy

# Open in browser
eb open
```

### Method 3: AWS CodeDeploy + CodePipeline (CI/CD)

#### Step 1: Push Code to GitHub/CodeCommit

```bash
git add .
git commit -m "Prepare for AWS deployment"
git push origin main
```

#### Step 2: Create CodePipeline

1. Go to AWS CodePipeline → Create pipeline
2. **Pipeline settings:**
   - Name: myenglish-pipeline
   - Service role: Create new
3. **Source:**
   - Source provider: GitHub (or CodeCommit)
   - Repository: your-repo
   - Branch: main
4. **Build:**
   - Build provider: AWS CodeBuild
   - Create new build project
   - Environment: Managed image, Amazon Linux 2
   - Runtime: Standard
   - Image: Latest
   - Buildspec: Use buildspec.yml from repository
5. **Deploy:**
   - Deploy provider: AWS CodeDeploy
   - Create application and deployment group
   - Deployment type: In-place
6. Review and create

## 🔒 Security Improvements

### 1. Use Environment Variables for Secrets

```bash
# Never commit these to Git!
# Store in AWS Secrets Manager or Parameter Store

# Install AWS SDK
npm install @aws-sdk/client-secrets-manager

# Retrieve secrets in your code
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "eu-north-1" });
const response = await client.send(
  new GetSecretValueCommand({ SecretId: "myenglish/db" })
);
const secrets = JSON.parse(response.SecretString);
```

### 2. Setup SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx  # Amazon Linux
# OR
sudo apt install -y certbot python3-certbot-nginx  # Ubuntu

# Get certificate (requires domain name)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 3. Configure Firewall

```bash
# Using UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Using firewalld (Amazon Linux)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

## 📊 Monitoring and Logs

### View Application Logs

```bash
# PM2 logs
pm2 logs myenglish-server

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

### Setup CloudWatch Monitoring

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm
```

## 🔄 Updates and Maintenance

### Deploy Updates

```bash
# SSH into EC2
ssh -i "your-key.pem" ec2-user@your-ec2-public-ip

# Pull latest code
cd /var/www/html/myenglish
git pull origin main

# Update dependencies and rebuild
npm install
npm run build

# Restart backend
pm2 restart myenglish-server

# Reload nginx
sudo systemctl reload nginx
```

### Database Backup

```bash
# Create RDS snapshot via AWS Console or CLI
aws rds create-db-snapshot \
  --db-instance-identifier database-1 \
  --db-snapshot-identifier myenglish-backup-$(date +%Y%m%d)
```

## 🌐 Domain Configuration

1. Buy domain from Route 53 or your provider
2. Create hosted zone in Route 53
3. Add A record pointing to EC2 Elastic IP
4. Update nginx server_name directive
5. Get SSL certificate with Certbot

## 💰 Cost Optimization

- **EC2:** Use t2.micro (Free tier) or t3.small (~$15/month)
- **RDS:** db.t3.micro (~$15/month)
- **Data Transfer:** First 100 GB free
- **Estimated Total:** $30-50/month

## 🆘 Troubleshooting

### Application not loading
```bash
# Check PM2 status
pm2 status

# Check nginx status
sudo systemctl status nginx

# Check application logs
pm2 logs
```

### Database connection issues
```bash
# Test database connectivity
mysql -h database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com -u admin -p

# Check security group allows EC2 to access RDS
# EC2 security group should allow outbound to RDS on port 3306
```

### Frontend not updating
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

# Verify build
ls -la /var/www/html/myenglish/dist/

# Check nginx configuration
sudo nginx -t
```

## 📞 Support

For issues:
1. Check application logs
2. Review AWS CloudWatch logs
3. Verify security group settings
4. Check RDS connectivity

---

**Your application is now deployed on AWS!** 🎉

Access it at: http://your-ec2-public-ip
