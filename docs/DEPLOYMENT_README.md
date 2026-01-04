# AWS Deployment - README

## 📁 Deployment Files Overview

Your project now includes all necessary files for AWS deployment:

```
myenglish.lk-main/
├── .ebextensions/              # Elastic Beanstalk configuration
│   └── nodecommand.config      # Node.js settings
├── scripts/                    # Deployment scripts
│   ├── install_dependencies.sh # Install Node, PM2, etc.
│   ├── start_server.sh        # Start backend server
│   ├── start_application.sh   # Configure nginx & frontend
│   └── stop_application.sh    # Graceful shutdown
├── appspec.yml                # AWS CodeDeploy configuration
├── buildspec.yml              # AWS CodeBuild configuration
├── deploy.sh                  # Automated deployment script
├── .env.example               # Environment variables template
├── AWS_DEPLOYMENT_GUIDE.md    # Complete deployment guide
├── QUICK_AWS_DEPLOY.md        # Quick start checklist
└── package.json               # Updated with deployment scripts
```

## 🚀 Quick Start Deployment

### Option 1: Automated Deployment (Recommended)

1. **Setup Environment Variables:**
```bash
export EC2_HOST="your-ec2-ip-address"
export SSH_KEY="path/to/your-key.pem"
```

2. **Run Deployment Script:**
```bash
chmod +x deploy.sh
./deploy.sh
```

That's it! Your application will be built and deployed automatically.

### Option 2: Manual Deployment

Follow the step-by-step guide in `QUICK_AWS_DEPLOY.md`

### Option 3: Elastic Beanstalk

```bash
eb init
eb create myenglish-production
eb deploy
```

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ AWS account created
- ✅ EC2 instance launched (or Elastic Beanstalk environment)
- ✅ RDS MySQL database running (already configured)
- ✅ SSH key (.pem file) for EC2 access
- ✅ Security groups configured (ports 22, 80, 443, 3001)
- ✅ Gemini API key obtained

## 🔧 Configuration

### 1. Environment Variables

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://your-ec2-ip
VITE_API_KEY=your_gemini_api_key_here
```

### 2. Server Configuration

Create `server/.env`:
```env
DB_HOST=database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=myenglish2003
DB_NAME=myenglish_db
DB_PORT=3306
PORT=3001
NODE_ENV=production
```

## 📚 Documentation

- **Complete Guide:** `AWS_DEPLOYMENT_GUIDE.md` - Detailed instructions for all deployment methods
- **Quick Checklist:** `QUICK_AWS_DEPLOY.md` - Fast deployment with copy-paste commands
- **This File:** `DEPLOYMENT_README.md` - Overview and quick reference

## 🎯 Deployment Methods Comparison

| Method | Setup Time | Complexity | Auto-Scaling | Cost |
|--------|------------|------------|--------------|------|
| **EC2 Manual** | 25 min | Low | No | $15-30/mo |
| **Elastic Beanstalk** | 15 min | Medium | Yes | $20-50/mo |
| **CodeDeploy/Pipeline** | 45 min | High | Yes | $30-80/mo |
| **Automated Script** | 5 min | Very Low | No | $15-30/mo |

**Recommendation:** Start with EC2 Manual or Automated Script for quick deployment.

## 🔐 Security Checklist

After deployment:

- [ ] Change default database password
- [ ] Setup SSL certificate (HTTPS)
- [ ] Configure firewall rules
- [ ] Enable CloudWatch monitoring
- [ ] Setup automated backups
- [ ] Use IAM roles instead of access keys
- [ ] Store secrets in AWS Secrets Manager
- [ ] Enable AWS WAF (Web Application Firewall)

## 🛠️ Useful Commands

### Build Commands
```bash
npm run build              # Build frontend
npm run server            # Start backend server
npm run deploy:build      # Build and start server
```

### Deployment Commands
```bash
./deploy.sh               # Automated deployment
eb deploy                 # Elastic Beanstalk deployment
```

### Server Management (on EC2)
```bash
pm2 status                # Check server status
pm2 logs                  # View server logs
pm2 restart myenglish-server  # Restart server
sudo systemctl reload nginx   # Reload nginx
```

## 📊 Monitoring

### View Logs
```bash
# On EC2
pm2 logs myenglish-server
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Check Status
```bash
pm2 status
sudo systemctl status nginx
curl http://localhost:3001/api  # Test backend
```

## 🔄 Updates and Maintenance

### Deploy Updates
```bash
# Automated
./deploy.sh

# Manual
ssh -i "your-key.pem" ec2-user@your-ec2-ip
cd /var/www/html/myenglish
git pull origin main
npm install
npm run build
pm2 restart myenglish-server
sudo systemctl reload nginx
```

### Database Backup
```bash
# Create RDS snapshot
aws rds create-db-snapshot \
  --db-instance-identifier database-1 \
  --db-snapshot-identifier backup-$(date +%Y%m%d)
```

## ⚡ Performance Optimization

1. **Enable Gzip Compression** - Already configured in nginx
2. **Use CloudFront CDN** - For global content delivery
3. **Optimize Images** - Use WebP format
4. **Enable Caching** - Static assets cached for 1 year
5. **Use Elastic Load Balancer** - For high availability

## 🆘 Troubleshooting

### Application Not Loading

```bash
# Check if services are running
pm2 status
sudo systemctl status nginx

# Check logs
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

### Database Connection Failed

```bash
# Test from EC2
mysql -h database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com -u admin -p

# Check security groups
# EC2 security group must allow outbound to RDS (port 3306)
# RDS security group must allow inbound from EC2
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 💰 Cost Estimation

**Monthly AWS Costs:**
- EC2 t2.micro (free tier): $0-15
- RDS db.t3.micro: $15
- EBS Storage (20 GB): $2
- Data Transfer (100 GB free): $0-10
- **Total:** $17-42/month

**With Auto-Scaling:**
- Elastic Load Balancer: $16
- Multiple EC2 instances: $30-60
- **Total:** $63-118/month

## 📞 Support Resources

- **AWS Documentation:** https://docs.aws.amazon.com
- **Node.js on AWS:** https://aws.amazon.com/nodejs/
- **PM2 Documentation:** https://pm2.keymetrics.io/
- **Nginx Documentation:** https://nginx.org/en/docs/

## 🎉 Success Checklist

After deployment, verify:

- [ ] Application loads at http://your-ec2-ip
- [ ] All pages navigate correctly
- [ ] API endpoints respond
- [ ] Database connection works
- [ ] User signup/login functional
- [ ] Course enrollment works
- [ ] AI features operational

## 📝 Next Steps

1. **Get Domain Name** 
   - Buy from Route 53 or your provider
   - Point to EC2 Elastic IP

2. **Setup SSL/HTTPS**
   - Use Certbot for free SSL
   - `sudo certbot --nginx -d yourdomain.com`

3. **Configure Email**
   - Use AWS SES for transactional emails
   - Setup SMTP for notifications

4. **Enable Monitoring**
   - Setup CloudWatch alarms
   - Configure SNS notifications

5. **Implement CI/CD**
   - Setup GitHub Actions or CodePipeline
   - Automate deployments

---

**Need Help?**

1. Check the troubleshooting section
2. Review deployment logs
3. Verify security group settings
4. Test database connectivity

**Your application is ready for production deployment!** 🚀
