Dokumentasi Web HRIS

Node.js Version

Versi yang digunakan: v18.17.1

How to Start (Web)

Buat file untuk project ini.

Clone repository:

git clone https://github.com/Kazuchan1889/hexa-manage.git

Install dependencies:

npm i --force
npm install axios
npm i tailwindcss --force

Jalankan project:

npm run dev

How to Start (Mobile)

Install dependencies dengan perintah berikut:

npx i --force
npm install axios
npm install -g expo-cli
npm i tailwindcss --force

Jalankan project:

npm start

Catatan

Dikarenakan project mobile menggunakan Expo, maka project dapat dijalankan menggunakan aplikasi Expo di perangkat Android atau iOS.

Namun, pada perangkat iOS kemungkinan akan terjadi beberapa bug. Oleh karena itu, disarankan menggunakan perangkat Android untuk menjalankannya.

Alternatif lain adalah menggunakan Android Studio untuk membuat virtual device.

Pastikan Back-End Telah Berjalan

Pastikan back-end telah dijalankan terlebih dahulu dan terhubung pada jaringan yang sama.

Sesuaikan alamat IP yang ada di file ip.jsx dengan IP yang digunakan untuk menjalankan back-end.

Alternatif lain adalah menjalankan proyek secara lokal pada perangkat masing-masing.
