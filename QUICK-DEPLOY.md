# 🚀 Quick Deployment Guide - AbsensiHR

## Informasi Server
- **IP**: 192.168.1.44
- **User**: hexaon
- **Password**: hbm%%123
- **Domain**: absensihr.local

---

## 📋 Langkah-langkah Deployment

### ✅ Step 1: Build sudah selesai!
File production sudah di-build di folder `dist/`

### 📤 Step 2: Upload File ke Server

**Pilih salah satu metode:**

#### **Metode A: WinSCP (Paling Mudah untuk Windows)**
1. Download WinSCP: https://winscp.net/
2. Install dan buka WinSCP
3. Klik "New Session"
4. Isi:
   - **File protocol**: SFTP
   - **Host name**: 192.168.1.44
   - **User name**: hexaon
   - **Password**: hbm%%123
5. Klik "Login"
6. Di panel kiri (local), buka folder `dist/`
7. Di panel kanan (server), buka atau buat folder `/var/www/absensihr`
8. Pilih semua file di `dist/` dan drag ke `/var/www/absensihr/`

#### **Metode B: PowerShell (jika sudah install OpenSSH)**
```powershell
# Upload semua file
scp -r dist/* hexaon@192.168.1.44:/var/www/absensihr/
# Masukkan password: hbm%%123
```

### 🔧 Step 3: Setup Nginx di Server

**SSH ke server:**
```bash
ssh hexaon@192.168.1.44
# Password: hbm%%123
```

**Jalankan perintah berikut di server:**

```bash
# 1. Buat direktori
sudo mkdir -p /var/www/absensihr

# 2. Set permissions
sudo chown -R hexaon:hexaon /var/www/absensihr
sudo chmod -R 755 /var/www/absensihr

# 3. Buat nginx config
sudo nano /etc/nginx/sites-available/absensihr
```

**Copy paste isi dari file `nginx.conf` ke editor, lalu:**
- Tekan `Ctrl+X` untuk keluar
- Tekan `Y` untuk save
- Tekan `Enter` untuk confirm

**Lanjutkan dengan:**
```bash
# 4. Enable site
sudo ln -s /etc/nginx/sites-available/absensihr /etc/nginx/sites-enabled/

# 5. Hapus default site (optional)
sudo rm -f /etc/nginx/sites-enabled/default

# 6. Test nginx config
sudo nginx -t

# 7. Reload nginx
sudo systemctl reload nginx
```

**ATAU gunakan script otomatis:**
```bash
# Upload script ke server dulu
scp setup-server.sh hexaon@192.168.1.44:~/

# SSH ke server
ssh hexaon@192.168.1.44

# Jalankan script
chmod +x setup-server.sh
./setup-server.sh
```

### 🌐 Step 4: Setup Domain (Optional)

**Windows:**
1. Buka Notepad **sebagai Administrator**
2. Buka file: `C:\Windows\System32\drivers\etc\hosts`
3. Tambahkan baris ini di akhir:
   ```
   192.168.1.44    absensihr.local
   ```
4. Save file

**Linux/Mac:**
```bash
sudo nano /etc/hosts
# Tambahkan: 192.168.1.44    absensihr.local
```

### ✅ Step 5: Akses Aplikasi

Buka browser Chrome dan akses:
- **Via IP**: http://192.168.1.44
- **Via Domain**: http://absensihr.local

---

## 🔍 Troubleshooting

### Jika tidak bisa akses:

1. **Cek nginx status:**
   ```bash
   ssh hexaon@192.168.1.44
   sudo systemctl status nginx
   ```

2. **Cek nginx error log:**
   ```bash
   sudo tail -f /var/log/nginx/absensihr_error.log
   ```

3. **Cek file permissions:**
   ```bash
   ls -la /var/www/absensihr
   ```

4. **Restart nginx:**
   ```bash
   sudo systemctl restart nginx
   ```

5. **Cek firewall:**
   ```bash
   sudo ufw status
   sudo ufw allow 80/tcp
   ```

---

## 📝 Catatan

- File production sudah di-build di folder `dist/`
- Pastikan semua file dari `dist/` sudah di-upload ke `/var/www/absensihr/`
- Nginx harus running untuk aplikasi bisa diakses
- Jika ada error, cek log nginx untuk detail

---

## 🎉 Selesai!

Setelah semua langkah selesai, aplikasi bisa diakses di browser melalui:
- http://192.168.1.44
- http://absensihr.local (jika sudah setup hosts)

