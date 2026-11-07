# PANDUAN PENGELOLAAN KATALOG ISI GAME SWITCH

---

## 1. CARA KELOLA GAME MENGGUNAKAN ADMIN PANEL (MUDAH & TANPA CODING)

Anda tidak perlu membuka file script untuk mengelola game! Cukup buka alamat:
**`https://domain-anda/admin.html`** (link admin sengaja tidak ditampilkan di website pembeli; simpan alamatnya di bookmark).

Jika Firebase sudah terhubung, halaman admin akan meminta **login email & password admin** (lihat bagian 2B).

### Fitur di Admin Panel:
1. **Tambah Game Baru:**
   - Masukkan Judul Game, Genre, Ukuran, Versi, dan Status DLC.
   - Klik **"Simpan ke Katalog"** -> Game langsung muncul di website katalog pembeli (`index.html`).
2. **Edit Game yang Sudah Ada:**
   - Di tabel daftar game sebelah kanan, klik tombol **"Edit"** pada game yang ingin diubah.
   - Perbaiki judul, ganti link cover, atau ubah ukuran file, lalu klik **"Perbarui Game"**.
3. **Hapus Game:**
   - Klik tombol **"Hapus"** pada baris game yang ingin dihilangkan dari katalog.
4. **Cari Box Art Resmi Otomatis:**
   - Setelah mengetik judul game, klik tombol **"Cari Cover di Google (Switch Box Art)"**. Tab Google Image akan otomatis terbuka dengan rasio box art resmi Switch. Cukup copy link gambarnya dan paste ke form.
5. **Simpan Permanen:**
   - Klik tombol **"Salin Kode games.js"** di kanan atas untuk meng-copy database terbaru jika ingin menyimpan permanen ke file `js/games.js`.

---

## 2. KONEKSI CLOUD DATABASE FIREBASE (REAL-TIME CLOUD)

Website ini sudah terintegrasi dengan **Google Firebase (Cloud Firestore)** gratis. Dengan Firebase:
- Setiap kali Anda menambah/mengedit game di Admin Panel, katalog di HP pembeli akan **ter-update secara real-time** tanpa perlu deploy ulang.
- Jika Firebase belum dipasang, website tetap berjalan normal menggunakan database lokal.

