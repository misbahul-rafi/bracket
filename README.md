# 🏆 Bracket – Aplikasi Simulasi Liga & Jadwal Pertandingan Otomatis

**Bracket** adalah aplikasi berbasis web yang memungkinkan pengguna untuk membuat, mengelola, dan menyimulasikan kompetisi liga olahraga atau esports dengan sistem pertandingan otomatis, klasemen dinamis, dan pengelompokan tim yang fleksibel.

## ✨ Fitur Utama

- 🔐 **Autentikasi Pengguna** – Sistem login aman dengan NextAuth dan dukungan role (`admin`, `user`)
- 🏟️ **Manajemen Liga** – Tambahkan liga lengkap dengan nama, musim, game, region, dan format
- 👥 **Pengelompokan Tim** – Buat dan kelola grup dalam liga (Group Stage)
- 📆 **Penjadwalan Otomatis** – Buat jadwal pertandingan antar tim secara otomatis
- 📊 **Klasemen Dinamis** – Sistem klasemen yang terupdate otomatis dari hasil pertandingan
- 🎮 **Multi Game Support** – Dukung berbagai jenis game (Mobile Legends, Dota, dsb.)
- 🌙 **UI Modern & Dark Mode** – Antarmuka bersih, intuitif, dan responsif

## 🧱 Teknologi yang Digunakan

| Teknologi | Deskripsi |
|----------|-----------|
| [Next.js](https://nextjs.org/) | Framework React dengan App Router & SSR |
| [Prisma](https://www.prisma.io/) | ORM modern untuk akses database |
| [NextAuth.js](https://next-auth.js.org/) | Autentikasi fleksibel |
| [MYSQL](https://www.mysql.com/) | Database relasional |
| [Tailwind CSS](https://tailwindcss.com/) | Styling UI modern dan konsisten |

## 🚀 Cara Menjalankan Proyek Ini

### 1. Clone repositori
```bash
git clone https://github.com/misbahul-rafi/bracket.git
cd bracket
```
### 2. Install dependencies
```bash
pnpm install
```
### 3. Setup environment variables
Buat file .env dan isi variabel yang diperlukan:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/bracketdb
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```
### 4. Setup database
```bash
pnpx prisma migrate dev --name init
pnpx prisma db seed

```
### 5. Jalankan server lokal
```bash
pnpm run dev
```
## 🧪 Struktur Folder
```bash
/app              # Struktur routing Next.js App Router
/components       # Komponen UI (form, layout, dll.)
/lib              # Konfigurasi Prisma, auth, dan utilitas lainnya
/prisma           # Schema dan seed data
/public           # Aset publik (favicon, gambar, logo)
/styles           # File global CSS
/utils            # Helper & utilitas (slugify, format, dll.)

```
## 📸 Preview UI
![Preview](/preview.png)
## 🧑‍💻 Kontribusi
Pull request dan issue sangat diterima! Jika kamu ingin menambahkan fitur atau memperbaiki bug, silakan fork repositori ini dan buat PR.
## ⚖️ Lisensi
This project is licensed under the [MIT License](./LICENSE).

Bracket dibuat untuk membantu komunitas dalam mengelola turnamen dan liga dengan lebih efisien dan profesional. 💪
---