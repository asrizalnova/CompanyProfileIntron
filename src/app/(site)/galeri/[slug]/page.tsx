import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getGalleryAlbumBySlug,
  getGalleryPhotos,
  getSettings, // <-- Tambah getSettings
} from "@/lib/data";
import { Container, Reveal } from "@/components/site/ui";
import { GalleryLightbox } from "@/components/site/GalleryLightbox";
import { SiteHero } from "@/components/site/SiteHero"; // <-- Import SiteHero

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await getGalleryAlbumBySlug(slug);

  if (!album) {
    return { title: "Album Tidak Ditemukan" };
  }

  return {
    title: album.title,
    description: album.description || `Foto kegiatan ${album.title}.`,
  };
}

export default async function GalleryAlbumPage({ params }: Props) {
  const { slug } = await params;
  
  // Ambil album, foto, dan settings secara paralel
  const [album, settings] = await Promise.all([
    getGalleryAlbumBySlug(slug),
    getSettings(),
  ]);

  if (!album) {
    notFound();
  }

  const photos = await getGalleryPhotos(album.id);

  return (
    <>
      {/* TAMBAHKAN HERO SECTION DI SINI */}
      <SiteHero
        title={album.title}
        subtitle={album.description || `Dokumentasi kegiatan ${album.title}.`}
        imageUrl={settings.heroImageUrl}
      />

      <section className="relative bg-paper py-20 md:py-28 overflow-hidden">
        <Container>
          <Reveal animation="up">
            <Link
              href="/galeri"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-batik-soft transition-colors hover:text-ink mb-8"
            >
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-mist group-hover:bg-kunyit transition-colors" aria-hidden="true">
                ←
              </span>
              Kembali ke Galeri
            </Link>
          </Reveal>

          {photos.length === 0 ? (
            <Reveal animation="up" delay={200}>
              <div className="mt-12 rounded-2xl border border-dashed border-line bg-white p-12 text-center">
                <p className="text-muted">Belum ada foto di album ini.</p>
              </div>
            </Reveal>
          ) : (
            <Reveal animation="up" delay={200}>
               <GalleryLightbox photos={photos} albumTitle={album.title} />
            </Reveal>
          )}
        </Container>
      </section>
    </>
  );
}