### A. Buat Project & Database
1. Buka [**console.firebase.google.com**](https://console.firebase.google.com/) dan login dengan akun Google Anda.
2. Klik **"Add project"** (misal: `isigameswitch`) -> Continue -> Create Project.
3. Menu kiri: **Build** -> **Firestore Database** -> **Create Database**.
4. Pilih lokasi `asia-southeast1` (Singapore) -> pilih **Start in production mode** -> **Enable**.
   (Jangan pilih *test mode*: database jadi bisa diubah siapa saja dan terkunci otomatis setelah 30 hari.)
5. Di halaman overview project, klik ikon Web **`</>`** untuk mendaftarkan web app, lalu salin `firebaseConfig` ke file `js/firebase-config.js`.

### B. Buat Akun Admin (WAJIB, sebelum website dibagikan)
1. Menu kiri: **Build** -> **Authentication** -> **Get started**.
2. Tab **Sign-in method** -> pilih **Email/Password** -> aktifkan (Enable) -> Save.
3. Tab **Users** -> **Add user** -> isi email dan password admin Anda (gunakan password yang kuat, minimal 12 karakter).
4. Tab **Settings** -> **User actions** -> **matikan** opsi *Enable create (sign-up)* agar orang lain tidak bisa membuat akun sendiri.

### C. Pasang Security Rules (WAJIB)
1. Menu kiri: **Firestore Database** -> tab **Rules**.
2. Hapus semua isi lama, lalu tempel seluruh isi file **`firestore.rules`** dari folder project ini.
3. Ganti `EMAIL-ADMIN-ANDA@gmail.com` dengan email akun admin dari langkah B.
4. Klik **Publish**.

Hasilnya: pembeli hanya bisa **membaca** katalog, sedangkan hanya Anda (setelah login) yang bisa menambah, mengubah, menghapus game, dan mengganti nomor WhatsApp.

### D. Upload Data Awal
1. Buka **`admin.html`** -> login dengan akun admin.
2. Buka tab **"Koneksi Firebase"** -> pastikan status **Terhubung**.
3. Klik **"Upload 50 Game Default ke Firestore"**. Selesai!

### E. Keamanan Tambahan (Opsional, Disarankan)
- **Batasi API Key ke domain Anda:** buka [console.cloud.google.com](https://console.cloud.google.com/) -> pilih project -> **APIs & Services** -> **Credentials** -> klik API key "Browser key" -> **Application restrictions: Websites** -> tambahkan domain Anda (misal `https://isigameswitch.netlify.app/*`) -> Save.
- **apiKey Firebase boleh terlihat di GitHub.** Itu bukan password, hanya penanda project. Keamanan data dijaga oleh Security Rules + login admin di atas.
- **Jangan pernah** mengunggah file service account (`*.json` berisi `private_key`) ke GitHub.

---

## 3. PENGATURAN WHATSAPP, SOSIAL MEDIA & HARGA PAKET

Di dalam **`admin.html`**, klik tab **"Pengaturan Kontak & Harga"**:
- **Nomor WhatsApp:** Masukkan nomor WhatsApp Anda (format: `628xxxxxxxxxx`).
- **Tampilan Nomor:** Contoh `0812-3456-7890`.
- **Instagram:** Masukkan username IG toko Anda.
- **Harga Paket:** Anda bisa ubah harga Paket Satuan, Hemat 5, Super 10, dan Unlimited sesuai keinginan.
- Klik **"Simpan Pengaturan"** -> Seluruh link pemesanan WhatsApp dan daftar harga di website utama langsung otomatis ter-update!

---

## 3. STANDAR GAMBAR & RASIO COVER NINTENDO SWITCH

- **Rasio Resmi Switch:** **`21 / 34`** (dimensi fisik 105 mm x 170 mm).
- **Resolusi Rekomendasi:** 630 x 1020 px, 617 x 1000 px, atau 500 x 810 px (seperti gambar box art dari VGChartz atau GameTDB).
- Dengan rasio `21 / 34`, cover game **tidak akan terpotong**, logo Nintendo Switch di bagian atas serta rating ESRB di bagian bawah akan tampil utuh dan presisi.
- **Jika Tidak Ada Gambar:** Kosongkan kolom URL gambar, dan website akan otomatis membuatkan kartu cover gradient modern sesuai genrenya.

---

## 4. CARA MENGONLINEKAN WEBSITE AGAR BISA DIBUKA PEMBELI (GRATIS)

Agar calon pembeli di Instagram atau WhatsApp bisa membuka katalog ini dari HP mereka, Anda bisa mengonlinekan website ini secara gratis dalam 1 menit:

### Cara Paling Mudah (Netlify Drop - Tanpa Perlu Daftar/Install):
1. Buka browser dan buka situs: **https://app.netlify.com/drop**
2. Tarik (*drag and drop*) seluruh folder `isigameswitch` ke dalam kotak yang ada di website Netlify tersebut.
3. Dalam 10 detik, website Anda langsung online dan mendapatkan link publik gratis (contoh: `https://isigameswitch.netlify.app`).
4. Salin link tersebut dan pasang di Bio WhatsApp / Instagram toko Anda!

### Alternatif (Vercel atau GitHub Pages):
- **Vercel:** Buka `vercel.com`, import folder project, deploy instan.
- **GitHub Pages:** Upload ke repository GitHub, aktifkan Pages di tab Settings.

---

## 5. FITUR KERANJANG PEMBELIAN (MULTI-GAME WHATSAPP CHECKOUT)

- Pembeli bisa memilih beberapa game sekaligus dengan mengklik tombol **`+`** pada kartu game.
- Di bagian bawah layar akan muncul bar mengambang yang menghitung jumlah game dan total ukuran (GB) yang dipilih.
- Saat pembeli mengklik **"Order WhatsApp"**, WhatsApp otomatis terbuka dengan pesan tersusun rapi:
  ```text
  Halo, saya mau order isi game Switch:

  1. The Legend of Zelda: Tears of the Kingdom (16.3 GB)
  2. Bayonetta 3 (15.0 GB)
  3. Super Mario Odyssey (5.7 GB)

  Total: 3 game (est. 37.0 GB)

  Mohon info total harga dan cara prosesnya ya. Terima kasih!
  ```

---

## 6. SEO & THUMBNAIL SAAT LINK DIBAGIKAN

- **Thumbnail share** (WhatsApp, Facebook, Telegram, X): file `assets/og-image.jpg` (1200x630). Kalau ingin mengganti, buat gambar baru dengan ukuran sama, simpan dengan nama yang sama, lalu tambahkan `?v=2` di belakang URL `og:image` dan `twitter:image` di `index.html` supaya cache WhatsApp/Facebook ikut diperbarui.
- **WhatsApp menyimpan cache thumbnail.** Kalau link sudah pernah dibagikan sebelum thumbnail dipasang, kirim link dengan tambahan parameter, misalnya `https://isigameswitch.my.id/?ref=wa`.
- **Cek tampilan share:** [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) (klik *Scrape Again* untuk refresh cache) dan [opengraph.xyz](https://www.opengraph.xyz/).
- **Daftarkan ke Google:** buka [Google Search Console](https://search.google.com/search-console) -> *Add property* -> *Domain* `isigameswitch.my.id` -> verifikasi dengan record TXT di DNS IndoWebsite -> menu *Sitemaps* -> kirim `sitemap.xml`.
- **Harga di meta description** tertulis "mulai Rp10.000/game". Kalau harga paket diubah lewat Admin Panel, ubah juga teks itu di `<head>` file `index.html`.
- **File `CNAME`** wajib tetap ada di repo agar domain `isigameswitch.my.id` tidak lepas dari GitHub Pages.

---

## 7. SEO LOKAL PURWAKARTA (AGAR MUNCUL DI PENCARIAN "ISI GAME SWITCH PURWAKARTA")

Website sudah dioptimasi untuk kata kunci Purwakarta: judul, deskripsi, data lokasi untuk Google, bagian "Jasa Isi Game Switch di Purwakarta", dan FAQ area layanan. Langkah berikut yang paling berpengaruh:

1. **Google Business Profile (paling penting).** Buka [business.google.com](https://business.google.com) -> buat profil "ISIGameSwitch".
   - Kategori: *Toko video game* / *Layanan perbaikan konsol game*.
   - Karena berjualan dari rumah: pilih **tidak ada lokasi yang dikunjungi pelanggan**, lalu isi **area layanan: Purwakarta** (alamat rumah tidak ditampilkan).
   - Isi website `https://isigameswitch.my.id`, nomor WhatsApp, jam buka, dan foto.
   - Selesaikan verifikasi dari Google.
2. **Minta ulasan Google** dari pelanggan yang puas. Jumlah dan kualitas ulasan sangat memengaruhi peringkat di Maps dan rekomendasi AI Google.
3. **Konsisten di semua tempat.** Tulis nama, kota (Purwakarta), dan link website yang sama di bio Instagram, WhatsApp Business, marketplace, dan grup komunitas.
4. **Google Search Console.** Daftarkan domain dan kirim `sitemap.xml` (lihat bagian 6).
5. **Isi nomor WhatsApp asli** di Admin Panel. Kalau sudah, nomor itu juga bisa ditambahkan sebagai `"telephone"` di data terstruktur `index.html`.
