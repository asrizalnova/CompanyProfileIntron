
import "./env";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL belum diatur di file .env");
}

const parsedUrl = new URL(databaseUrl);

const pool = mysql.createPool({
  host: parsedUrl.hostname,
  port: Number(parsedUrl.port || 3306),
  user: decodeURIComponent(parsedUrl.username),
  password: decodeURIComponent(parsedUrl.password),
  database: decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, "")),
  waitForConnections: true,
  connectionLimit: 5,
  charset: "utf8mb4",
});

type SeedRow = Record<string, string | number | null>;

async function insertRows(
  connection: mysql.PoolConnection,
  table: string,
  rows: SeedRow[],
) {
  if (rows.length === 0) return;

  const columns = Object.keys(rows[0]);
  const columnSql = columns.map((column) => `\`${column}\``).join(", ");
  const placeholders = columns.map(() => "?").join(", ");

  for (const row of rows) {
    const values = columns.map((column) => row[column]);

    await connection.execute(
      `INSERT INTO \`${table}\` (${columnSql}) VALUES (${placeholders})`,
      values,
    );
  }
}

const now = () => Math.floor(Date.now() / 1000);
const daysAgo = (days: number) => now() - days * 86400;

async function main() {
  // 1. Buat akun admin jika belum ada.
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (!email || password.length < 8) {
    throw new Error(
      "Isi ADMIN_EMAIL dan ADMIN_PASSWORD (minimal 8 karakter) di .env.",
    );
  }

  const [admins] = await pool.execute<mysql.RowDataPacket[]>(
    "SELECT id FROM admin_users LIMIT 1",
  );

  if (admins.length === 0) {
    await pool.execute(
      `INSERT INTO admin_users (email, name, password_hash)
       VALUES (?, ?, ?)`,
      [
        email,
        process.env.ADMIN_NAME?.trim() || "Administrator",
        await bcrypt.hash(password, 12),
      ],
    );

    console.log(`Admin dibuat: ${email}`);
  } else {
    console.log("Admin sudah ada, dilewati.");
  }

  // 2. Jangan timpa konten yang sudah ada.
  const [settings] = await pool.execute<mysql.RowDataPacket[]>(
    "SELECT id FROM site_settings LIMIT 1",
  );

  if (settings.length > 0) {
    console.log("Konten sudah ada, seed konten dilewati.");
    return;
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Pengaturan website.
    await insertRows(connection, "site_settings", [
      {
        id: 1,
        company_name: "Garda Nusa Teknologi",
        tagline: "Perangkat lunak untuk operasional yang tidak boleh berhenti",
        logo_url: "",
        hero_title:
          "Sistem yang dibangun untuk bekerja setiap hari, bukan hanya saat demo.",
        hero_subtitle:
          "Kami merancang, membangun, dan merawat aplikasi desktop, web, serta integrasi data untuk perusahaan di Indonesia.",
        hero_image_url: "",
        hero_primary_label: "Lihat Program",
        hero_secondary_label: "Hubungi kami",
        about_title: "Tim kecil yang bertahan bersama sistemnya",
        about_body:
          "Garda Nusa Teknologi berdiri untuk membantu perusahaan menjalankan proses bisnis lewat perangkat lunak yang rapi dan mudah dirawat.\n\nKami tidak berhenti di peluncuran. Setiap sistem yang kami bangun disertai dokumentasi, pelatihan pengguna, dan dukungan setelah berjalan, supaya tim Anda tidak bergantung pada kami untuk hal-hal kecil.\n\nPekerjaan kami banyak bersentuhan dengan data operasional: stok, penjualan, keuangan, dan laporan. Karena itu kami terbiasa dengan sistem lama, basis data yang sudah bertahun-tahun berjalan, dan kebutuhan integrasi yang tidak rapi.",
        about_image_url: "",
        vision:
          "Menjadi mitra teknologi yang dipercaya perusahaan Indonesia untuk sistem yang dipakai bertahun-tahun.",
        mission:
          "Membangun perangkat lunak yang sesuai cara kerja pelanggan.\nMenjaga sistem tetap berjalan lewat pemeliharaan yang disiplin.\nMenyampaikan pekerjaan dengan jujur: jadwal, biaya, dan batasannya.",
        founded_year: 2012,
        email: "halo@contoh-perusahaan.co.id",
        phone: "(0351) 000 000",
        whatsapp: "6281234567890",
        address: "Jl. Contoh Raya No. 10, Madiun, Jawa Timur 63100",
        map_embed_url: "",
        instagram: "",
        linkedin: "",
        facebook: "",
        youtube: "",
        tiktok: "",
        threads: "",
        cta_title: "Ceritakan kebutuhan sistem Anda",
        cta_body:
          "Kami balas dalam satu hari kerja dengan pertanyaan lanjutan atau usulan langkah pertama.",
        footer_note: "Konten pada situs ini adalah contoh. Ubah lewat panel admin.",
        seo_title:
          "Garda Nusa Teknologi: pengembangan perangkat lunak untuk perusahaan",
        seo_description:
          "Pengembangan aplikasi desktop dan web, integrasi data, serta pemeliharaan sistem untuk perusahaan di Indonesia.",
        updated_at: now(),
      },
    ]);

    // Statistik.
    await insertRows(
      connection,
      "stats",
      [
        { value: "12", label: "tahun merawat sistem klien", sort_order: 1 },
        { value: "80+", label: "proyek selesai dan berjalan", sort_order: 2 },
        {
          value: "35",
          label: "klien dengan kontrak pemeliharaan",
          sort_order: 3,
        },
        {
          value: "4 jam",
          label: "target respons untuk gangguan",
          sort_order: 4,
        },
      ].map((row) => ({ ...row })),
    );

    // Program: pengganti tabel services dari seed SQLite lama.
    await insertRows(
      connection,
      "programs",
      [
        {
          title: "Aplikasi desktop dan web",
          slug: "aplikasi-desktop-dan-web",
          summary:
            "Aplikasi operasional yang dirancang dari alur kerja tim Anda, dari kasir sampai gudang.",
          description:
            "Kami membangun aplikasi desktop untuk pekerjaan yang butuh respons cepat dan koneksi tidak selalu stabil, serta aplikasi web untuk akses dari banyak lokasi.\n\n- Analisis alur kerja dan prototipe sebelum pengembangan\n- Antarmuka yang dirancang untuk operator, bukan hanya manajer\n- Dokumentasi dan pelatihan pengguna",
          tags: "Lazarus / Free Pascal, Next.js, Firebird, PostgreSQL",
          published: 1,
          sort_order: 1,
          photo_url: null,
        },
        {
          title: "Sistem enterprise kustom",
          slug: "sistem-enterprise-kustom",
          summary:
            "ERP ringan yang menyatukan penjualan, stok, keuangan, dan laporan dalam satu basis data.",
          description:
            "Untuk perusahaan yang sudah melewati batas spreadsheet tetapi belum butuh ERP raksasa. Modul dibuat bertahap, sehingga tim bisa mulai memakai bagian pertama sambil menunggu sisanya.",
          tags: "Penjualan, Persediaan, Keuangan, Laporan",
          published: 1,
          sort_order: 2,
          photo_url: null,
        },
        {
          title: "Integrasi dan migrasi data",
          slug: "integrasi-dan-migrasi-data",
          summary:
            "Memindahkan data dari sistem lama tanpa menghentikan operasional, dan menghubungkan sistem yang terpisah.",
          description:
            "Kami memetakan data lama, membersihkannya, lalu memindahkannya dengan uji coba berulang sebelum hari peralihan. Integrasi antar sistem dibuat dengan catatan log agar mudah ditelusuri.",
          tags: "SQL, API, Laporan otomatis",
          published: 1,
          sort_order: 3,
          photo_url: null,
        },
        {
          title: "Pemeliharaan dan dukungan",
          slug: "pemeliharaan-dan-dukungan",
          summary:
            "Kontrak dukungan dengan target respons yang jelas, pencadangan terjadwal, dan perbaikan berkala.",
          description:
            "Sistem yang berjalan butuh perawatan: pembaruan, pemeriksaan basis data, dan perbaikan kecil yang menumpuk. Kami menyediakan paket bulanan dengan target respons tertulis.",
          tags: "Pencadangan, Pemantauan, Perbaikan",
          published: 1,
          sort_order: 4,
          photo_url: null,
        },
        {
          title: "Audit dan konsultasi sistem",
          slug: "audit-dan-konsultasi-sistem",
          summary:
            "Penilaian independen atas sistem yang sudah ada sebelum Anda memutuskan memperbaiki atau mengganti.",
          description:
            "Kami membaca kode, struktur basis data, dan cara sistem dipakai, lalu menyampaikan temuan beserta pilihan langkah dan perkiraan biayanya.",
          tags: "Review kode, Keamanan dasar, Rencana pengembangan",
          published: 1,
          sort_order: 5,
          photo_url: null,
        },
      ].map((row) => ({ ...row })),
    );

    // Proyek.
    await insertRows(
      connection,
      "projects",
      [
        {
          title: "Sistem distribusi dan penagihan",
          slug: "sistem-distribusi-dan-penagihan",
          client: "Distributor FMCG regional",
          category: "Sistem enterprise",
          year: 2024,
          summary:
            "Penjualan, pengiriman, dan penagihan 14 cabang dalam satu sistem, dengan laporan harian otomatis.",
          description:
            "## Tantangan\nSetiap cabang mencatat penjualan di spreadsheet sendiri, sehingga laporan konsolidasi baru jadi di akhir pekan.\n\n## Yang kami bangun\nAplikasi desktop untuk kasir dan gudang, sinkronisasi ke server pusat, serta laporan harian yang terkirim otomatis ke manajemen.\n\n## Hasil\nLaporan konsolidasi tersedia setiap pagi, dan selisih stok antar cabang turun tajam pada kuartal pertama.",
          image_url: "",
          website_url: "",
          featured: 1,
          published: 1,
          sort_order: 1,
        },
        {
          title: "Aplikasi klinik dan apotek",
          slug: "aplikasi-klinik-dan-apotek",
          client: "Jaringan klinik swasta",
          category: "Aplikasi desktop",
          year: 2023,
          summary:
            "Pendaftaran pasien, resep, dan stok obat yang tetap bisa dipakai saat koneksi internet terputus.",
          description:
            "Aplikasi bekerja secara lokal dan menyinkronkan data saat koneksi tersedia. Stok obat dikurangi otomatis dari resep, dengan peringatan kedaluwarsa.",
          image_url: "",
          website_url: "",
          featured: 1,
          published: 1,
          sort_order: 2,
        },
        {
          title: "Portal pemesanan pelanggan",
          slug: "portal-pemesanan-pelanggan",
          client: "Produsen komponen logam",
          category: "Aplikasi web",
          year: 2024,
          summary:
            "Pelanggan memantau status pesanan dan mengunduh dokumen sendiri, tanpa perlu menelepon bagian penjualan.",
          description:
            "Portal web yang terhubung ke sistem produksi yang sudah ada. Data status pesanan dibaca langsung dari basis data pabrik melalui lapisan integrasi yang aman.",
          image_url: "",
          website_url: "",
          featured: 1,
          published: 1,
          sort_order: 3,
        },
        {
          title: "Migrasi basis data keuangan",
          slug: "migrasi-basis-data-keuangan",
          client: "Koperasi simpan pinjam",
          category: "Migrasi data",
          year: 2022,
          summary:
            "Memindahkan sebelas tahun data transaksi ke sistem baru dengan rekonsiliasi saldo per anggota.",
          description:
            "Data dipetakan, dibersihkan, dan diuji lewat empat kali simulasi peralihan. Peralihan akhir selesai dalam satu akhir pekan.",
          image_url: "",
          website_url: "",
          featured: 0,
          published: 1,
          sort_order: 4,
        },
      ].map((row) => ({ ...row })),
    );

    // Anggota tim.
    await insertRows(
      connection,
      "team_members",
      [
        {
          name: "Rahmat Hidayat",
          role: "Direktur dan arsitek sistem",
          bio: "Merancang arsitektur setiap proyek dan memimpin pekerjaan migrasi data.",
          photo_url: "",
          linkedin: "",
          published: 1,
          sort_order: 1,
        },
        {
          name: "Sekar Ayuningtyas",
          role: "Kepala analis dan desain alur kerja",
          bio: "Menerjemahkan cara kerja tim klien menjadi kebutuhan sistem yang bisa dibangun.",
          photo_url: "",
          linkedin: "",
          published: 1,
          sort_order: 2,
        },
        {
          name: "Bagas Prasetyo",
          role: "Pengembang senior",
          bio: "Mengerjakan aplikasi desktop dan basis data. Penjaga kualitas kode di tim.",
          photo_url: "",
          linkedin: "",
          published: 1,
          sort_order: 3,
        },
        {
          name: "Nadia Kusuma",
          role: "Pengembang web dan integrasi",
          bio: "Membangun portal web dan menghubungkan sistem yang terpisah.",
          photo_url: "",
          linkedin: "",
          published: 1,
          sort_order: 4,
        },
      ].map((row) => ({ ...row })),
    );

    // Testimoni.
    await insertRows(
      connection,
      "testimonials",
      [
        {
          name: "Ibu Wulandari",
          role: "Manajer Keuangan",
          company: "Distributor FMCG regional",
          quote:
            "Dulu laporan cabang baru lengkap hari Senin. Sekarang saya membukanya sambil minum kopi pagi, dan angkanya cocok dengan kas.",
          published: 1,
          sort_order: 1,
        },
        {
          name: "dr. Hendra Wijaya",
          role: "Direktur Operasional",
          company: "Jaringan klinik swasta",
          quote:
            "Yang paling kami hargai: aplikasi tetap jalan waktu internet mati. Tim mereka juga datang sendiri saat ada kendala di cabang.",
          published: 1,
          sort_order: 2,
        },
        {
          name: "Pak Slamet",
          role: "Ketua Pengurus",
          company: "Koperasi simpan pinjam",
          quote:
            "Migrasi data sebelas tahun terdengar menakutkan. Mereka menunjukkan hasil simulasi berkali-kali sampai kami yakin.",
          published: 1,
          sort_order: 3,
        },
      ].map((row) => ({ ...row })),
    );

    // Mitra.
    await insertRows(
      connection,
      "partners",
      [
        "Distributor Nusantara",
        "Klinik Sehat Bersama",
        "Koperasi Maju Jaya",
        "Logam Presisi Mandiri",
        "Toko Bangunan Sentosa",
        "Agro Tani Makmur",
      ].map((name, index) => ({
        name,
        logo_url: "",
        website_url: "",
        published: 1,
        sort_order: index + 1,
      })),
    );

    // Artikel.
    await insertRows(
      connection,
      "posts",
      [
        {
          title: "Kapan spreadsheet sebaiknya diganti sistem?",
          slug: "kapan-spreadsheet-sebaiknya-diganti-sistem",
          excerpt:
            "Lima tanda bahwa proses bisnis Anda sudah melewati kemampuan spreadsheet.",
          author: "Sekar Ayuningtyas",
          cover_url: "",
          content:
            "Spreadsheet adalah alat yang bagus untuk memulai. Masalahnya muncul ketika file yang sama dipakai banyak orang dan angkanya mulai berbeda-beda.\n\n## Tanda-tanda yang perlu diperhatikan\n\n- Ada lebih dari satu versi file yang dianggap benar\n- Laporan butuh berjam-jam untuk disatukan\n- Rumus rusak saat ada yang menambah baris\n- Hanya satu orang yang paham cara kerja filenya\n- Data penting tidak punya riwayat perubahan\n\n## Apa langkah pertama?\n\nJangan langsung membeli sistem. Mulailah dengan memetakan satu proses yang paling sering bermasalah, lalu cari tahu siapa yang mengisi data dan siapa yang membutuhkan hasilnya.",
          published: 1,
          published_at: daysAgo(12),
        },
        {
          title: "Mengapa sistem desktop masih relevan",
          slug: "mengapa-sistem-desktop-masih-relevan",
          excerpt:
            "Untuk kasir, gudang, dan klinik, aplikasi yang bekerja tanpa internet sering kali pilihan yang lebih tepat.",
          author: "Bagas Prasetyo",
          cover_url: "",
          content:
            "Tidak semua pekerjaan cocok dipindahkan ke browser. Kasir yang melayani antrean tidak bisa menunggu koneksi.\n\n## Kelebihan aplikasi desktop\n\n- Tetap berjalan saat internet terputus\n- Respons cepat karena data diakses lokal\n- Terhubung langsung ke printer, pemindai, dan perangkat lain\n\n## Kapan web lebih cocok?\n\nBila pengguna tersebar di banyak lokasi dan tidak butuh perangkat khusus, aplikasi web lebih mudah didistribusikan dan diperbarui.",
          published: 1,
          published_at: daysAgo(30),
        },
        {
          title: "Checklist sebelum memigrasi data lama",
          slug: "checklist-sebelum-memigrasi-data-lama",
          excerpt:
            "Hal-hal yang sering terlewat dan baru terasa ketika hari peralihan sudah dekat.",
          author: "Rahmat Hidayat",
          cover_url: "",
          content:
            "Migrasi data jarang gagal karena teknisnya. Ia gagal karena data lama ternyata tidak sebersih dugaan.\n\n## Sebelum mulai\n\n1. Tentukan data mana yang benar-benar perlu dipindahkan\n2. Cari duplikat dan data yatim sejak awal\n3. Siapkan rekonsiliasi saldo atau jumlah sebagai bukti hasil\n4. Lakukan simulasi peralihan minimal tiga kali\n\nSetiap simulasi hampir selalu menemukan masalah baru. Lebih baik menemukannya sekarang daripada saat sistem sudah dipakai.",
          published: 1,
          published_at: daysAgo(55),
        },
      ].map((row) => ({ ...row })),
    );

    await connection.commit();
    console.log("Konten contoh berhasil dimasukkan.");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

main()
  .catch((error: unknown) => {
    console.error("Seed gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
