# Company Profile (Next.js)

Situs company profile dengan panel admin untuk mengelola semua kontennya. Contoh data memakai perusahaan fiktif "Garda Nusa Teknologi"; ganti lewat **Admin > Pengaturan situs**.

## Teknologi
- Next.js 16 (App Router, Server Actions), React 19, Tailwind CSS 4
- Database MySQl
- Sesi admin: JWT di cookie httpOnly (`jose`), password di-hash `bcryptjs`, pembatasan percobaan login

## Menjalankan
```bash
npm install
cp .env.example .env      # isi AUTH_SECRET (openssl rand -hex 32), ADMIN_EMAIL, ADMIN_PASSWORD
npm run db:setup          # migrasi + data awal + akun admin
npm run dev               # http://localhost:3000
```
Produksi: `npm run build && npm run start`.

## Alamat
| Halaman | URL |
|---|---|
| Beranda, Tentang, Layanan, Portofolio, Blog, Kontak | `/`, `/tentang`, `/program`, `/portofolio`, `/blog`, `/kontak` |
| Login admin | `/admin/login` |
| Panel admin | `/admin` |

## Yang bisa dikelola di admin
Pengaturan situs (identitas, hero, tentang, kontak, sosial media), Layanan, Portofolio, Tim, Testimoni, Klien dan mitra, Angka perusahaan, Artikel (Markdown), Pesan masuk dari form kontak, serta akun admin. Gambar diunggah ke `UPLOAD_DIR` dan disajikan lewat `/uploads/...`.

## Struktur
- `src/db/schema.ts`: skema tabel; migrasi
- `src/lib/resources.ts`: definisi field tiap jenis konten (panel CRUD dibangun dari sini; menambah jenis konten cukup di sini dan `schema.ts`)
- `src/app/(site)/`: halaman publik; `src/app/admin/`: panel admin
- `src/proxy.ts`: pemeriksaan awal akses `/admin`; pemeriksaan sebenarnya di `requireAdmin()`

## Catatan produksi
- Ganti `ADMIN_PASSWORD` dan `AUTH_SECRET`; set `NEXT_PUBLIC_SITE_URL` ke domain `https://...` agar cookie `secure` aktif.
- Simpan `data/` dan `uploads/` di volume yang persisten dan lakukan backup rutin.
- SQLite cocok untuk satu server. Untuk beberapa instance, pindahkan ke PostgreSQL/MySQL.
