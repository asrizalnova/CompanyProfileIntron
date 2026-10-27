export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "image"
  | "file"
  | "url"
  | "email"
  | "date"
  | "select"
  | "slug";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  nullable?: boolean;
  help?: string;
  placeholder?: string;
  max?: number;
  rows?: number;
  /** Untuk tipe slug: nama field sumber bila slug dikosongkan. */
  slugFrom?: string;
  /** Lebar di form: penuh (default) atau setengah. */
  half?: boolean;
   options?: {
    label: string;
    value: string;
   }[],
};

export type Column = {
  name: string;
  label: string;
  kind?: "text" | "boolean" | "date" | "image";
};

export type ResourceConfig = {
  key: string;
  label: string;
  singular: string;
  description: string;
  fields: Field[];
  columns: Column[];
  titleField: string;
  orderable: boolean;
  /** Alamat halaman publik untuk tombol "Lihat", bila ada. */
  publicHref?: (row: Record<string, unknown>) => string | null;
  emptyText: string;
};

const sortOrder: Field = {
  name: "sortOrder",
  label: "Urutan tampil",
  type: "number",
  help: "Angka kecil tampil lebih dulu. Bisa juga diatur dengan tombol naik/turun di daftar.",
  half: true,
};

const published: Field = {
  name: "published",
  label: "Tampilkan di situs",
  type: "boolean",
  help: "Matikan untuk menyembunyikan tanpa menghapus.",
};

