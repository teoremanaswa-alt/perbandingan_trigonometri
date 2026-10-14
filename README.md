# Media Pembelajaran Interaktif Perbandingan Trigonometri SMA

**Pengembang:** Aswan, M.Pd., Gr.  
**Mata Pelajaran:** Matematika (Fase E / Kelas X SMA)  
**Materi Pokok:** Perbandingan Trigonometri pada Segitiga Siku-Siku  
**Basis Data:** MySQL / MariaDB  
**Arsitektur:** PHP 8.2 (REST API & Session Security) + Vanilla JS Canvas + Tailwind CSS + KaTeX Math Engine  

---

## 🌟 1. Ringkasan & Keunggulan Produk

Aplikasi web ini dirancang dengan antarmuka yang cerah, dinamis, dan menarik bagi siswa SMA (*Gen-Z friendly*), memadukan:
1. **Alur Linier Bertahap (*Locked Progression*):** Siswa hanya dapat membuka Aktivitas $N+1$ setelah menuntaskan Aktivitas $N$. Sistem dilengkapi pengamanan *server-side validation* untuk mencegah manipulasi URL.
2. **Laboratorium Geometri Interaktif:** Kanvas HTML5 real-time untuk simulasi segitiga siku-siku, manipulasi sudut, dan penemuan rasio $\sin, \cos, \tan$.
3. **Simulasi Terapan Kontekstual:** 3 simulasi fenomena dunia nyata:
   - Pengukuran Tinggi Pohon dengan Klinometer & Sudut Elevasi.
   - Pendaratan Pesawat Terbang dengan Sudut Depresi (*Glide Path*).
   - Pengukuran Ketinggian Layang-Layang Tradisional.
4. **Asesmen & Pembahasan Otomatis:** Latihan soal dan asesmen sumatif literasi numerasi (AKM) berbasis stimulus narasi dan gambar ilustrasi SVG.
5. **Dasbor Analitik Guru:** Rekapitulasi 6 rombongan belajar (Kelas XA hingga XF), entri penilaian manual untuk LKPD & esai pemantik, manajemen bank soal, serta pengaturan instrumen refleksi siswa.

---

## 🔐 2. Akun Masuk (Autentikasi)

### A. Akun Guru
* **Username:** `Aswan` *(Toleran: bisa menggunakan `aswan`, `Aswan, M.Pd., Gr.`, `guru`, atau `admin`)*
* **Kode Akses:** `100418`
* **Hak Akses:** Dasbor Analitik Guru, Rekapitulasi Nilai & Kemajuan 108 Siswa, Entri Nilai Manual LKPD/Esai, Manajemen Bank Soal (Akt 5, 7, 8), Manajemen Refleksi, dan Reset Progres Siswa (Remedial).

### B. Akun Siswa (108 Siswa Resmi SMAS Al-Azhar Mandiri Palu)
Setiap siswa memiliki kode akses unik berupa gabungan inisial kelas dan nomor absen. Sistem sangat fleksibel: dapat menggunakan huruf besar/kecil (`A1` atau `a1`), maupun format dengan angka nol di depan (`A01` atau `A1`):

* **Kelas XA (Kode `A1` s.d. `A36`):**
  - `A1` / `A01` : Adynza Gerly Qhinaya (Absen 1)
  - `A2` / `A02` : Aljero Waciq Taha Koruwu (Absen 2)
  - `A3` / `A03` : Alyssa Diva Mustika Nafa (Absen 3)
  - `A21` : Maghfira Diva Azzahra (Absen 21)
  - `A36` : Zayyanah Dzatil Izzah (Absen 36)
  *(Dan seluruh siswa No. 1 s.d. 36 Kelas XA)*

* **Kelas XB (Kode `B1` s.d. `B36`):**
  - `B1` / `B01` : Alfin Dwi Putra (Absen 1)
  - `B5` / `B05` : Faradiba (Absen 5)
  - `B10` : Fahriza (Absen 10)
  - `B36` : Siti Zulaikha (Absen 36)
  *(Dan seluruh siswa No. 1 s.d. 36 Kelas XB)*

