# Production Troubleshooting Guide

Quick guide to diagnose and fix common production issues in DevPath AI Frontend.

---

## 🔍 Issue: "Analysis Failed" with HTML Content

### Symptoms:
- Error message shows raw HTML (DOCTYPE, meta tags, scripts)
- Analysis fails immediately
- Error contains nginx or server HTML

### Root Causes:

#### 1. Backend Not Running
**Diagnosis:**
```bash
# SSH into your backend server
curl http://localhost:8000/
# Should return: {"message": "Welcome to DevPath AI API"}
```

**Fix:**
```bash
# Check if backend is running
pm2 status
# or
sudo systemctl status your-backend-service

# Restart backend
pm2 restart devpath-ai-backend
# or
sudo systemctl restart your-backend-service
```

#### 2. Wrong API URL in Environment Variables
**Diagnosis:**
```bash
# On frontend server
cat .env.local
# Check NEXT_PUBLIC_API_BASE value
```

**Fix:**
```bash
# Update .env.local with correct backend URL
nano .env.local

# Change to:
NEXT_PUBLIC_API_BASE=https://your-actual-backend-url.com
# or
NEXT_PUBLIC_API_BASE=http://your-backend-ip:8000

# Rebuild and restart
npm run build
pm2 restart devpath-ai-frontend
```

#### 3. CORS Configuration
**Diagnosis:**
Check browser console (F12) for CORS errors:
```
Access to fetch at 'http://backend-url' from origin 'http://frontend-url' 
has been blocked by CORS policy
```

**Fix (Backend):**
```python
# In backend main.py or app.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://your-frontend-domain.com",
        "https://your-frontend-domain.com",
        "http://your-ec2-ip",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Restart backend after changes.

#### 4. Nginx Reverse Proxy Issues
**Diagnosis:**
```bash
# Check nginx error logs
sudo tail -50 /var/log/nginx/error.log

# Test nginx config
sudo nginx -t
```

**Fix:**
```bash
# Edit nginx config
sudo nano /etc/nginx/sites-available/devpath-ai-backend

# Ensure proxy_pass points to correct backend port:
location / {
    proxy_pass http://localhost:8000;  # Adjust port if needed
    # ... other settings
}

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. Backend Port Not Listening
**Diagnosis:**
```bash
# Check what's listening on port 8000
sudo lsof -i :8000
# or
sudo netstat -tlnp | grep 8000
```

**Fix:**
```bash
# If nothing is listening, backend isn't running
pm2 start your-backend-process

# If wrong process, kill and restart
sudo kill -9 <PID>
pm2 start your-backend-process
```

---

## 🔒 Issue: "Your session has expired" (401 Errors)

### Symptoms:
- Gets logged out unexpectedly
- "Please log in again" message
- Works temporarily after re-login

### Root Causes:

#### 1. JWT Token Expired
**Diagnosis:**
- Check token expiration time in backend logs
- Typical JWT expiration: 7 days

**Fix (Backend):**
```python
# Increase JWT expiration time
ACCESS_TOKEN_EXPIRE_MINUTES = 10080  # 7 days
# or
ACCESS_TOKEN_EXPIRE_MINUTES = 43200  # 30 days

# Restart backend
```

#### 2. Backend Restarted (In-Memory Token Store)
**Diagnosis:**
- All users logged out after backend restart
- Backend using in-memory session storage

**Fix:**
- Ensure backend uses database for session storage
- Users will need to re-login once

#### 3. Token Validation Issues
**Diagnosis:**
```bash
# Check backend logs for JWT validation errors
pm2 logs devpath-ai-backend --err
```

**Fix:**
- Ensure `SECRET_KEY` hasn't changed in backend
- Verify `ALGORITHM` setting (usually "HS256")

---

## 🌐 Issue: Cannot Connect to Backend

### Symptoms:
- "Cannot connect to backend at..."
- Network errors in console
- Timeout errors

### Root Causes:

#### 1. Backend Server Down
**Diagnosis:**
```bash
# SSH into backend server
systemctl status your-backend-service
pm2 status
```

**Fix:**
```bash
pm2 restart devpath-ai-backend
# or
sudo systemctl restart your-backend-service
```

#### 2. Firewall Blocking Requests
**Diagnosis:**
```bash
# Check firewall rules
sudo ufw status

# Test connection from frontend server
curl http://backend-ip:8000/
```

**Fix:**
```bash
# On backend server, allow port 8000
sudo ufw allow 8000/tcp
sudo ufw reload

# On AWS, check Security Group allows inbound on port 8000
```

#### 3. DNS Not Resolving
**Diagnosis:**
```bash
# Test DNS resolution
nslookup your-backend-domain.com

# Test with IP directly
curl http://backend-ip:8000/
```

**Fix:**
- Update DNS A record to point to correct IP
- Wait 5-30 minutes for DNS propagation
- Use IP address temporarily in .env.local

#### 4. SSL Certificate Issues
**Diagnosis:**
```bash
# Test HTTPS endpoint
curl -v https://your-backend-domain.com/

# Look for SSL errors
```

