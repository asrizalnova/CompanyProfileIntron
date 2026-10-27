import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-20">
      <h1 className="text-5xl font-semibold text-batik">Halaman tidak ditemukan</h1>
      <p className="mt-4 text-lg text-muted">
        Alamat yang Anda buka tidak ada atau sudah dipindahkan. Kembali ke beranda untuk melanjutkan.
      </p>
      <p className="mt-8">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center rounded-sm bg-kunyit px-6 font-semibold text-ink hover:bg-kunyit-soft"
        >
          Ke beranda
        </Link>
      </p>
    </main>
  );
}