* **Kelas XC (Kode `C1` s.d. `C36`):**
  - `C1` / `C01` : Abhirama Putra (Absen 1)
  - `C10` : Fakhri (Absen 10)
  - `C20` : Muhammad Rifqi (Absen 20)
  - `C36` : Zulfikar (Absen 36)
  *(Dan seluruh siswa No. 1 s.d. 36 Kelas XC)*

* **Dukungan Akun Demo & Pencarian Nama:**
  - Kode demo versi terdahulu (`D08`, `E14`, `F22`, `A21`, `B05`) otomatis dibuatkan akun aktif oleh sistem saat diketik.
  - Siswa dan guru juga dapat memasukkan **Nama Siswa** secara langsung pada kolom kode akses (misal: `Adynza`, `Maghfira`, `Faradiba`, `Irfan`).

### C. Pendaftaran Siswa Baru
Siswa baru dapat langsung mendaftar melalui tab **"Daftar Baru"** pada halaman utama:
1. Masukkan Nama Lengkap.
2. Pilih Kelas (XA s.d. XF).
3. Masukkan Nomor Absen.
4. Sistem otomatis menghasilkan kode akses unik (contoh: Kelas XA No 21 $\rightarrow$ `A21`) dan langsung membuka sesi belajar dari Aktivitas 1.

---

## 📚 3. Rincian 10 Modul Pembelajaran Siswa

| Kode Aktivitas | Nama Aktivitas | Fitur & Karakteristik | Kriteria Kelulusan |
|---|---|---|---|
| **Aktivitas 1** | Pertanyaan Pemantik | Pertanyaan kontekstual: *"Bagaimana cara mengukur tinggi pohon tanpa memanjatnya?"* dengan stimulus ilustrasi. | Siswa mengirim uraian ide jawaban minimal 10 karakter. |
| **Aktivitas 2** | LKPD Simulasi Konsep | Kanvas interaktif segitiga siku-siku ABC, slider sudut $15^\circ-75^\circ$, pembacaan real-time rasio sisi, dan pencatatan tabel pengamatan. | Siswa melengkapi tabel pengamatan dan mengirim kesimpulan analisis kesebangunan. |
| **Aktivitas 3** | Materi Trigonometri | Infografis definisi sisi depan, samping, miring (hipotenusa), mnemonik sakti **DeMi - SaMi - DeSa**, serta rasio kebalikan ($\csc, \sec, \cot$). | Membaca materi dan menekan tombol *Selesai Membaca & Lanjut*. |
| **Aktivitas 4** | Sudut Istimewa | Pembuktian geometris segitiga sama sisi & sama kaki, serta formulir interaktif tabel sudut istimewa ($0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ$). | Mengisi seluruh 15 sel tabel dengan benar (terdapat tombol simbol cepat & auto-validation). |
| **Aktivitas 5** | Latihan Soal | 5 butir soal pemahaman konsep trigonometri dasar dengan umpan balik dan pembahasan lengkap per butir. | Mengirim jawaban (skor otomatis tersimpan). |
| **Aktivitas 6** | Simulasi Terapan | 3 modul simulasi interaktif kanvas:<br>1. Tinggi pohon (sudut elevasi).<br>2. Pendaratan pesawat (sudut depresi).<br>3. Tinggi layang-layang. | Mengoperasikan ketiga simulasi dan menyelesaikan kalkulasi terpandu. |
| **Aktivitas 7** | Contoh Literasi Numerasi | 5 contoh soal tipe literasi numerasi berbasis konteks nyata Indonesia (Mercusuar, Kawat PLN, Mobil Damkar, Ramp Difabel, Layang-layang). | Menelaah seluruh contoh dan pembahasan langkah demi langkah. |
| **Aktivitas 8** | Sumatif Literasi Numerasi | Asesmen sumatif berstimulus teks cerita dan gambar ilustrasi SVG dengan auto-grading. | Mengirim jawaban asesmen sumatif. |
| **Aktivitas 9** | Refleksi Belajar | Kuesioner dinamis dari database (rating bintang dan esai evaluasi diri siswa). | Mengisi seluruh butir instrumen refleksi. |
| **Aktivitas 10** | Hasil Belajar | **Kartu Hasil Belajar Trigonometri** resmi: identitas siswa, rekap status 10 modul, skor latihan & sumatif, evaluasi manual guru, dan tombol cetak PDF. | Terbuka otomatis setelah Aktivitas 9 selesai. |

