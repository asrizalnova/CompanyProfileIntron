import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { db } from "@/db";
import { getSettings } from "@/lib/data";
import { Container, Reveal, SectionTitle } from "@/components/site/ui";
import { SiteHero } from "@/components/site/SiteHero";

export const dynamic = "force-dynamic";

type DownloadDocument = RowDataPacket & {
  id: number;
  title: string;
  description: string | null;
  source_type: "pdf" | "link";
  file_url: string;
  external_url: string | null;
  sort_order: number;
};

export default async function UnduhBerkasPage() {
  const [documentsResult, settings] = await Promise.all([
    db.execute<DownloadDocument[]>(
      `SELECT
        id,
        title,
        description,
        source_type,
        file_url,
        external_url,
        sort_order
        FROM download_documents
        WHERE published = 1
        ORDER BY sort_order ASC, id DESC`
    ),
    getSettings(),
  ]);

  const [documents] = documentsResult;

  return (
    <>
      <SiteHero
        title="Unduh Berkas"
        subtitle="Unduh dokumen persiapan yang diperlukan untuk mengikuti program Intron Global Academy. Silakan pilih berkas yang ingin kamu unduh."
        imageUrl={settings.heroImageUrl}
      />

      <section className="relative bg-paper py-20 md:py-28 overflow-hidden">
        <Container>
          <Reveal animation="up">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <SectionTitle
                align="center"
                intro="Pusat dokumen resmi untuk menunjang proses pendaftaran dan persiapan Anda."
              >
                Pusat Dokumen
              </SectionTitle>
            </div>
          </Reveal>

          {documents.length === 0 ? (
            <Reveal animation="up">
              <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-line bg-white p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mist text-batik/40">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-ink">
                  Belum ada berkas tersedia
                </h2>
                <p className="mt-2 text-muted">
                  Dokumen yang tersedia untuk diunduh akan ditampilkan di halaman ini.
                </p>
              </div>
            </Reveal>
          ) : (
            /* Grid 2 Kolom untuk Desktop agar lebih padat */
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {documents.map((document, index) => (
                <Reveal key={document.id} animation="up" delay={index * 100}>
                  {/* Card Horizontal (Mendatar) */}
                  <article className="group flex flex-col sm:flex-row h-full overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-batik/30 hover:shadow-xl hover:shadow-batik/10">
                    
                    {/* Kiri: Ikon PDF */}
                    <div className="flex shrink-0 items-center justify-center bg-mist/50 p-6 sm:w-32 sm:border-r border-line/50 transition-colors group-hover:bg-mist/80">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-line text-danger transition-transform duration-500 group-hover:scale-110">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>

                    {/* Tengah: Judul & Deskripsi */}
                    <div className="flex flex-1 flex-col p-6 justify-center">
                      <h2 className="text-lg font-bold text-ink leading-snug group-hover:text-batik-soft transition-colors mb-2">
                        {document.title}
                      </h2>
                      {document.description ? (
                        <p className="text-sm leading-relaxed text-muted line-clamp-2">
                          {document.description}
                        </p>
                      ) : (
                        <p className="text-sm italic text-muted/60">
                          Tidak ada deskripsi.
                        </p>
                      )}
                    </div>

                    {/* Kanan: Tombol Unduh */}
                    <div className="flex items-center p-6 pt-0 sm:pt-6 sm:pl-0 shrink-0">                    
                    <a
                    href={
                        document.source_type === "link" && document.external_url
                        ? document.external_url
                        : `/api/download?file=${encodeURIComponent(document.file_url)}&name=${encodeURIComponent(document.title)}`
                    }
                    target={document.source_type === "link" ? "_blank" : undefined}
                    rel={document.source_type === "link" ? "noopener noreferrer" : undefined}
                    className="inline-flex w-full sm:w-auto min-h-10 items-center justify-center gap-2 rounded-xl bg-batik px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-batik-soft hover:shadow-lg hover:shadow-batik/20"
                    >
                    <span>
                        {document.source_type === "link" ? "Buka Dokumen" : "Unduh"}
                    </span>

                    {document.source_type === "link" ? (
                        <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.5 6H18a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2v-4.5M10 4h10v10M20 4L9 15"
                        />
                        </svg>
                    ) : (
                        <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                        </svg>
                    )}
                    </a>

                    </div>

                  </article>
                </Reveal>
              ))}
            </div>
          )}

          {/* Tombol Kembali */}
          <Reveal animation="up" delay={200}>
            <div className="mt-16 flex justify-center">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-batik-soft transition-colors hover:text-ink"
              >
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-mist group-hover:bg-kunyit transition-colors" aria-hidden="true">
                  ←
                </span>
                Kembali ke Beranda
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}