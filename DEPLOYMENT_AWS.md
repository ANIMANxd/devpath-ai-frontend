# AWS Deployment Guide - DevPath AI Frontend

Complete guide to deploy DevPath AI Frontend on AWS EC2 t3.micro Ubuntu instance (Free Tier) with PM2 process manager for automatic restarts and continuous operation.

---

## 📋 Prerequisites

- AWS Account with Free Tier access
- Domain name (optional, but recommended)
- Backend API already deployed and accessible
- GitHub OAuth App configured with production callback URL

---

## 🚀 Step-by-Step Deployment

### Step 1: Launch EC2 Instance

1. **Log in to AWS Console**

   - Navigate to EC2 Dashboard
   - Click "Launch Instance"

2. **Configure Instance**

   - **Name**: `devpath-ai-frontend`
   - **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type**: t3.micro (1 vCPU, 1 GB RAM - Free tier eligible)
   - **Key Pair**: Create new or select existing (download .pem file)
   - **Network Settings**:
     - ✅ Allow SSH traffic from your IP
     - ✅ Allow HTTP traffic from the internet (port 80)
     - ✅ Allow HTTPS traffic from the internet (port 443)
     - ✅ Add custom TCP rule for port 3000 (for initial testing)

3. **Configure Storage**

   - 8 GB gp3 (Free tier includes up to 30 GB)
   - Increase to 15-20 GB if needed

4. **Launch Instance**
   - Click "Launch Instance"
   - Wait for instance state to become "Running"
   - Note the **Public IPv4 address**

---

### Step 2: Connect to EC2 Instance

#### For Windows (PowerShell):

```powershell
# Navigate to your .pem file location
cd C:\path\to\your\keypair

# Set permissions (if needed)
icacls "your-key.pem" /inheritance:r
icacls "your-key.pem" /grant:r "$($env:USERNAME):(R)"

# Connect via SSH
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip
```

#### For Linux/Mac:

```bash
# Set permissions
chmod 400 your-key.pem

# Connect via SSH
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

---

### Step 3: Update System and Install Dependencies

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x

# Install Git
sudo apt install -y git

# Install Nginx (for reverse proxy)
sudo apt install -y nginx

# Install PM2 globally (process manager)
sudo npm install -g pm2
```

---

### Step 4: Clone and Setup Application

```bash
# Create application directory
sudo mkdir -p /var/www
cd /var/www

# Clone repository (use HTTPS or SSH)
sudo git clone https://github.com/ANIMANxd/devpath-ai-frontend.git
cd devpath-ai-frontend

# Change ownership to ubuntu user
sudo chown -R ubuntu:ubuntu /var/www/devpath-ai-frontend

# Install dependencies
npm install
```

---

### Step 5: Configure Environment Variables

```bash
# Create production environment file
nano .env.local
```

Add the following content (replace with your actual values):

```env
# Backend API URL (your deployed backend)
NEXT_PUBLIC_API_BASE=https://your-backend-api.com

# GitHub OAuth Client ID (production)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_production_github_client_id
```

**Save and exit**: `Ctrl + X`, then `Y`, then `Enter`

---

### Step 6: Build Production Bundle

```bash
# Build Next.js application
npm run build

# Verify build succeeded
ls -la .next
```

Expected output: `.next/` directory with `standalone/`, `static/`, etc.

---

### Step 7: Setup PM2 Process Manager

PM2 will keep your application running continuously and restart it automatically if it crashes or the server reboots.

```bash
# Start application with PM2
pm2 start npm --name "devpath-ai-frontend" -- start

# View running processes
pm2 list

# View logs
pm2 logs devpath-ai-frontend

# Monitor resource usage
pm2 monit
```

**PM2 Configuration (Optional - Advanced)**

For more control, create a PM2 ecosystem file:

```bash
nano ecosystem.config.js
```

Add:

