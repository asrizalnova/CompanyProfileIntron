import type { Metadata } from "next";
import { getRegistrationBatches, getSettings } from "@/lib/data";
import { SiteHero } from "@/components/site/SiteHero";
import {
  ButtonLink,
  Container,
  SectionTitle,
  Reveal,
} from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Pendaftaran",
  description:
    "Informasi batch pendaftaran program pelatihan dan kerja Jepang di Intron Global Academy.",
};

export default async function PendaftaranPage() {
  const [batches, settings] = await Promise.all([
    getRegistrationBatches(),
    getSettings(),
  ]);

  return (
    <>
      <SiteHero
        title="Pendaftaran"
        subtitle="Pilih batch pendaftaran yang tersedia dan mulai perjalanan karier Anda ke Jepang bersama Intron Global Academy."
        imageUrl={settings.heroImageUrl}
      />

      <section className="relative overflow-hidden bg-mist py-20 md:py-28">
        <Container>
          <Reveal animation="up">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <SectionTitle
                align="center"
                intro="Lihat informasi periode, status, dan tautan pendaftaran untuk setiap batch program kami."
              >
                Batch Pendaftaran
              </SectionTitle>
            </div>
          </Reveal>

          {batches.length === 0 ? (
            <Reveal animation="up">
              <div className="rounded-3xl border border-line bg-white px-6 py-20 text-center shadow-sm">
                <h2 className="text-xl font-bold text-ink">
                  Belum Ada Pendaftaran
                </h2>
                <p className="mt-3 text-muted max-w-md mx-auto">
                  Informasi batch pendaftaran akan ditampilkan di halaman ini
                  setelah tersedia.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {batches.map((batch, index) => {
                const status = batch.status?.trim() || "Segera Dibuka";
                const isOpen =
                  status.toLowerCase() === "dibuka" &&
                  Boolean(batch.registrationUrl?.trim());

                return (
                  <Reveal
                    key={batch.id}
                    animation="up"
                    delay={index * 100}
                  >
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-batik/10 hover:border-batik/30">
                      
                      {/* Garis Aksen Atas (Gradasi Warna Logo) */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-batik via-batik-wash to-ok" />

                      <div className="flex flex-1 flex-col p-7 md:p-8">
                        
                        {/* Header: Batch Name & Status */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                          <span className="rounded-full bg-batik/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-batik">
                            {batch.batchName}
                          </span>

                          <span
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                              status.toLowerCase() === "dibuka"
                                ? "bg-ok/10 text-ok"
                                : status.toLowerCase() === "ditutup"
                                  ? "bg-danger/10 text-danger"
                                  : "bg-kunyit/15 text-kunyit-soft"
                            }`}
                          >
                            {/* Dot Indikator Status */}
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              status.toLowerCase() === "dibuka" ? "bg-ok animate-pulse" :
                              status.toLowerCase() === "ditutup" ? "bg-danger" : "bg-kunyit"
                            }`} />
                            {status}
                          </span>
                        </div>

                        {/* Judul */}
                        <h2 className="text-xl font-bold leading-snug text-ink transition-colors group-hover:text-batik-soft md:text-2xl mb-4">
                          {batch.title}
                        </h2>

                        {/* Periode (Jika Ada) */}
                        {batch.period && (
                          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-batik-wash">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {batch.period}
                          </div>
                        )}                       
                        
                        {/* Tanggal (Grid 2 Kolom agar rapi) */}
                        {(batch.selectionStartDate || batch.registrationCloseDate) && (
                          <div className="mb-6 grid grid-cols-2 gap-4 border-y border-line/60 py-4">
                            {batch.selectionStartDate && (
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                                  Mulai Seleksi
                                </p>
                                <p className="text-sm font-semibold text-ink">
                                  {new Date(batch.selectionStartDate).toLocaleDateString(
                                    "id-ID",
                                    { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }
                                  )}
                                </p>
                              </div>
                            )}
                            {batch.registrationCloseDate && (
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                                  Tutup Pendaftaran
                                </p>
                                <p className="text-sm font-semibold text-ink">
                                  {new Date(batch.registrationCloseDate).toLocaleDateString(
                                    "id-ID",
                                    { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Deskripsi */}
                        {batch.description && (
                          <p className="flex-1 whitespace-pre-line text-sm leading-relaxed text-muted line-clamp-4">
                            {batch.description}
                          </p>
                        )}

                        {/* Tombol / Status Aksi */}
                        <div className="mt-6 pt-6 border-t border-line/60">
                          {isOpen && batch.registrationUrl ? (
                            <ButtonLink
                              href={batch.registrationUrl}
                              variant="primary"
                              className="w-full shadow-lg shadow-batik/20"
                            >
                              Daftar Sekarang
                            </ButtonLink>
                          ) : (
                            <div
                              className="flex min-h-[3rem] items-center justify-center rounded-xl bg-mist px-5 text-center text-sm font-semibold text-muted cursor-not-allowed border border-line"
                            >
                              {status.toLowerCase() === "ditutup"
                                ? "Pendaftaran Ditutup"
                                : status.toLowerCase() === "dibuka"
                                  ? "Link Belum Tersedia"
                                  : "Menunggu Pembukaan"}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}