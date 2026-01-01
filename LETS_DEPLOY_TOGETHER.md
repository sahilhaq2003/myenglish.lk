# 🚀 Step-by-Step AWS Deployment Guide - Let's Do This Together!

## Current Status: ✅ Build Successful!

Your application has been built successfully and is ready for deployment.

---

## 🎯 STEP 1: AWS Account Setup (5 minutes)

### What to do:
1. Go to https://aws.amazon.com/
2. Click "Create an AWS Account" (or Sign In if you have one)
3. Follow the signup process:
   - Enter email and password
   - Choose "Personal" account
   - Enter credit card (required, but we'll use free tier)
   - Verify phone number

**→ When done, respond: "AWS account ready"**

---

## 🎯 STEP 2: Launch EC2 Instance (10 minutes)

### What to do:

1. **Login to AWS Console**
   - Go to https://console.aws.amazon.com
   - Login with your credentials

2. **Navigate to EC2**
   - Search for "EC2" in the search bar
   - Click "EC2" to open the EC2 Dashboard

3. **Launch Instance**
   - Click orange "Launch Instance" button

4. **Configure Instance** (Copy these settings exactly):

   **Name and tags:**
   ```
   Name: myenglish-app
   ```

   **Application and OS Images (AMI):**
   ```
   Select: Amazon Linux 2023 AMI
   (Should be selected by default - Free tier eligible)
   ```

   **Instance type:**
   ```
   Select: t2.micro
   (Free tier eligible - already selected)
   ```

   **Key pair (login):**
   ```
   Click "Create new key pair"
   Key pair name: myenglish-key
   Key pair type: RSA
   Private key file format: .pem
   Click "Create key pair"
   ⚠️ SAVE THE .pem FILE - You'll need it!
   ```

   **Network settings:**
   Click "Edit" and configure:
   ```
   Auto-assign public IP: Enable
   Firewall (security groups): Create security group
   Security group name: myenglish-sg
   Description: MyEnglish app security group
   
   Add these rules by clicking "Add security group rule":
   
   Rule 1 (Already there):
   Type: SSH
   Source type: My IP
   
   Rule 2 (Click "Add security group rule"):
   Type: HTTP
   Source type: Anywhere (0.0.0.0/0)
   
   Rule 3 (Click "Add security group rule"):
   Type: HTTPS
   Source type: Anywhere (0.0.0.0/0)
   
   Rule 4 (Click "Add security group rule"):
   Type: Custom TCP
   Port range: 3001
   Source type: Anywhere (0.0.0.0/0)
   Description: Backend API
   ```

   **Configure storage:**
   ```
   Size (GiB): 20
   (Leave other settings as default)
   ```

5. **Launch!**
   - Review your settings
   - Click "Launch instance"
   - Wait for "Success" message
   - Click "View all instances"

6. **Get your EC2 Public IP**
   - Click on your instance
   - Copy the "Public IPv4 address"
   - **Save this IP address - you'll use it everywhere!**

**→ When done, tell me: "EC2 launched, my IP is: [your-ip-here]"**

---

## 🎯 STEP 3: Connect to EC2 (5 minutes)

### What to do:

**For Windows users:**

1. **Open PowerShell**
   - Press Windows key
   - Type "PowerShell"
   - Right-click and "Run as Administrator"

2. **Navigate to where you saved the .pem file**
   ```powershell
   cd ~\Downloads
   # Or wherever you saved myenglish-key.pem
   ```

3. **Set permissions on the key file**
   ```powershell
   icacls myenglish-key.pem /inheritance:r
   icacls myenglish-key.pem /grant:r "%username%:R"
   ```

4. **Connect to EC2**
   ```powershell
   ssh -i myenglish-key.pem ec2-user@YOUR_EC2_IP_HERE
   # Replace YOUR_EC2_IP_HERE with the IP from Step 2
   ```

5. **Type "yes" when asked about fingerprint**

**→ When connected, you should see something like:**
```
[ec2-user@ip-xxx-xxx-xxx-xxx ~]$
```

**→ When connected, respond: "Connected to EC2!"**

---

## 🎯 STEP 4: Install Dependencies on EC2 (10 minutes)

### What to do (Copy-paste these commands one by one):

**📝 Note: You should be connected to EC2 via SSH for these commands**

1. **Update system packages**
   ```bash
   sudo yum update -y
   ```
   ⏱️ Wait for completion...

2. **Install Node.js 20.x**
   ```bash
   curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
   sudo yum install -y nodejs
   ```
   ⏱️ Wait for installation...

3. **Verify Node.js installation**
   ```bash
   node --version
   npm --version
   ```
   ✅ Should show v20.x.x and 10.x.x

4. **Install PM2 (Process Manager)**
   ```bash
   sudo npm install -g pm2
   ```

5. **Install Nginx (Web Server)**
   ```bash
   sudo yum install -y nginx
   ```

6. **Install Git**
   ```bash
   sudo yum install -y git
   ```

7. **Verify all installations**
   ```bash
   node --version && npm --version && pm2 --version && nginx -v && git --version
   ```
   ✅ All should show version numbers

**→ When done, respond: "All dependencies installed!"**

---

## 🎯 STEP 5: Prepare Your Code for Upload (5 minutes)

### What to do on YOUR COMPUTER (not EC2):

**Open a NEW PowerShell window (different from the EC2 SSH window)**

1. **Navigate to your project**
   ```powershell
   cd C:\Users\sahil\Desktop\projects\myenglish\myenglish.lk-main
   ```

2. **Create a deployment package**
   ```powershell
   # Create a zip file of necessary files
   Compress-Archive -Path dist, server, package.json, package-lock.json -DestinationPath myenglish-deploy.zip -Force
   ```

3. **Upload to EC2** (Replace YOUR_EC2_IP with your IP)
   ```powershell
   scp -i ~\Downloads\myenglish-key.pem myenglish-deploy.zip ec2-user@YOUR_EC2_IP:/home/ec2-user/
   ```

**→ When upload completes, respond: "Files uploaded to EC2!"**

---

## 🎯 STEP 6: Deploy Application on EC2 (8 minutes)

### What to do (Back in your EC2 SSH window):

1. **Create application directory**
   ```bash
   sudo mkdir -p /var/www/html/myenglish
   sudo chown ec2-user:ec2-user /var/www/html/myenglish
   ```

2. **Extract uploaded files**
   ```bash
   cd /home/ec2-user
   unzip -o myenglish-deploy.zip -d /var/www/html/myenglish/
   ```

3. **Setup backend**
   ```bash
   cd /var/www/html/myenglish/server
   npm install --production
   ```

4. **Create backend .env file**
   ```bash
   cat > .env << 'EOF'
   DB_HOST=database-1.ctaqimoaafgp.eu-north-1.rds.amazonaws.com
   DB_USER=admin
   DB_PASSWORD=myenglish2003
   DB_NAME=myenglish_db
   DB_PORT=3306
   PORT=3001
   NODE_ENV=production
   EOF
   ```

5. **Start backend server with PM2**
   ```bash
   pm2 start index.js --name myenglish-server
   pm2 save
   pm2 startup
   ```
   ⚠️ If PM2 shows a command, COPY and RUN it!

6. **Verify backend is running**
   ```bash
   pm2 status
   curl http://localhost:3001
   ```
   ✅ Should show server response

**→ When done, respond: "Backend is running!"**

---

## 🎯 STEP 7: Configure Nginx (5 minutes)

### What to do (Still in EC2 SSH):

1. **Create Nginx configuration**
   ```bash
   sudo tee /etc/nginx/conf.d/myenglish.conf > /dev/null << 'EOF'
   server {
       listen 80;
       server_name _;
       root /var/www/html/myenglish/dist;
       index index.html;

       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml;

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
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   EOF
   ```

2. **Test Nginx configuration**
   ```bash
   sudo nginx -t
   ```
   ✅ Should say "test is successful"

3. **Start Nginx**
   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

4. **Check Nginx status**
   ```bash
   sudo systemctl status nginx
   ```
   ✅ Should show "active (running)"

**→ When done, respond: "Nginx is running!"**

---

## 🎯 STEP 8: Test Your Deployment! 🎉

### What to do:

1. **Open your browser**

2. **Visit your application**
   ```
   http://YOUR_EC2_IP
   ```

3. **Test these pages:**
   - ✅ Home page loads
   - ✅ Courses page works
   - ✅ Login page shows
   - ✅ Signup page works

4. **Test the API**
   ```
   http://YOUR_EC2_IP/api
   ```
   Should show: "MyEnglish Backend Server is Running"

**→ When everything works, celebrate! 🎉**
**→ If something doesn't work, tell me what error you see**

---

## 🆘 TROUBLESHOOTING

### If application doesn't load:

1. **Check backend**
   ```bash
   pm2 logs
   ```

2. **Check nginx**
   ```bash
   sudo systemctl status nginx
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Check security groups**
   - AWS Console → EC2 → Security Groups
   - Make sure ports 80, 443, 3001 are open to 0.0.0.0/0

---

## 📞 NEED HELP?

**Just tell me:**
- Which step you're on
- What command you ran
- What error message you see

I'll help you fix it! 💪

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Step 1: AWS Account Created
- [ ] Step 2: EC2 Instance Launched & IP Saved
- [ ] Step 3: Connected to EC2 via SSH
- [ ] Step 4: Dependencies Installed
- [ ] Step 5: Files Uploaded
- [ ] Step 6: Backend Running
- [ ] Step 7: Nginx Configured
- [ ] Step 8: Application Working!

---

**Let's start! Tell me when you're ready for Step 1! 🚀**