```javascript
module.exports = {
  apps: [
    {
      name: "devpath-ai-frontend",
      script: "npm",
      args: "start",
      cwd: "/var/www/devpath-ai-frontend",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/www/devpath-ai-frontend/logs/err.log",
      out_file: "/var/www/devpath-ai-frontend/logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
```

Start with ecosystem file:

```bash
# Create logs directory
mkdir -p logs

# Start with config
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd
# Copy and run the command that PM2 outputs
```

---

### Step 8: Configure Nginx Reverse Proxy

Nginx will forward traffic from port 80/443 to your Next.js app on port 3000.

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/devpath-ai-frontend
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain or IP

    # Increase buffer sizes for large responses
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files optimization
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Enable the site:**

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/devpath-ai-frontend /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

---

### Step 9: Configure Firewall (UFW)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH (important - don't lock yourself out!)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

---

### Step 10: Setup SSL Certificate (Optional but Recommended)

Use Let's Encrypt for free SSL certificate:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: yes)

# Test auto-renewal
sudo certbot renew --dry-run
```

Certbot will automatically:

- Obtain SSL certificate
- Update Nginx configuration
- Setup auto-renewal (runs twice daily)

---

### Step 11: Configure Domain DNS (If Using Domain)

In your domain registrar (GoDaddy, Namecheap, etc.):

1. **Add A Record**:

   - Type: `A`
   - Name: `@` (or subdomain like `app`)
   - Value: Your EC2 Public IP address
   - TTL: 3600 (or default)

2. **Add WWW Record** (optional):
   - Type: `CNAME`
   - Name: `www`
   - Value: Your domain name
   - TTL: 3600

Wait 5-30 minutes for DNS propagation.

---

### Step 12: Update GitHub OAuth Callback URL

Update your GitHub OAuth App with production callback URL:

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Select your app
3. **Update Authorization callback URL**:
   - Production: `https://your-backend-api.com/auth/github/callback`
   - Or: `http://your-ec2-ip:8000/auth/github/callback` (if backend on same instance)

---

### Step 13: Verify Deployment

```bash
# Check PM2 status
pm2 status

# View application logs
pm2 logs devpath-ai-frontend --lines 50

# Check Nginx status
sudo systemctl status nginx

# Test application locally
curl http://localhost:3000

# Check if site is accessible
curl http://your-domain.com
# or
curl http://your-ec2-public-ip
```

**Open in browser**:

- HTTP: `http://your-domain.com` or `http://your-ec2-ip`
- HTTPS: `https://your-domain.com` (after SSL setup)

---

## 🔄 Continuous Deployment & Updates

### Deploying Updates

Create a deployment script for easy updates:

```bash
# Create deployment script
nano /var/www/devpath-ai-frontend/deploy.sh
```

Add:

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/devpath-ai-frontend

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Install dependencies (in case new ones were added)
echo "📦 Installing dependencies..."
npm install

# Build production bundle
echo "🏗️  Building production bundle..."
npm run build

# Restart PM2 process
echo "🔄 Restarting application..."
pm2 restart devpath-ai-frontend

echo "✅ Deployment complete!"

# Show status
pm2 status
```

Make it executable:

```bash
chmod +x /var/www/devpath-ai-frontend/deploy.sh
```

**To deploy updates:**

```bash
cd /var/www/devpath-ai-frontend
./deploy.sh
```

---

## 📊 Monitoring & Maintenance

### Check Application Status

```bash
# PM2 status
pm2 status

# View logs (live)
pm2 logs devpath-ai-frontend

# View last 100 lines
pm2 logs devpath-ai-frontend --lines 100

# Monitor CPU/Memory
pm2 monit

# Application info
pm2 info devpath-ai-frontend
```

### Check System Resources

```bash
# Disk usage
df -h

# Memory usage
free -m

# CPU usage
top
# Press 'q' to quit

# Check processes
htop  # Install with: sudo apt install htop
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Restart Services

```bash
# Restart application
pm2 restart devpath-ai-frontend

# Restart Nginx
sudo systemctl restart nginx

# Restart all PM2 processes
pm2 restart all

# Reboot server (if needed)
sudo reboot
```