---

## 👨‍🏫 4. Fitur Dasbor Guru

1. **Pemfilteran Rombongan Belajar (6 Kelas):** Filter data instan berdasarkan Semua Kelas, XA, XB, XC, XD, XE, atau XF.
2. **Rekapitulasi Nilai & Kemajuan:** Memantau posisi aktivitas siswa secara *real-time*, nilai otomatis Aktivitas 5 dan Aktivitas 8.
3. **Formulir Penilaian Manual & Feedback:** Modal cepat bagi guru untuk membaca jawaban uraian Aktivitas 1 dan kesimpulan LKPD Aktivitas 2, memberikan nilai (0-100), dan menuliskan feedback motivatif.
4. **Manajemen Siswa:** Tambah siswa baru, generate kode akses otomatis, hapus data siswa, serta tombol **Reset Remedial** untuk mengulang kembali modul bagi siswa yang memerlukan perbaikan nilai.
5. **Manajemen Bank Soal:** CRUD (Tambah, Edit, Hapus) soal untuk Aktivitas 5, Aktivitas 7, dan Aktivitas 8.
6. **Manajemen Refleksi:** Tambah butir pertanyaan refleksi baru dan rekap seluruh jawaban refleksi yang dikirim siswa.

---

## 🌐 5. Cara Deploy Langsung ke GitHub Pages (Gratis & Online Selamanya)

Website ini telah disesuaikan agar **dapat langsung online di GitHub Pages** tanpa memerlukan server PHP atau MySQL terpisah!

### Arsitektur GitHub Pages:
- File `index.html` bekerja langsung di peramban (browser).
- Didukung oleh `assets/js/db-seed.js` dan `assets/js/storage.js` yang menyediakan emulasi database MySQL penuh (108 siswa Al-Azhar, 10 aktivitas, bank soal, kuesioner refleksi, dan kredensial guru).
- Tersedia fitur **Ekspor/Impor Database JSON** di Dashboard Guru untuk mencadangkan atau memindahkan data nilai antar-perangkat.