**Fix:**
```bash
# Renew SSL certificate
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

---

## ⚡ Issue: Slow Analysis or Timeouts

### Symptoms:
- Analysis takes >2 minutes
- Timeout errors
- "Request failed" messages

### Root Causes:

#### 1. Backend Resource Constraints
**Diagnosis:**
```bash
# Check CPU/Memory usage
top
htop
free -m
```

**Fix:**
- Upgrade EC2 instance (t3.micro → t3.small)
- Optimize backend code
- Add caching layer

#### 2. GitHub API Rate Limiting
**Diagnosis:**
```bash
# Check backend logs for rate limit errors
pm2 logs devpath-ai-backend | grep -i "rate limit"
```

**Fix:**
- Use authenticated GitHub requests (increases limit to 5000/hour)
- Implement request caching
- Use GitHub PAT with higher limits

#### 3. Nginx Timeout Settings Too Low
**Diagnosis:**
```bash
# Check nginx config
sudo nano /etc/nginx/sites-available/devpath-ai-frontend
```

**Fix:**
```nginx
# Increase timeouts in nginx config
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;

# Reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🗄️ Issue: Report History Not Loading

### Symptoms:
- History tab shows "No reports yet"
- Reports not persisting
- "Failed to load report history"

### Root Causes:

#### 1. Database Not Connected
**Diagnosis:**
```bash
# Check backend logs
pm2 logs devpath-ai-backend | grep -i "database"

# Check database service
sudo systemctl status postgresql
# or
sudo systemctl status mysql
```

**Fix:**
```bash
# Restart database
sudo systemctl restart postgresql

# Check backend database connection string
# Ensure correct credentials in backend .env
```

#### 2. Database Permissions
**Diagnosis:**
```bash
# Connect to database
psql -U your_db_user -d your_db_name

# Check tables exist
\dt
```

**Fix:**
```sql
-- Ensure reports table exists
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    report_data JSONB NOT NULL
);

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE reports TO your_db_user;
```

---

## 🔧 Quick Diagnostic Commands

### Frontend Server:
```bash
# Check application status
pm2 status
pm2 logs devpath-ai-frontend --lines 50

# Check environment variables
cat .env.local

# Test backend connectivity
curl $NEXT_PUBLIC_API_BASE/

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# View Nginx logs
sudo tail -50 /var/log/nginx/access.log
sudo tail -50 /var/log/nginx/error.log
```

### Backend Server:
```bash
# Check application status
pm2 status
pm2 logs devpath-ai-backend --lines 50

# Check if backend is responding
curl http://localhost:8000/

# Check database
sudo systemctl status postgresql

# Check firewall
sudo ufw status

# Check port listening
sudo lsof -i :8000
```

### Browser (F12 Console):
```javascript
// Check stored JWT
localStorage.getItem('auth-storage')

// Check API base URL
console.log(process.env.NEXT_PUBLIC_API_BASE)

// Test API call manually
fetch('http://your-backend-url/').then(r => r.json()).then(console.log)
```

---

## 🚨 Emergency Recovery

### Complete Reset:

#### Frontend:
```bash
cd /var/www/devpath-ai-frontend

# Pull latest code
git pull origin main

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build

# Restart
pm2 restart devpath-ai-frontend

# Check logs
pm2 logs devpath-ai-frontend
```

#### Backend:
```bash
cd /path/to/backend

# Pull latest code
git pull origin main

# Reinstall dependencies
source venv/bin/activate
pip install -r requirements.txt

# Restart
pm2 restart devpath-ai-backend

# Check logs
pm2 logs devpath-ai-backend
```

---

## 📊 Monitoring Setup

### Setup Log Monitoring:

```bash
# Install logwatch
sudo apt install logwatch

# View today's logs
sudo logwatch --detail high --service all --range today --format text
```

### Setup Uptime Monitoring:

Use services like:
- **UptimeRobot** (free)
- **Pingdom** (free tier)
- **StatusCake** (free tier)

Monitor:
- Frontend URL: `https://your-frontend.com`
- Backend health: `https://your-backend.com/health`

### Setup Error Alerts:

```bash
# Create alert script
nano /var/www/devpath-ai-frontend/check-health.sh
```

```bash
#!/bin/bash
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://your-backend-url:8000"

# Check frontend
if ! curl -f $FRONTEND_URL > /dev/null 2>&1; then
    echo "Frontend down!" | mail -s "Alert: Frontend Down" your-email@example.com
    pm2 restart devpath-ai-frontend
fi

# Check backend
if ! curl -f $BACKEND_URL > /dev/null 2>&1; then
    echo "Backend down!" | mail -s "Alert: Backend Down" your-email@example.com
fi
```

Add to crontab:
```bash
crontab -e

# Add:
*/5 * * * * /var/www/devpath-ai-frontend/check-health.sh
```

---

## 📞 Getting Help

1. **Check logs first**: `pm2 logs` is your best friend
2. **Browser console**: F12 → Console and Network tabs
3. **Verify all services running**: PM2, Nginx, Database
4. **Test connectivity**: curl commands from server
5. **Check environment variables**: Ensure all are correct

**Common Fix Order:**
1. Restart backend
2. Restart frontend
3. Check/update .env.local
4. Rebuild frontend
5. Check firewall/security groups
6. Verify nginx configuration

---

**Still stuck?** Create an issue on GitHub with:
- Error message (full text)
- Browser console logs
- PM2 logs output
- Server details (OS, versions)