export const resources: Record<string, ResourceConfig> = {

program: {
  key: "program",
  label: "Program",
  singular: "program",
  description: "Atur informasi dan konten detail setiap program.",
  titleField: "title",
  orderable: true,
  emptyText: "Belum ada program. Tambahkan program pertama.",
  columns: [
    { name: "photoUrl", label: "Gambar", kind: "image" },
    { name: "title", label: "Nama Program" },
    { name: "summary", label: "Ringkasan" },
    { name: "published", label: "Tampil", kind: "boolean" },
  ],
  publicHref: (row) => `/program/${row.slug}`,
  fields: [
    {
      name: "title",
      label: "Nama Program",
      type: "text",
      required: true,
      max: 120,
    },
    {
      name: "slug",
      label: "Slug URL",
      type: "slug",
      slugFrom: "title",
      help: "Contoh: web-development. URL halaman menjadi /program/web-development.",
      half: true,
    },
    sortOrder,
    {
      name: "summary",
      label: "Ringkasan Program",
      type: "textarea",
      required: true,
      max: 300,
      rows: 3,
      help: "Ringkasan singkat yang tampil di kartu program.",
    },
    {
      name: "photoUrl",
      label: "Gambar Program",
      type: "image",
      help: "Gambar utama program yang tampil di halaman website.",
    },
    {
      name: "description",
      label: "Detail Lengkap Program",
      type: "markdown",
      help: "Penjelasan lengkap program. Mendukung Markdown.",
    },
    {
      name: "tags",
      label: "Teknologi atau Kata Kunci",
      type: "text",
      max: 200,
      help: "Pisahkan dengan koma. Contoh: Next.js, MySQL, Laravel.",
    },
    published,
  ],
},
  tim: {
    key: "tim",
    label: "Tim",
    singular: "anggota tim",
    description: "Orang-orang di balik perusahaan. Tampil di halaman Tentang.",
    titleField: "name",
    orderable: true,
    emptyText: "Belum ada anggota tim.",
    columns: [
      { name: "photoUrl", label: "Foto", kind: "image" },
      { name: "name", label: "Nama" },
      { name: "role", label: "Jabatan" },
      { name: "published", label: "Tampil", kind: "boolean" },
    ],
    publicHref: () => "/tentang",
    fields: [
      { name: "name", label: "Nama", type: "text", required: true, max: 100, half: true },
      { name: "role", label: "Jabatan", type: "text", required: true, max: 120, half: true },
      { name: "bio", label: "Deskripsi singkat", type: "textarea", max: 300, rows: 3 },
      { name: "photoUrl", label: "Foto", type: "image", help: "Rasio persegi atau potret paling sesuai." },
      { name: "linkedin", label: "Tautan LinkedIn", type: "url", half: true },
      sortOrder,
      published,
    ],
  },
  
  testimoni: {
    key: "testimoni",
    label: "Testimoni",
    singular: "testimoni",
    description: "Kutipan dan foto orang yang telah mengikuti program. Tampil di beranda.",
    titleField: "name",
    orderable: true,
    emptyText: "Belum ada testimoni.",
    columns: [
      { name: "photoUrl", label: "Foto", kind: "image" },
      { name: "name", label: "Nama" },
      { name: "company", label: "Perusahaan" },
      { name: "quote", label: "Kutipan" },
      { name: "rating", label: "Rating" },
      { name: "published", label: "Tampil", kind: "boolean" },
    ],
    publicHref: () => "/",
    fields: [
      {
        name: "name",
        label: "Nama",
        type: "text",
        required: true,
        max: 100,
        half: true,
      },
      {
        name: "role",
        label: "Status",
        type: "text",
        max: 100,
        half: true,
      },
      {
        name: "company",
        label: "Perusahaan",
        type: "text",
        max: 120,
        half: true,
      },
      {
        name: "photoUrl",
        label: "Foto Testimoni",
        type: "image",
        help: "Unggah atau pilih foto orang yang memberikan testimoni. Opsional, gunakan foto persegi atau potret.",
      },
      sortOrder,
      {
        name: "quote",
        label: "Kutipan",
        type: "textarea",
        required: true,
        max: 500,
        rows: 4,
      },
      {
        name: "rating",
        label: "Rating Bintang",
        type: "select",
        required: true,
        half: true,
        options: [
          { label: "★☆☆☆☆ — 1 Bintang", value: "1" },
          { label: "★★☆☆☆ — 2 Bintang", value: "2" },
          { label: "★★★☆☆ — 3 Bintang", value: "3" },
          { label: "★★★★☆ — 4 Bintang", value: "4" },
          { label: "★★★★★ — 5 Bintang", value: "5" },
        ],
        help: "Pilih rating berdasarkan ulasan siswa.",
      },
      published,
    ],
  },


mitra: {
  key: "mitra",
  label: "Mitra",
  singular: "mitra",
  description:
    "Kelola profil, lokasi, kontak, pengurus, dan dokumentasi setiap mitra.",
  titleField: "name",
  orderable: true,
  emptyText: "Belum ada mitra.",
  columns: [
    { name: "logoUrl", label: "Logo", kind: "image" },
    { name: "name", label: "Nama mitra" },
    { name: "published", label: "Tampil", kind: "boolean" },
  ],
  publicHref: () => "/mitra",
  fields: [
    {
      name: "name",
      label: "Nama mitra",
      type: "text",
      required: true,
      max: 100,
      half: true,
    },
    {
      name: "websiteUrl",
      label: "Situs web",
      type: "url",
      half: true,
    },
    {
      name: "logoUrl",
      label: "Logo mitra",
      type: "image",
      help: "Opsional. Jika kosong, nama mitra akan ditampilkan.",
    },
    {
      name: "description",
      label: "Deskripsi mitra",
      type: "textarea",
      rows: 4,
      help: "Jelaskan profil dan bentuk kerja sama dengan mitra.",
    },
    {
      name: "address",
      label: "Alamat mitra",
      type: "textarea",
      rows: 3,
    },
    {
      name: "whatsapp",
      label: "WhatsApp mitra",
      type: "text",
      max: 30,
      half: true,
      help:
        "Gunakan kode negara tanpa tanda plus. Contoh: 6281234567890.",
    },
    {
      name: "mapEmbedUrl",
      label: "Google Maps mitra (embed)",
      type: "url",
      help:
        "Masukkan URL embed Google Maps untuk lokasi mitra ini.",
    },
    sortOrder,
    published,
  ],
},
  
dokumentasi: {
  key: "dokumentasi",
  label: "Dokumentasi",
  singular: "foto dokumentasi",
  description: "Kelola foto dokumentasi kegiatan yang ditampilkan di halaman Mitra.",
  titleField: "title",
  orderable: true,
  emptyText: "Belum ada foto dokumentasi.",
  columns: [
    { name: "imageUrl", label: "Foto", kind: "image" },
    { name: "title", label: "Judul" },
    { name: "published", label: "Tampil", kind: "boolean" },
  ],
  publicHref: () => "/mitra",
  fields: [
    {
      name: "title",
      label: "Judul dokumentasi",
      type: "text",
      required: true,
      max: 255,
    },
    {
      name: "description",
      label: "Deskripsi",
      type: "textarea",
      rows: 3,
    },
    {
      name: "imageUrl",
      label: "Foto dokumentasi",
      type: "image",
      required: true,
      help: "Unggah foto kegiatan melalui tombol pilih gambar.",
    },
    sortOrder,
    published,
  ],
},
  statistik: {
    key: "statistik",
    label: "Angka perusahaan",
    singular: "angka",
    description: "Angka-angka singkat yang menunjukkan pengalaman perusahaan. Tampil di beranda.",
    titleField: "label",
    orderable: true,
    emptyText: "Belum ada angka.",
    columns: [
      { name: "value", label: "Angka" },
      { name: "label", label: "Keterangan" },
    ],
    publicHref: () => "/",
    fields: [
      { name: "value", label: "Angka", type: "text", required: true, max: 20, half: true, placeholder: "80+" },
      sortOrder,
      { name: "label", label: "Keterangan", type: "text", required: true, max: 80, placeholder: "proyek selesai" },
    ],
  },
  artikel: {
    key: "artikel",
    label: "Artikel",
    singular: "artikel",
    description: "Tulisan untuk blog perusahaan.",
    titleField: "title",
    orderable: false,
    emptyText: "Belum ada artikel. Tulis artikel pertama.",
    columns: [
      { name: "coverUrl", label: "Sampul", kind: "image" },
      { name: "title", label: "Judul" },
      { name: "publishedAt", label: "Terbit", kind: "date" },
      { name: "published", label: "Tampil", kind: "boolean" },
    ],
    publicHref: (row) => `/blog/${row.slug}`,
    fields: [
      { name: "title", label: "Judul", type: "text", required: true, max: 160 },
      {
        name: "slug",
        label: "Slug",
        type: "slug",
        slugFrom: "title",
        help: "Kosongkan untuk dibuat otomatis dari judul.",
        half: true,
      },
      { name: "author", label: "Penulis", type: "text", max: 100, half: true },
      { name: "excerpt", label: "Ringkasan", type: "textarea", max: 300, rows: 3, help: "Tampil di daftar artikel dan hasil pencarian." },
      { name: "content", label: "Isi artikel", type: "markdown" },
      { name: "coverUrl", label: "Gambar sampul", type: "image" },
      {
        name: "publishedAt",
        label: "Tanggal terbit",
        type: "date",
        nullable: true,
        half: true,
        help: "Kosongkan untuk memakai hari ini saat dipublikasikan. Tanggal di masa depan dijadwalkan.",
      },
      { name: "published", label: "Publikasikan", type: "boolean", help: "Artikel yang tidak dipublikasikan tersimpan sebagai draf." },
    ],
    
  },
  
  pendaftaran: {
    key: "pendaftaran",
    label: "Pendaftaran Batch",
    singular: "batch pendaftaran",
    description:
      "Kelola batch pendaftaran program Jepang dan tautan pendaftarannya.",
    titleField: "batchName",
    orderable: true,
    emptyText: "Belum ada batch pendaftaran. Tambahkan batch pertama.",
    columns: [
      { name: "batchName", label: "Nama Batch" },
      { name: "title", label: "Program" },
      { name: "period", label: "Periode" },
      { name: "status", label: "Status" },
      { name: "published", label: "Tampil", kind: "boolean" },
    ],
    publicHref: () => "/pendaftaran",
    fields: [
      {
        name: "batchName",
        label: "Nama Batch",
        type: "text",
        required: true,
        max: 100,
        placeholder: "Contoh: Batch 1",
      },
      {
        name: "title",
        label: "Judul Program",
        type: "text",
        required: true,
        max: 160,
        placeholder: "Contoh: Program Kerja Jepang",
      },
      {
        name: "period",
        label: "Periode Pendaftaran",
        type: "text",
        max: 100,
        half: true,
        placeholder: "Contoh: Januari 2027",
      },      
      {
        name: "selectionStartDate",
        label: "Tanggal Mulai Seleksi",
        type: "date",
        half: true,
        help: "Tanggal dimulainya proses seleksi peserta.",
      },
      {
        name: "registrationCloseDate",
        label: "Tanggal Penutupan Pendaftaran",
        type: "date",
        half: true,
        help: "Batas akhir peserta dapat mendaftar.",
      },
      {
        name: "status",
        label: "Status Pendaftaran",
        type: "select",
        required: true,
        half: true,
        options: [
          { label: "Segera Dibuka", value: "Segera Dibuka" },
          { label: "Dibuka", value: "Dibuka" },
          { label: "Ditutup", value: "Ditutup" },
        ],
      },
      {
        name: "description",
        label: "Deskripsi",
        type: "textarea",
        max: 1000,
        rows: 4,
        help: "Penjelasan singkat yang tampil pada kartu batch.",
      },
      {
        name: "registrationUrl",
        label: "Link Pendaftaran",
        type: "url",
        max: 2048,
        help:
          "Masukkan URL Google Forms atau halaman pendaftaran. Kosongkan jika belum tersedia.",
      },
      sortOrder,
      published,
    ],
  },

  
galeri: {
  key: "galeri",
  label: "Galeri",
  singular: "album galeri",
  description: "Kelola album, foto sampul, dan foto dokumentasi kegiatan.",
  titleField: "title",
  orderable: true,
  emptyText: "Belum ada album galeri. Tambahkan album pertama.",
  columns: [
    { name: "coverImageUrl", label: "Sampul Album", kind: "image" },
    { name: "title", label: "Nama Album" },
    { name: "slug", label: "Slug URL" },
    { name: "published", label: "Tampil", kind: "boolean" },
  ],
  publicHref: (row) => `/galeri/${encodeURIComponent(String(row.slug ?? ""))}`,
  fields: [
    {
      name: "title",
      label: "Nama Album",
      type: "text",
      required: true,
      max: 255,
      placeholder: "Contoh: Pelepasan Peserta",
    },
    {
      name: "slug",
      label: "Slug URL",
      type: "slug",
      slugFrom: "title",
      required: true,
      half: true,
      help: "Contoh: pelepasan-peserta",
    },
    {
      name: "coverImageUrl",
      label: "Foto Sampul Album",
      type: "image",
      help: "Unggah foto utama yang akan ditampilkan pada kartu album di halaman Galeri.",
    },
    sortOrder,
    {
      name: "description",
      label: "Deskripsi Album",
      type: "textarea",
      rows: 4,
      max: 1000,
    },
    published,
  ],
},
 
 
"unduh-berkas": {
  key: "unduh-berkas",
  label: "Unduh Berkas",
  singular: "Berkas",
  description:
    "Kelola dokumen PDF yang diunggah atau tautan dokumen eksternal.",
  titleField: "title",
  orderable: true,
  emptyText: "Belum ada berkas yang ditambahkan.",

  fields: [
    {
      name: "title",
      label: "Nama Berkas",
      type: "text",
      required: true,
      max: 255,
    },
    {
      name: "description",
      label: "Keterangan",
      type: "textarea",
      rows: 3,
    },
    {
      name: "sourceType",
      label: "Jenis Berkas",
      type: "select",
      required: true,
      options: [
        { label: "PDF (Unggah Berkas)", value: "pdf" },
        { label: "Tautan Eksternal (Google Drive, dll.)", value: "link" },
      ],
      help:
        "Pilih PDF untuk mengunggah berkas. Pilih Tautan jika dokumen tersedia melalui Google Drive atau situs lain.",
    },
    {
      name: "fileUrl",
      label: "Unggah File PDF",
      type: "file",
      help:
        "Isi bagian ini jika Jenis Berkas adalah PDF. Tidak perlu diisi untuk jenis Tautan.",
    },
    {
      name: "externalUrl",
      label: "Tautan Dokumen",
      type: "url",
      max: 2048,
      placeholder: "https://drive.google.com/...",
      help:
        "Isi bagian ini jika Jenis Berkas adalah Tautan. Tidak perlu diisi untuk jenis PDF.",
    },
    {
      name: "sortOrder",
      label: "Urutan",
      type: "number",
    },
    {
      name: "published",
      label: "Tampilkan di situs",
      type: "boolean",
    },
  ],

  columns: [
    { name: "title", label: "Nama Berkas" },
    { name: "sourceType", label: "Jenis" },
    { name: "published", label: "Status" },
  ],

  publicHref: () => "/unduh-berkas",
},
};