### Langkah-Langkah Deploy ke GitHub:
1. **Buat Repository Baru di GitHub:**
   - Masuk ke akun GitHub Anda di [github.com](https://github.com).
   - Klik **"New Repository"**.
   - Beri nama repository (contoh: `trigonometri-interaktif`).
   - Pilih **Public**, lalu klik **Create repository**.

2. **Unggah File ke Repository GitHub:**
   - Unggah file utama ke repository:
     * `index.html` (Halaman utama)
     * `bundle.js` (Bundle JavaScript mandiri lengkap)
     * `logo.png` & `logo-data.js` (Aset logo dengan fallback otomatis)
     * `.nojekyll` (Mencegah GitHub Pages memfilter file)
     * Folder `assets/` (beserta seluruh subfolder `css`, `images`, `js`)
   - *Catatan Penting:* File `bundle.js`, `logo.png`, dan `index.html` diletakkan langsung di folder utama (*root*) repository agar website langsung dapat memuat seluruh fungsi secara instan tanpa tergantung struktur folder.

3. **Aktifkan Fitur GitHub Pages:**
   - Pada halaman repository GitHub, buka menu **Settings** (Pengaturan).
   - Di sisi kiri, klik menu **Pages**.
   - Pada bagian **Build and deployment > Branch**:
     - Pilih Branch: `main` (atau `master`).
     - Pilih Folder: `/ (root)`.
     - Klik tombol **Save**.

4. **Selesai! Website Anda Sudah Online:**
   - Dalam waktu 1 - 2 menit, link website aktif Anda akan muncul di bagian atas halaman Pages:
     ```
     https://<username-anda>.github.io/trigonometri-interaktif/
     ```
   - Website ini sekarang bisa dibuka oleh siswa dan guru dari HP, laptop, atau tablet kapan saja secara gratis selamanya!

---

## 🚀 6. Cara Menjalankan Website di Komputer Lokal (XAMPP / PHP Server)

Jika Anda ingin menjalankan website secara lokal di komputer menggunakan XAMPP:

### Langkah Singkat:
Cukup klik dua kali (*double click*) file:
```
jalankan_website.bat
```
Script ini akan:
1. Memeriksa dan menjalankan service MySQL MariaDB secara otomatis.
2. Membuka peramban (browser) ke alamat: `http://localhost:8080`.
3. Menjalankan web server PHP bawaan.

### Menjalankan Manual via Terminal:
1. Pastikan MySQL XAMPP aktif:
   ```powershell
   Start-Process "C:\xampp\mysql\bin\mysqld.exe" -ArgumentList "--defaults-file=C:\xampp\mysql\bin\my.ini --standalone"
   ```
2. Jalankan server web PHP:
   ```powershell
   & "C:\xampp\php\php.exe" -S localhost:8080 -t "C:\Users\ThinkPad\.gemini\antigravity\scratch\trigonometri-interaktif"
   ```
3. Buka browser pada: `http://localhost:8080`

---

## 🗄️ 7. Skema Relasi Database MySQL

```
[classes] 
  ├── id (PK)
  └── class_name (VARCHAR) -> 'XA' s/d 'XF'

[users] 
  ├── id (PK)
  ├── role (ENUM) -> 'guru', 'siswa'
  ├── access_code (VARCHAR, UNIQUE) -> 'A21', '100418'
  ├── name (VARCHAR)
  └── class_id (FK -> classes.id, Nullable untuk Guru)

[activities]
  ├── id (PK)
  ├── activity_number (INT) -> 1 s/d 10
  ├── title (VARCHAR)
  ├── subtitle (VARCHAR)
  └── is_locked_by_default (BOOLEAN)

[student_progress]
  ├── id (PK)
  ├── user_id (FK -> users.id)
  ├── activity_id (FK -> activities.id)
  ├── status (ENUM) -> 'locked', 'in_progress', 'completed'
  └── updated_at (TIMESTAMP)

[questions]
  ├── id (PK)
  ├── activity_id (FK -> activities.id)
  ├── stimulus_text (TEXT, Nullable)
  ├── stimulus_image_url (VARCHAR, Nullable)
  ├── question_text (TEXT)
  ├── options (JSON, Nullable)
  ├── correct_answer (TEXT)
  ├── explanation (TEXT, Nullable)
  └── order_num (INT)

[student_answers]
  ├── id (PK)
  ├── user_id (FK -> users.id)
  ├── question_id (FK -> questions.id)
  ├── student_answer (TEXT)
  ├── score (FLOAT)
  └── teacher_feedback (TEXT, Nullable)

[reflections]
  ├── id (PK)
  ├── prompt_text (TEXT)
  ├── type (ENUM) -> 'scale', 'essay'
  └── is_active (BOOLEAN)

[reflection_responses]
  ├── id (PK)
  ├── user_id (FK -> users.id)
  ├── reflection_id (FK -> reflections.id)
  ├── response_text (TEXT)
  └── rating (INT, Nullable)
```

Jika sewaktu-waktu ingin melakukan *reset* atau *seeding* ulang basis data dari awal, jalankan perintah:
```powershell
& "C:\xampp\php\php.exe" "C:\Users\ThinkPad\.gemini\antigravity\scratch\trigonometri-interaktif\setup_db.php"
```

---
*Dikembangkan dengan dedikasi pendidikan oleh **Aswan, M.Pd., Gr.***
