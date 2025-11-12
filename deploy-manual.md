# Manual Deployment Instructions

## Step 1: Build Production
```bash
npm run build
```

## Step 2: Upload ke Server

### Option A: Menggunakan WinSCP atau FileZilla
1. Download WinSCP atau FileZilla
2. Connect ke server:
   - Host: 192.168.1.44
   - Username: hexaon
   - Password: hbm%%123
   - Protocol: SFTP
3. Upload semua file dari folder `dist/` ke `/var/www/absensihr/` di server

### Option B: Menggunakan PowerShell/Command Prompt
```powershell
# Install OpenSSH jika belum ada
# Kemudian upload:
scp -r dist/* hexaon@192.168.1.44:/var/www/absensihr/
```

## Step 3: Setup Nginx di Server

SSH ke server:
```bash
ssh hexaon@192.168.1.44
# Password: hbm%%123
```

Kemudian jalankan perintah berikut:

```bash
# 1. Buat direktori jika belum ada
sudo mkdir -p /var/www/absensihr

# 2. Set permissions
sudo chown -R hexaon:hexaon /var/www/absensihr
sudo chmod -R 755 /var/www/absensihr

# 3. Buat nginx config
sudo nano /etc/nginx/sites-available/absensihr
```

Copy paste isi dari file `nginx.conf` ke editor, lalu save (Ctrl+X, Y, Enter)

```bash
# 4. Enable site
sudo ln -s /etc/nginx/sites-available/absensihr /etc/nginx/sites-enabled/

# 5. Test nginx config
sudo nginx -t

# 6. Reload nginx
sudo systemctl reload nginx
```

## Step 4: Setup Domain (Optional)

### Windows:
1. Buka Notepad sebagai Administrator
2. Buka: `C:\Windows\System32\drivers\etc\hosts`
3. Tambahkan:
   ```
   192.168.1.44    absensihr.local
   ```
4. Save

### Linux/Mac:
```bash
sudo nano /etc/hosts
# Tambahkan: 192.168.1.44    absensihr.local
```

## Step 5: Akses Aplikasi

Buka browser dan akses:
- http://192.168.1.44
- http://absensihr.local (jika sudah setup hosts)