---

## 🔧 Troubleshooting

### Issue: Application won't start

```bash
# Check build errors
npm run build

# Check PM2 logs
pm2 logs devpath-ai-frontend --err

# Check if port 3000 is in use
sudo lsof -i :3000

# Kill process on port 3000 (if needed)
sudo kill -9 $(sudo lsof -t -i:3000)

# Restart PM2
pm2 restart devpath-ai-frontend
```

### Issue: 502 Bad Gateway

```bash
# Check if Next.js is running
pm2 status

# Check Nginx configuration
sudo nginx -t

# Check Nginx error logs
sudo tail -50 /var/log/nginx/error.log

# Restart both services
pm2 restart devpath-ai-frontend
sudo systemctl restart nginx
```

### Issue: Out of Memory

```bash
# Check memory usage
free -m

# Check PM2 memory limit
pm2 info devpath-ai-frontend

# Increase memory limit in ecosystem.config.js
# max_memory_restart: '700M'  # Increase from 500M

# Save and restart
pm2 restart devpath-ai-frontend
```

### Issue: SSL Certificate Renewal Fails

```bash
# Check Certbot status
sudo certbot certificates

# Manually renew
sudo certbot renew --force-renewal

# Check renewal timer
sudo systemctl status certbot.timer
```

### Issue: Can't connect via SSH

1. Check EC2 Security Group allows SSH (port 22) from your IP
2. Verify key pair file permissions
3. Try connecting from AWS Console using "EC2 Instance Connect"

---

## 🔐 Security Best Practices

### 1. Keep System Updated

```bash
# Regular updates
sudo apt update && sudo apt upgrade -y

# Enable automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 2. Configure Fail2Ban (SSH Protection)

```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Configure
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Enable and start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check status
sudo fail2ban-client status
```

### 3. Disable Root Login

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Change these lines:
# PermitRootLogin no
# PasswordAuthentication no

# Restart SSH
sudo systemctl restart sshd
```

### 4. Setup Log Rotation

```bash
# Create PM2 log rotation config
pm2 install pm2-logrotate

# Configure (optional)
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 💰 Cost Optimization (Free Tier)

- **t3.micro**: 750 hours/month free (24/7 operation)
- **Storage**: 30 GB free (use 15-20 GB)
- **Data Transfer**: 100 GB/month free (outbound)
- **Elastic IP**: Free when attached to running instance

**After Free Tier expires:**

- t3.micro: ~$8-10/month
- Storage (20 GB): ~$2/month
- **Total**: ~$10-12/month

---

## 📝 Quick Reference Commands

```bash
# Application Management
pm2 status                          # Check status
pm2 restart devpath-ai-frontend    # Restart app
pm2 logs devpath-ai-frontend       # View logs
pm2 monit                          # Monitor resources

# Nginx Management
sudo nginx -t                       # Test config
sudo systemctl restart nginx        # Restart Nginx
sudo systemctl status nginx         # Check status

# System Management
sudo systemctl status               # System status
df -h                              # Disk usage
free -m                            # Memory usage
top                                # CPU usage

# Deployment
cd /var/www/devpath-ai-frontend
./deploy.sh                        # Deploy updates

# Security
sudo ufw status                     # Firewall status
sudo fail2ban-client status         # Fail2Ban status
```

---

## 🎉 You're Done!

Your DevPath AI Frontend is now:

- ✅ Running 24/7 on AWS EC2
- ✅ Auto-restarts on crashes (PM2)
- ✅ Auto-starts on server reboot
- ✅ Accessible via domain/IP
- ✅ Secured with SSL (optional)
- ✅ Protected by firewall
- ✅ Production-ready

**Access your application**: `https://your-domain.com` or `http://your-ec2-ip`

---

**Questions or Issues?**  
Check the troubleshooting section or create an issue on GitHub.

**Built for production. Built to last.** 🚀