export const resourceKeys = Object.keys(resources);

export type SettingsSection = { title: string; description?: string; fields: Field[] };

export const settingsSections: SettingsSection[] = [
  {
    title: "Identitas",
    description: "Nama dan logo yang tampil di header, footer, dan judul tab.",
    fields: [
      { name: "companyName", label: "Nama perusahaan", type: "text", required: true, max: 120, half: true },
      { name: "foundedYear", label: "Tahun berdiri", type: "number", nullable: true, half: true },
      { name: "tagline", label: "Tagline", type: "text", max: 160 },
      { name: "logoUrl", label: "Logo", type: "image", help: "Opsional. Bila kosong, nama perusahaan yang ditampilkan." },
    ],
  },
{
    title: "Beranda",
    description: "Atur teks dan gambar latar bagian utama beranda.",
    fields: [
      {
        name: "heroTitle",
        label: "Judul utama",
        type: "textarea",
        required: true,
        max: 160,
        rows: 2,
      },
      {
        name: "heroSubtitle",
        label: "Kalimat pendukung",
        type: "textarea",
        max: 1000,
        rows: 3,
      },
      {
        name: "heroImageUrl",
        label: "Gambar latar beranda",
        type: "image",
        help: "Gambar di belakang judul utama. Gunakan gambar landscape beresolusi tinggi. Kosongkan untuk memakai latar warna.",
      },
      {
        name: "heroPrimaryLabel",
        label: "Teks tombol utama",
        type: "text",
        max: 40,
        half: true,
        help: "Mengarah ke halaman Layanan.",
      },
      {
        name: "heroSecondaryLabel",
        label: "Teks tombol kedua",
        type: "text",
        max: 40,
        half: true,
        help: "Mengarah ke halaman Kontak.",
      },
    ],
  },
  
{
  title: "Tentang perusahaan",
  description: "Atur cerita perusahaan, latar belakang, visi, dan misi.",
  fields: [
    {
      name: "aboutTitle",
      label: "Judul cerita perusahaan",
      type: "text",
      max: 160,
    },
    {
      name: "aboutBody",
      label: "Cerita perusahaan",
      type: "markdown",
    },
    {
      name: "aboutImageUrl",
      label: "Gambar cerita perusahaan",
      type: "image",
      help: "Gambar yang tampil pada bagian Cerita Kami.",
    },
    {
      name: "backgroundTitle",
      label: "Judul latar belakang",
      type: "text",
      max: 160,
      placeholder: "Latar Belakang",
    },
    {
      name: "backgroundBody",
      label: "Isi latar belakang",
      type: "markdown",
      help: "Jelaskan sejarah, alasan berdiri, dan perkembangan perusahaan.",
    },
    {
      name: "backgroundImageUrl",
      label: "Gambar latar belakang",
      type: "image",
      help: "Gambar pendukung bagian Latar Belakang. Opsional.",
    },
    {
      name: "vision",
      label: "Visi",
      type: "textarea",
      max: 400,
      rows: 3,
    },
    {
      name: "mission",
      label: "Misi",
      type: "textarea",
      max: 800,
      rows: 4,
      help: "Satu poin misi per baris.",
    },
    {
      name: "companyProfileVideoUrl",
      label: "Link Video Company Profile YouTube",
      type: "url",
      max: 2048,
      placeholder: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
      help: "Tempel link video YouTube. Video akan ditampilkan di bawah bagian Tentang Kami pada halaman beranda.",
    },
    
  ],
},

  {
    title: "Kontak",
    fields: [
      { name: "email", label: "Email", type: "email", half: true },
      { name: "phone", label: "Telepon", type: "text", max: 40, half: true },
      { name: "whatsapp", label: "WhatsApp", type: "text", max: 20, half: true, help: "Format internasional tanpa tanda plus. Contoh: 6281234567890" },
      { name: "address", label: "Alamat", type: "textarea", max: 300, rows: 3 },
      {
        name: "mapEmbedUrl",
        label: "Tautan peta (embed)",
        type: "url",
        help: "Di Google Maps: Bagikan, Sematkan peta, salin nilai src dari iframe. Opsional.",
      },
    ],
  },
{
  title: "Media sosial",
  description: "Atur tautan akun media sosial yang akan ditampilkan pada header situs.",
  fields: [
    { name: "instagram", label: "Instagram", type: "url", half: true, placeholder: "https://www.instagram.com/akun/" },
    { name: "tiktok", label: "TikTok", type: "url", half: true, placeholder: "https://www.tiktok.com/@akun" },
    { name: "youtube", label: "YouTube", type: "url", half: true, placeholder: "https://www.youtube.com/@akun" },
    { name: "threads", label: "Threads", type: "url", half: true, placeholder: "https://www.threads.net/@akun" },
    { name: "linkedin", label: "LinkedIn", type: "url", half: true, placeholder: "https://www.linkedin.com/@akun" },
    { name: "facebook", label: "Facebook", type: "url", half: true, placeholder: "https://www.facebook.com/@akun" },
  ],
},
  {
    title: "Ajakan dan footer",
    fields: [
      { name: "ctaTitle", label: "Judul ajakan", type: "text", max: 140 },
      { name: "ctaBody", label: "Kalimat ajakan", type: "textarea", max: 300, rows: 2 },
      { name: "footerNote", label: "Catatan footer", type: "text", max: 200 },
    ],
  },
  {
    title: "Mesin pencari (SEO)",
    description: "Judul dan deskripsi untuk hasil Google dan pratinjau tautan.",
    fields: [
      { name: "seoTitle", label: "Judul situs", type: "text", max: 70 },
      { name: "seoDescription", label: "Deskripsi situs", type: "textarea", max: 170, rows: 3 },
    ],
  },
];

export const settingsFields: Field[] = settingsSections.flatMap((s) => s.fields);
