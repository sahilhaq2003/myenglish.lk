# Quick AWS Deployment Checklist

## ✅ Pre-Deployment Checklist

- [ ] AWS account created and configured
- [ ] AWS CLI installed
- [ ] SSH key pair created (.pem file)
- [ ] RDS database is running and accessible
- [ ] Gemini API key obtained
- [ ] Code committed to Git repository

## 🚀 Deployment Steps (EC2 Method - Fastest)

### 1. Launch EC2 Instance (5 minutes)
```bash
# AWS Console → EC2 → Launch Instance
# - Name: myenglish-app
# - AMI: Amazon Linux 2023
# - Instance type: t2.micro (free) or t3.small
# - Key pair: Create new or select existing
# - Security Group: Allow 22, 80, 443, 3001
# - Storage: 20 GB
```

### 2. Connect to EC2 (1 minute)
```bash
ssh -i "your-key.pem" ec2-user@YOUR_EC2_PUBLIC_IP
```

### 3. Install Dependencies (5 minutes)
```bash
sudo yum update -y
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs nginx git
sudo npm install -g pm2
```

### 4. Deploy Application (10 minutes)
```bash
# Clone repository
sudo mkdir -p /var/www/html
cd /var/www/html
sudo git clone YOUR_REPO_URL myenglish
cd myenglish
sudo chown -R $USER:$USER /var/www/html/myenglish

# Install and build frontend
npm install
npm run build

# Setup backend
cd server
cat > .env << 'EOF'
DB_HOST=database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=myenglish2003
DB_NAME=myenglish_db
DB_PORT=3306
PORT=3001
NODE_ENV=production
EOF

npm install
pm2 start index.js --name myenglish-server
pm2 save
pm2 startup
```

### 5. Configure Nginx (3 minutes)
```bash
sudo tee /etc/nginx/conf.d/myenglish.conf > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/html/myenglish/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 6. Verify Deployment (2 minutes)
```bash
# Check backend
pm2 status
curl http://localhost:3001

# Check nginx
sudo systemctl status nginx

# Test from browser
# Open: http://YOUR_EC2_PUBLIC_IP
```

## 🔧 Post-Deployment Tasks

- [ ] Setup domain name (Route 53)
- [ ] Configure SSL certificate (Certbot)
- [ ] Setup CloudWatch monitoring
- [ ] Configure automatic backups
- [ ] Test all features
- [ ] Update DNS records

## 📝 Important URLs

- **Application:** http://YOUR_EC2_PUBLIC_IP
- **API Endpoint:** http://YOUR_EC2_PUBLIC_IP/api
- **AWS Console:** https://console.aws.amazon.com
- **RDS Endpoint:** database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com

## 🆘 Quick Troubleshooting

### Application not loading?
```bash
pm2 logs                      # Check backend logs
sudo nginx -t                 # Test nginx config
sudo systemctl status nginx   # Check nginx status
```

### Database connection failed?
```bash
# Test from EC2
mysql -h database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com -u admin -p
# Check EC2 security group allows outbound to RDS
```

### Need to redeploy?
```bash
cd /var/www/html/myenglish
git pull origin main
npm install
npm run build
pm2 restart myenglish-server
sudo systemctl reload nginx
```

## 💡 Pro Tips

1. **Get Elastic IP** to prevent IP changes on reboot
2. **Use PM2** for automatic restart on crash
3. **Enable nginx** to start on boot
4. **Setup CloudWatch** for monitoring
5. **Regular backups** of RDS database

## ⏱️ Total Deployment Time: ~25 minutes

---

**Ready to deploy? Start with Step 1!** 🚀
