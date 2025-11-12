# PowerShell Deployment script untuk AbsensiHR Frontend
# Server: 192.168.1.44
# User: hexaon

$SERVER_IP = "192.168.1.44"
$SERVER_USER = "hexaon"
$SERVER_PATH = "/var/www/absensihr"
$DOMAIN = "absensihr.local"

Write-Host "🚀 Starting deployment..." -ForegroundColor Cyan

# Build production
Write-Host "📦 Building production..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Check if SSH and SCP are available (requires OpenSSH or WSL)
Write-Host "📤 Uploading files to server..." -ForegroundColor Yellow

# Using scp to upload files
$distPath = Join-Path $PSScriptRoot "dist"
$files = Get-ChildItem -Path $distPath -Recurse -File

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($distPath.Length + 1)
    $remotePath = "$SERVER_PATH/$relativePath".Replace('\', '/')
    
    Write-Host "Uploading: $relativePath" -ForegroundColor Gray
    scp $file.FullName "${SERVER_USER}@${SERVER_IP}:$remotePath"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Upload failed for $relativePath" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Files uploaded successfully!" -ForegroundColor Green

# SSH to server and setup nginx
Write-Host "🔧 Setting up nginx configuration..." -ForegroundColor Yellow

$nginxConfig = @"
server {
    listen 80;
    server_name absensihr.local 192.168.1.44;

    root /var/www/absensihr;
    index index.html;

    location / {
        try_files `$uri `$uri/ /index.html;
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
"@

# Create nginx config on server
ssh ${SERVER_USER}@${SERVER_IP} "echo '$nginxConfig' | sudo tee /etc/nginx/sites-available/absensihr > /dev/null"
ssh ${SERVER_USER}@${SERVER_IP} "sudo ln -sf /etc/nginx/sites-available/absensihr /etc/nginx/sites-enabled/"
ssh ${SERVER_USER}@${SERVER_IP} "sudo nginx -t && sudo systemctl reload nginx"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Server setup failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access your application at:" -ForegroundColor Cyan
Write-Host "   http://$DOMAIN" -ForegroundColor White
Write-Host "   http://$SERVER_IP" -ForegroundColor White
Write-Host ""
Write-Host "📝 Note: Add '$SERVER_IP $DOMAIN' to your C:\Windows\System32\drivers\etc\hosts file" -ForegroundColor Yellow
Write-Host "   to access via domain name." -ForegroundColor Yellow

