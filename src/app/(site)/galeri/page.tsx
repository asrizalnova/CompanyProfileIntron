import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getGalleryAlbums, getSettings } from "@/lib/data"; // <-- Tambah getSettings
import { Container, Reveal, SectionTitle } from "@/components/site/ui";
import { SiteHero } from "@/components/site/SiteHero"; // <-- Import SiteHero

export const metadata: Metadata = {
  title: "Galeri",
  description: "Dokumentasi kegiatan Intron Global Academy.",
};

export default async function GaleriPage() {
  // Ambil data albums dan settings secara paralel
  const [albums, settings] = await Promise.all([
    getGalleryAlbums(),
    getSettings(),
  ]);

  return (
    <>
      {/* TAMBAHKAN HERO SECTION DI SINI */}
      <SiteHero
        title="Galeri Kegiatan"
        subtitle="Lihat berbagai kegiatan dan dokumentasi perjalanan siswa pelatihan bersama Intron Global Akademi."
        imageUrl={settings.heroImageUrl}
      />

      <section className="relative bg-paper py-20 md:py-28">
        <Container>
          {/* Section title dihapus atau disesuaikan karena judul sudah ada di Hero */}
          <Reveal animation="up">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <SectionTitle
                align="center"
                intro="Kumpulan momen dan aktivitas seru dari berbagai program yang telah kami jalankan."
              >
                Album Dokumentasi
              </SectionTitle>
            </div>
          </Reveal>

          {albums.length === 0 ? (
            <Reveal animation="up">
              <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-line bg-white p-12 text-center">
                <p className="text-muted">
                  Belum ada album galeri yang ditampilkan.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album, index) => (
                <Reveal key={album.id} animation="up" delay={index * 100}>
                  <Link
                    href={`/galeri/${album.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-500 hover:-translate-y-2 hover:border-batik/30 hover:shadow-2xl hover:shadow-batik/10"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                      {album.coverImageUrl ? (
                        <Image
                          src={album.coverImageUrl}
                          alt={`Sampul album ${album.title}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-5xl opacity-30" aria-hidden="true">
                            📷
                          </span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      <h2 className="text-xl font-bold text-ink transition-colors group-hover:text-batik-soft">
                        {album.title}
                      </h2>

                      {album.description && (
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                          {album.description}
                        </p>
                      )}

                      <div className="mt-6 pt-4 border-t border-line/50 flex items-center justify-between mt-auto">
                        <span className="text-sm font-bold text-batik-soft uppercase tracking-wider group-hover:text-batik transition-colors">
                          Lihat Album
                        </span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mist text-batik group-hover:bg-kunyit group-hover:text-ink transition-colors">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}