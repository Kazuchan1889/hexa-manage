# Deployment Guide - AbsensiHR Frontend

## Server Information
- **IP Address**: 192.168.1.44
- **Username**: hexaon
- **Password**: hbm%%123
- **Domain**: absensihr.local (atau bisa diakses via IP)

## Prerequisites
1. Node.js dan npm terinstall
2. SSH access ke server
3. Nginx terinstall di server
4. SCP/SSH client terinstall

## Deployment Steps

### Method 1: Automated Deployment (Linux/Mac/WSL)

1. **Buat script executable:**
   ```bash
   chmod +x deploy.sh
   ```

2. **Run deployment script:**
   ```bash
   ./deploy.sh
   ```

### Method 2: Manual Deployment

1. **Build production:**
   ```bash
   npm run build
   ```

2. **Upload files ke server:**
   ```bash
   scp -r dist/* hexaon@192.168.1.44:/var/www/absensihr/
   ```

3. **SSH ke server dan setup nginx:**
   ```bash
   ssh hexaon@192.168.1.44
   ```

4. **Di server, copy nginx config:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/absensihr
   sudo ln -s /etc/nginx/sites-available/absensihr /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **Pastikan direktori ada dan permissions benar:**
   ```bash
   sudo mkdir -p /var/www/absensihr
   sudo chown -R hexaon:hexaon /var/www/absensihr
   sudo chmod -R 755 /var/www/absensihr
   ```

### Method 3: Windows PowerShell

1. **Run PowerShell script:**
   ```powershell
   .\deploy.ps1
   ```

## Setup Domain (Optional)

### Windows
1. Buka Notepad sebagai Administrator
2. Buka file: `C:\Windows\System32\drivers\etc\hosts`
3. Tambahkan baris:
   ```
   192.168.1.44    absensihr.local
   ```
4. Save file

### Linux/Mac
1. Edit file hosts:
   ```bash
   sudo nano /etc/hosts
   ```
2. Tambahkan baris:
   ```
   192.168.1.44    absensihr.local
   ```

## Access Application

Setelah deployment selesai, akses aplikasi melalui:
- **Via IP**: http://192.168.1.44
- **Via Domain**: http://absensihr.local

## Troubleshooting

### Jika nginx tidak running:
```bash
sudo systemctl status nginx
sudo systemctl start nginx
```

### Jika permission denied:
```bash
sudo chown -R hexaon:hexaon /var/www/absensihr
sudo chmod -R 755 /var/www/absensihr
```

### Check nginx logs:
```bash
sudo tail -f /var/log/nginx/absensihr_error.log
```

### Test nginx configuration:
```bash
sudo nginx -t
```

## Update Deployment

Untuk update aplikasi, cukup jalankan ulang script deployment:
```bash
./deploy.sh
```

atau

```powershell
.\deploy.ps1
```

