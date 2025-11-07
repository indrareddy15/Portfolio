# 🚀 Award Application - Hostinger Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Database Configuration](#database-configuration)
6. [Web Server Configuration](#web-server-configuration)
7. [SSL Certificate Setup](#ssl-certificate-setup)
8. [Domain Configuration](#domain-configuration)
9. [Security Configuration](#security-configuration)
10. [Testing & Verification](#testing--verification)
11. [Monitoring & Maintenance](#monitoring--maintenance)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Services & Accounts

- [ ] **Hostinger VPS** (VPS 1 or higher - minimum 4GB RAM)
- [ ] **MongoDB Atlas** account for database hosting
- [ ] **Cloudinary** account for image storage
- [ ] **Razorpay** account for payment processing
- [ ] **Shiprocket** account for shipping integration
- [ ] **Gmail** account with app password for email notifications
- [ ] **Domain name** (can be purchased through Hostinger)

### Local Requirements

- Git installed on your local machine
- SSH client (PuTTY for Windows, built-in for Mac/Linux)
- Text editor for configuration files

---

## Server Setup

### Step 1: Purchase Hostinger VPS

1. **Login to Hostinger Control Panel**

   - Go to [Hostinger](https://www.hostinger.com)
   - Login to your account

2. **Purchase VPS**

   - Navigate to VPS section
   - Choose **VPS Plan**:
     - **Minimum**: VPS 1 (1 vCPU, 4GB RAM, 20GB SSD)
     - **Recommended**: VPS 2 (2 vCPU, 8GB RAM, 40GB SSD)
   - Select **Ubuntu 22.04 LTS** as operating system
   - Complete purchase

3. **Access VPS Details**
   - Note down server IP address
   - Note down root password (or set up SSH key)

### Step 2: Initial Server Configuration

1. **Connect to Server via SSH**

   ```bash
   # Windows (using PowerShell or Command Prompt)
   ssh root@YOUR_SERVER_IP

   # Enter password when prompted
   ```

2. **Update System Packages**

   ```bash
   # Update package list and upgrade system
   apt update && apt upgrade -y

   # Reboot if kernel was updated
   reboot
   ```

3. **Install Node.js 18 LTS**

   ```bash
   # Add NodeSource repository
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

   # Install Node.js
   apt-get install -y nodejs

   # Verify installation
   node --version
   npm --version
   ```

4. **Install Required System Packages**

   ```bash
   # Install essential packages
   apt install -y nginx certbot python3-certbot-nginx git htop ufw curl wget

   # Install PM2 globally for process management
   npm install -g pm2

   # Verify PM2 installation
   pm2 --version
   ```

### Step 3: Create Application User

1. **Create Dedicated User for Security**

   ```bash
   # Create new user
   adduser award-app
   # Follow prompts to set password and user details

   # Add user to sudo group
   usermod -aG sudo award-app

   # Switch to new user
   su - award-app
   ```

2. **Setup SSH Key for Application User (Optional but Recommended)**

   ```bash
   # Generate SSH key pair
   ssh-keygen -t rsa -b 4096 -C "award-app@yourserver"

   # Add public key to authorized_keys
   mkdir -p ~/.ssh
   cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

---

## Backend Deployment

### Step 1: Clone and Setup Repository

1. **Navigate to Application Directory**

   ```bash
   cd /home/award-app
   ```

2. **Clone Repository**

   ```bash
   # Clone your repository (replace with your actual repo URL)
   git clone https://github.com/yourusername/award-application.git award-app

   # Navigate to backend directory
   cd award-app/backend
   ```

3. **Install Backend Dependencies**

   ```bash
   # Install production dependencies
   npm install --production

   # Verify installation
   ls node_modules
   ```

### Step 2: Configure Backend Environment

1. **Create Production Environment File**

   ```bash
   # Create .env file
   nano .env
   ```

2. **Backend Environment Configuration**

   ```env
   # =============================================================================
   # PRODUCTION ENVIRONMENT CONFIGURATION
   # =============================================================================

   # Server Configuration
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://yourdomain.com

   # Database Configuration
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mytrade-award?retryWrites=true&w=majority
   DB_NAME=mytrade-award

   # JWT Configuration
   JWT_SECRET=your-super-secure-64-character-jwt-secret-string-change-this
   JWT_EXPIRES_IN=30d

   # Razorpay Configuration (Production Keys)
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_razorpay_live_secret_key
   RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

   # Shiprocket Configuration
   SHIPROCKET_EMAIL=your-email@company.com
   SHIPROCKET_PASSWORD=your-shiprocket-password
   SHIPROCKET_BASE_URL=https://apiv2.shiprocket.in/v1/external
   SHIPROCKET_WEBHOOK_SECRET=your-shiprocket-webhook-secret

   # Company Details for Shipping
   COMPANY_NAME=My Trade Award
   COMPANY_PHONE=+91XXXXXXXXXX
   COMPANY_EMAIL=orders@yourdomain.com
   COMPANY_ADDRESS=Your Company Address
   COMPANY_CITY=Your City
   COMPANY_STATE=Your State
   COMPANY_PINCODE=123456
   COMPANY_COUNTRY=India

   # Email Configuration (Gmail)
   G_MAIL_USER=your-gmail@gmail.com
   G_MAIL_PASSWORD=your-16-digit-gmail-app-password
   G_MAIL_PORT=465
   G_MAIL_HOST=smtp.gmail.com

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_FOLDER_PREFIX=awardmaker

   # Security Configuration
   CORS_ORIGIN=https://yourdomain.com
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # Logging
   LOG_LEVEL=info

   # License Configuration (Auto-Kill System)
   LICENSE_EXPIRY_DATE=2026-11-07T23:59:59Z
   LICENSE_SECRET_KEY=CHANGE_THIS_SECRET_KEY_IN_PRODUCTION
   LICENSE_WARNING_DAYS=7
   LICENSE_CHECK_INTERVAL_MS=60000
   ```

   **Save and exit**: Press `Ctrl+X`, then `Y`, then `Enter`

### Step 3: Setup PM2 Process Manager

1. **Create PM2 Ecosystem Configuration**

   ```bash
   # Create PM2 configuration file
   nano ecosystem.config.js
   ```

2. **PM2 Configuration Content**

   ```javascript
   module.exports = {
     apps: [
       {
         name: "award-backend",
         script: "./src/server.js",
         instances: 1,
         autorestart: true,
         watch: false,
         max_memory_restart: "1G",
         env: {
           NODE_ENV: "production",
           PORT: 5000,
         },
         error_file: "./logs/err.log",
         out_file: "./logs/out.log",
         log_file: "./logs/combined.log",
         time: true,
       },
     ],
   };
   ```

3. **Create Logs Directory and Start Application**

   ```bash
   # Create logs directory
   mkdir -p logs

   # Start application with PM2
   pm2 start ecosystem.config.js

   # Save PM2 process list
   pm2 save

   # Setup PM2 to start on system boot
   pm2 startup
   # Copy and run the command that PM2 outputs
   ```

4. **Verify Backend is Running**

   ```bash
   # Check PM2 status
   pm2 status

   # Check application logs
   pm2 logs award-backend

   # Test backend locally
   curl http://localhost:5000
   ```

---

## Frontend Deployment

### Step 1: Prepare Frontend Build

1. **Navigate to Frontend Directory**

   ```bash
   cd /home/award-app/award-app/frontend
   ```

2. **Install Frontend Dependencies**
   ```bash
   # Install all dependencies
   npm install
   ```

### Step 2: Configure Frontend Environment

1. **Create Production Environment File**

   ```bash
   # Create production environment file
   nano .env.production
   ```

2. **Frontend Environment Configuration**

   ```env
   # API Configuration
   VITE_API_URL=https://api.yourdomain.com/api

   # App Configuration
   VITE_APP_NAME=My Trade Award

   # License Configuration (Must match backend exactly)
   VITE_LICENSE_EXPIRY_DATE=2026-11-07T23:59:59Z
   VITE_LICENSE_CHECK_INTERVAL=60000
   ```

### Step 3: Build and Deploy Frontend

1. **Build Frontend for Production**

   ```bash
   # Build the application
   npm run build

   # Verify build was successful
   ls -la dist/
   ```

2. **Deploy to Web Directory**

   ```bash
   # Create web directory
   sudo mkdir -p /var/www/award-frontend

   # Copy build files
   sudo cp -r dist/* /var/www/award-frontend/

   # Set proper permissions
   sudo chown -R www-data:www-data /var/www/award-frontend
   sudo chmod -R 755 /var/www/award-frontend

   # Verify files are copied
   ls -la /var/www/award-frontend/
   ```

---

## Database Configuration

### Step 1: Setup MongoDB Atlas

1. **Create MongoDB Atlas Account**

   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account
   - Create new project

2. **Create Database Cluster**

   - Click "Create Cluster"
   - Choose free tier (M0)
   - Select region closest to your server
   - Name your cluster (e.g., "award-cluster")

3. **Configure Database Access**

   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and strong password
   - Set role to "Read and write to any database"

4. **Configure Network Access**

   - Go to "Network Access"
   - Click "Add IP Address"
   - Add your server IP address
   - Also add `0.0.0.0/0` for development (remove later for security)

5. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

---

## Web Server Configuration

### Step 1: Configure Nginx

1. **Create Nginx Site Configuration**

   ```bash
   # Create new site configuration
   sudo nano /etc/nginx/sites-available/award-app
   ```

2. **Nginx Configuration Content**

   ```nginx
   # Frontend Server Configuration
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       root /var/www/award-frontend;
       index index.html;

       # Handle React Router (SPA)
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Static assets optimization
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
           add_header Access-Control-Allow-Origin "*";
       }

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header Referrer-Policy "no-referrer-when-downgrade" always;
       add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

       # Gzip compression
       gzip on;
       gzip_vary on;
       gzip_min_length 1024;
       gzip_proxied expired no-cache no-store private must-revalidate max-age=0;
       gzip_types
           text/plain
           text/css
           text/xml
           text/javascript
           application/javascript
           application/xml+rss
           application/json;
   }

   # API Server Configuration
   server {
       listen 80;
       server_name api.yourdomain.com;

       # API proxy configuration
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
           proxy_read_timeout 300s;
           proxy_connect_timeout 75s;
           proxy_send_timeout 300s;
       }

       # Increase client max body size for file uploads
       client_max_body_size 10M;

       # Security headers for API
       add_header X-Frame-Options "DENY" always;
       add_header X-Content-Type-Options "nosniff" always;
   }
   ```

3. **Enable Site and Test Configuration**

   ```bash
   # Enable the site
   sudo ln -s /etc/nginx/sites-available/award-app /etc/nginx/sites-enabled/

   # Remove default site if it exists
   sudo rm -f /etc/nginx/sites-enabled/default

   # Test Nginx configuration
   sudo nginx -t

   # If test passes, restart Nginx
   sudo systemctl restart nginx
   sudo systemctl enable nginx

   # Check Nginx status
   sudo systemctl status nginx
   ```

---

## SSL Certificate Setup

### Step 1: Install SSL Certificates with Let's Encrypt

1. **Install Certbot SSL for Main Domain**

   ```bash
   # Install SSL certificate for frontend
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

   # Follow the prompts:
   # - Enter email address
   # - Agree to terms of service
   # - Choose whether to share email with EFF
   # - Select option 2 (Redirect HTTP to HTTPS)
   ```

2. **Install SSL for API Subdomain**

   ```bash
   # Install SSL certificate for API
   sudo certbot --nginx -d api.yourdomain.com
   ```

3. **Test SSL Certificate Auto-renewal**

   ```bash
   # Test automatic renewal
   sudo certbot renew --dry-run

   # Check SSL certificate status
   sudo certbot certificates
   ```

4. **Setup Auto-renewal Cron Job**

   ```bash
   # Edit crontab
   sudo crontab -e

   # Add this line to check for renewal twice daily
   0 12 * * * /usr/bin/certbot renew --quiet
   ```

---

## Domain Configuration

### Step 1: Configure DNS Records

1. **Access Hostinger Control Panel**

   - Login to Hostinger
   - Go to "DNS Zone Editor" for your domain

2. **Add Required DNS Records**

   ```dns
   Type    Name    Value               TTL
   A       @       YOUR_SERVER_IP      3600
   A       www     YOUR_SERVER_IP      3600
   A       api     YOUR_SERVER_IP      3600
   CNAME   www     yourdomain.com      3600
   ```

3. **Verify DNS Propagation**

   ```bash
   # Check DNS propagation (run from your local machine)
   nslookup yourdomain.com
   nslookup api.yourdomain.com

   # Or use online tools like:
   # https://www.whatsmydns.net/
   ```

---

## Security Configuration

### Step 1: Configure UFW Firewall

1. **Setup Basic Firewall Rules**

   ```bash
   # Enable UFW
   sudo ufw enable

   # Allow SSH (adjust port if you changed it)
   sudo ufw allow 22/tcp

   # Allow HTTP and HTTPS
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp

   # Check firewall status
   sudo ufw status verbose
   ```

### Step 2: Secure SSH Configuration (Optional but Recommended)

1. **Modify SSH Configuration**

   ```bash
   # Edit SSH configuration
   sudo nano /etc/ssh/sshd_config
   ```

2. **Recommended SSH Security Settings**

   ```bash
   # Change these lines (uncomment if commented):
   Port 2222                    # Change from default 22
   PermitRootLogin no          # Disable root login
   PasswordAuthentication no   # Disable password auth (only if using SSH keys)
   PubkeyAuthentication yes    # Enable SSH key authentication
   MaxAuthTries 3              # Limit authentication attempts
   ```

3. **Restart SSH Service**

   ```bash
   # Restart SSH (be careful not to lock yourself out!)
   sudo systemctl restart ssh

   # If you changed the port, update firewall:
   sudo ufw allow 2222/tcp
   sudo ufw delete allow 22/tcp
   ```

### Step 3: Setup Fail2Ban (Optional)

1. **Install and Configure Fail2Ban**

   ```bash
   # Install fail2ban
   sudo apt install fail2ban

   # Create configuration file
   sudo nano /etc/fail2ban/jail.local
   ```

2. **Fail2Ban Configuration**

   ```ini
   [DEFAULT]
   bantime = 1h
   findtime = 10m
   maxretry = 3

   [sshd]
   enabled = true
   port = 2222
   logpath = /var/log/auth.log
   ```

3. **Start Fail2Ban**
   ```bash
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   sudo fail2ban-client status
   ```

---

## Testing & Verification

### Step 1: Backend Testing

1. **Test API Endpoints**

   ```bash
   # Test root endpoint
   curl https://api.yourdomain.com/

   # Test health check
   curl https://api.yourdomain.com/health

   # Test products endpoint
   curl https://api.yourdomain.com/api/products
   ```

2. **Check Backend Logs**

   ```bash
   # Check PM2 logs
   pm2 logs award-backend

   # Check specific log files
   tail -f /home/award-app/award-app/backend/logs/combined.log
   ```

### Step 2: Frontend Testing

1. **Test Frontend Access**

   ```bash
   # Test main domain
   curl -I https://yourdomain.com/

   # Test specific routes
   curl -I https://yourdomain.com/products
   curl -I https://yourdomain.com/login
   ```

2. **Verify Static Assets**
   ```bash
   # Check if CSS and JS files are loading
   curl -I https://yourdomain.com/assets/index.css
   curl -I https://yourdomain.com/assets/index.js
   ```

### Step 3: Complete Application Testing

1. **Browser Testing Checklist**

   - [ ] Main website loads (https://yourdomain.com)
   - [ ] User registration works
   - [ ] User login works
   - [ ] Product browsing works
   - [ ] Cart functionality works
   - [ ] Payment integration works (test mode)
   - [ ] Admin panel accessible
   - [ ] File uploads work (images)
   - [ ] Email notifications work

2. **Performance Testing**

   ```bash
   # Test website speed
   curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com/

   # Create curl-format.txt for detailed timing
   echo '     time_namelookup:  %{time_namelookup}\n
        time_connect:     %{time_connect}\n
        time_appconnect:  %{time_appconnect}\n
        time_pretransfer: %{time_pretransfer}\n
        time_redirect:    %{time_redirect}\n
        time_starttransfer: %{time_starttransfer}\n
                         ----------\n
        time_total:       %{time_total}\n' > curl-format.txt
   ```

---

## Monitoring & Maintenance

### Step 1: Setup System Monitoring

1. **Install System Monitoring Tools**

   ```bash
   # htop is already installed, but let's add more tools
   sudo apt install -y iotop nethogs ncdu
   ```

2. **Monitor System Resources**

   ```bash
   # Check system resources
   htop              # Interactive process viewer
   df -h            # Disk usage
   free -m          # Memory usage
   iotop            # Disk I/O usage
   nethogs          # Network usage by process
   ```

3. **Setup Log Rotation for Application Logs**

   ```bash
   # Install PM2 log rotation
   pm2 install pm2-logrotate

   # Configure log rotation
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 7
   pm2 set pm2-logrotate:compress true
   ```

### Step 2: Create Maintenance Scripts

1. **Create Backup Script**

   ```bash
   # Create scripts directory
   mkdir -p /home/award-app/scripts

   # Create backup script
   nano /home/award-app/scripts/backup.sh
   ```

2. **Backup Script Content**

   ```bash
   #!/bin/bash

   # Backup script for Award application
   DATE=$(date +%Y%m%d_%H%M%S)
   BACKUP_DIR="/home/award-app/backups"
   APP_DIR="/home/award-app/award-app"

   # Create backup directory
   mkdir -p $BACKUP_DIR

   # Save PM2 processes
   pm2 save

   # Create application backup
   tar -czf "$BACKUP_DIR/award-app-$DATE.tar.gz" \
       --exclude="$APP_DIR/backend/node_modules" \
       --exclude="$APP_DIR/frontend/node_modules" \
       --exclude="$APP_DIR/backend/logs" \
       "$APP_DIR"

   # Remove backups older than 7 days
   find $BACKUP_DIR -name "award-app-*.tar.gz" -mtime +7 -delete

   echo "Backup completed: award-app-$DATE.tar.gz"
   ```

3. **Create Update Script**

   ```bash
   # Create update script
   nano /home/award-app/scripts/update.sh
   ```

4. **Update Script Content**

   ```bash
   #!/bin/bash

   # Update script for Award application
   cd /home/award-app/award-app

   echo "Pulling latest changes..."
   git pull origin main

   echo "Updating backend..."
   cd backend
   npm install --production

   echo "Updating frontend..."
   cd ../frontend
   npm install
   npm run build

   echo "Deploying frontend..."
   sudo cp -r dist/* /var/www/award-frontend/

   echo "Restarting backend..."
   pm2 restart award-backend

   echo "Update completed successfully!"
   ```

5. **Make Scripts Executable**
   ```bash
   chmod +x /home/award-app/scripts/*.sh
   ```

### Step 3: Setup Automated Backups

1. **Setup Cron Jobs**

   ```bash
   # Edit crontab
   crontab -e

   # Add backup schedule (daily at 2 AM)
   0 2 * * * /home/award-app/scripts/backup.sh >> /home/award-app/logs/backup.log 2>&1
   ```

### Step 4: Health Check Script

1. **Create Health Check Script**

   ```bash
   nano /home/award-app/scripts/health-check.sh
   ```

2. **Health Check Script Content**

   ```bash
   #!/bin/bash

   # Health check script
   LOG_FILE="/home/award-app/logs/health-check.log"
   DATE=$(date '+%Y-%m-%d %H:%M:%S')

   echo "[$DATE] Starting health check..." >> $LOG_FILE

   # Check if backend is running
   if pm2 describe award-backend | grep -q "online"; then
       echo "[$DATE] Backend: OK" >> $LOG_FILE
   else
       echo "[$DATE] Backend: FAILED - Restarting..." >> $LOG_FILE
       pm2 restart award-backend
   fi

   # Check if website is accessible
   if curl -s https://yourdomain.com/ > /dev/null; then
       echo "[$DATE] Frontend: OK" >> $LOG_FILE
   else
       echo "[$DATE] Frontend: FAILED" >> $LOG_FILE
   fi

   # Check if API is accessible
   if curl -s https://api.yourdomain.com/ > /dev/null; then
       echo "[$DATE] API: OK" >> $LOG_FILE
   else
       echo "[$DATE] API: FAILED" >> $LOG_FILE
   fi

   echo "[$DATE] Health check completed" >> $LOG_FILE
   ```

3. **Schedule Health Checks**
   ```bash
   # Add to crontab (every 5 minutes)
   */5 * * * * /home/award-app/scripts/health-check.sh
   ```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: 502 Bad Gateway Error

**Symptoms**: Nginx shows 502 error when accessing API

**Diagnosis**:

```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs award-backend

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

**Solutions**:

```bash
# Restart backend
pm2 restart award-backend

# Check if port 5000 is being used
sudo netstat -tlnp | grep :5000

# Restart Nginx
sudo systemctl restart nginx
```

#### Issue 2: CORS Errors

**Symptoms**: Frontend can't connect to API due to CORS errors

**Solution**:

```bash
# Check backend CORS configuration in .env
nano /home/award-app/award-app/backend/.env

# Ensure FRONTEND_URL matches your domain
FRONTEND_URL=https://yourdomain.com

# Restart backend after changes
pm2 restart award-backend
```

#### Issue 3: SSL Certificate Issues

**Symptoms**: SSL certificate not working or expired

**Diagnosis**:

```bash
# Check certificate status
sudo certbot certificates

# Test certificate renewal
sudo certbot renew --dry-run
```

**Solutions**:

```bash
# Force certificate renewal
sudo certbot renew --force-renewal

# Restart Nginx
sudo systemctl restart nginx
```

#### Issue 4: Database Connection Issues

**Symptoms**: Backend can't connect to MongoDB

**Diagnosis**:

```bash
# Check backend logs for database errors
pm2 logs award-backend

# Test MongoDB connection string manually
```

**Solutions**:

```bash
# Verify MongoDB Atlas IP whitelist includes server IP
# Check MongoDB Atlas user permissions
# Verify connection string in .env file

# Test connection with a simple script
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('DB Connected'))
  .catch(err => console.log('DB Error:', err));
"
```

#### Issue 5: File Upload Issues

**Symptoms**: Image uploads not working

**Diagnosis**:

```bash
# Check Cloudinary configuration
nano /home/award-app/award-app/backend/.env

# Check Nginx client_max_body_size
sudo nano /etc/nginx/sites-available/award-app
```

**Solutions**:

```bash
# Verify Cloudinary credentials
# Increase Nginx upload limit if needed
client_max_body_size 10M;

# Restart Nginx after changes
sudo systemctl restart nginx
```

#### Issue 6: High Memory Usage

**Symptoms**: Server running out of memory

**Diagnosis**:

```bash
# Check memory usage
free -m
htop

# Check which processes are using memory
ps aux --sort=-%mem | head
```

**Solutions**:

```bash
# Restart PM2 processes
pm2 restart all

# Add swap file if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Emergency Procedures

#### Complete System Recovery

1. **If System is Unresponsive**:

   ```bash
   # Reboot server through Hostinger control panel
   # After reboot, check all services:

   sudo systemctl status nginx
   pm2 status
   sudo systemctl status mongodb  # if local MongoDB
   ```

2. **If Application Won't Start**:

   ```bash
   # Check and fix file permissions
   sudo chown -R award-app:award-app /home/award-app/award-app

   # Reinstall dependencies
   cd /home/award-app/award-app/backend
   rm -rf node_modules
   npm install --production

   # Restart with PM2
   pm2 delete all
   pm2 start ecosystem.config.js
   ```

3. **If Database is Corrupted**:
   ```bash
   # Restore from backup (if using local MongoDB)
   # Or create new MongoDB Atlas cluster
   # Update connection string in .env
   # Restart backend
   ```

### Support Contacts

- **Hostinger Support**: Available through control panel
- **MongoDB Atlas Support**: support.mongodb.com
- **Cloudinary Support**: support.cloudinary.com
- **Razorpay Support**: razorpay.com/support
- **Shiprocket Support**: shiprocket.in/support

---

## Deployment Checklist

### Pre-Deployment

- [ ] All external services accounts created
- [ ] Domain purchased and configured
- [ ] VPS purchased and set up
- [ ] SSL certificates installed
- [ ] Environment variables configured

### Deployment

- [ ] Backend deployed and running
- [ ] Frontend built and deployed
- [ ] Database connected
- [ ] Web server configured
- [ ] Security measures implemented

### Post-Deployment

- [ ] All functionality tested
- [ ] Monitoring set up
- [ ] Backup scripts created
- [ ] Health checks implemented
- [ ] Performance optimized

### Maintenance

- [ ] Regular backups scheduled
- [ ] Update procedures documented
- [ ] Monitoring alerts configured
- [ ] Security patches applied regularly

---

## Conclusion

This comprehensive deployment guide covers all aspects of deploying your Award application to Hostinger. Follow each step carefully and test thoroughly at each stage. Remember to:

1. **Security First**: Always use strong passwords, enable firewalls, and keep systems updated
2. **Monitor Everything**: Set up proper monitoring and alerting
3. **Backup Regularly**: Automate backups and test restore procedures
4. **Document Changes**: Keep track of any modifications you make
5. **Plan for Scale**: Monitor performance and plan for growth

For additional support or custom modifications, refer to the troubleshooting section or contact the relevant service providers.

**Good luck with your deployment! 🚀**
