#!/bin/bash
# Script untuk dijalankan di server setelah file diupload

echo "🔧 Setting up AbsensiHR on server..."

# Create directory
sudo mkdir -p /var/www/absensihr

# Set permissions
sudo chown -R hexaon:hexaon /var/www/absensihr
sudo chmod -R 755 /var/www/absensihr

# Create nginx config
sudo tee /etc/nginx/sites-available/absensihr > /dev/null << 'EOF'
server {
    listen 80;
    server_name absensihr.local 192.168.1.44;

    root /var/www/absensihr;
    index index.html;

    access_log /var/log/nginx/absensihr_access.log;
    error_log /var/log/nginx/absensihr_error.log;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/absensihr /etc/nginx/sites-enabled/

# Remove default nginx site if exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx
sudo nginx -t

if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo "✅ Nginx configured and reloaded!"
    echo "🌐 Access at: http://192.168.1.44 or http://absensihr.local"
else
    echo "❌ Nginx configuration test failed!"
    exit 1
fi

