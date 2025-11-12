#!/bin/bash

# Deployment script untuk AbsensiHR Frontend
# Server: 192.168.1.44
# User: hexaon

SERVER_IP="192.168.1.44"
SERVER_USER="hexaon"
SERVER_PATH="/var/www/absensihr"
DOMAIN="absensihr.local"

echo "🚀 Starting deployment..."

# Build production
echo "📦 Building production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Copy files to server
echo "📤 Uploading files to server..."
scp -r dist/* ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

if [ $? -ne 0 ]; then
    echo "❌ Upload failed!"
    exit 1
fi

echo "✅ Files uploaded successfully!"

# SSH to server and setup nginx
echo "🔧 Setting up nginx configuration..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
sudo tee /etc/nginx/sites-available/absensihr > /dev/null << 'EOF'
server {
    listen 80;
    server_name absensihr.local 192.168.1.44;

    root /var/www/absensihr;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Create symlink if not exists
sudo ln -sf /etc/nginx/sites-available/absensihr /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

echo "✅ Nginx configuration updated!"
ENDSSH

if [ $? -ne 0 ]; then
    echo "❌ Server setup failed!"
    exit 1
fi

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Access your application at:"
echo "   http://${DOMAIN}"
echo "   http://192.168.1.44"
echo ""
echo "📝 Note: Add '192.168.1.44 absensihr.local' to your /etc/hosts file (or C:\\Windows\\System32\\drivers\\etc\\hosts on Windows)"
echo "   to access via domain name."

