import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getServiceBySlug,
  getSettings,
  getProgramActivities,
} from "@/lib/data";
import { Markdown } from "@/components/site/Media";
import { ButtonLink, Container, Reveal } from "@/components/site/ui";
import { SiteHero } from "@/components/site/SiteHero";
import { Lattice } from "@/components/site/Kawung";
import { splitTags } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getServiceBySlug(slug);

  if (!program) {
    return { title: "Program tidak ditemukan" };
  }

  return {
    title: program.title,
    description: program.summary || program.title,
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;

  const [program, settings] = await Promise.all([
    getServiceBySlug(slug),
    getSettings(),
  ]);

  if (!program) {
    notFound();
  }

  const activities = await getProgramActivities(program.id);
  const tags = splitTags(program.tags || "");

  // =========================================
  // HELPER UNTUK WHATSAPP
  // =========================================
  const waNumber = settings.whatsapp?.replace(/\D/g, "") || "";
  
  // Fungsi untuk membuat link WA dengan pesan otomatis
  const getWaLink = (skema: string) => {
    const text = encodeURIComponent(
      `Halo, saya tertarik dengan Program *${program.title}* dengan skema *${skema}*. Mohon informasi lebih lanjut.`
    );
    return `https://wa.me/${waNumber}?text=${text}`;
  };

  return (
    <>
      {/* =========================================
          HERO SECTION
          ========================================= */}
      <SiteHero
        title={program.title}
        subtitle={program.summary || "Informasi program"}
        imageUrl={program.photoUrl || settings.heroImageUrl}
      />

      {/* =========================================
          KONTEN UTAMA (Split Layout Asimetris)
          ========================================= */}
      <section className="py-24 md:py-32 overflow-hidden">
        <Container>
          {/* Tombol Kembali */}
          <Reveal animation="up">
            <Link
              href="/program"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-batik-soft transition-colors hover:text-ink mb-12"
            >
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-mist group-hover:bg-kunyit transition-colors" aria-hidden="true">
                ←
              </span>
              Kembali ke semua program
            </Link>
          </Reveal>

          <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-20 items-start">
            {/* Kolom Kiri: Judul & Deskripsi */}
            <Reveal animation="left">
              <h1 className="text-4xl font-extrabold tracking-tight text-ink md:text-5xl lg:text-6xl mb-6">
                {program.title}
              </h1>

              {tags.length > 0 && (
                <ul className="flex flex-wrap gap-2 mb-8">
                  {tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-batik/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-batik"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              {program.description && (
                <div className="prose-doc text-muted text-lg">
                  <Markdown>{program.description}</Markdown>
                </div>
              )}
            </Reveal>

            {/* Kolom Kanan: Kartu Info Ringkas */}
            <Reveal animation="right" delay={200}>
              <div className="sticky top-24 bg-white rounded-2xl p-8 border border-line shadow-sm relative overflow-hidden">
                {/* Dekorasi */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-kunyit/10 rounded-full -mr-12 -mt-12" />
                
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-ink mb-4">Ringkasan Program</h3>
                  
                  {program.summary && (
                    <p className="text-muted leading-relaxed mb-6">
                      {program.summary}
                    </p>
                  )}

                  <div className="border-t border-line pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">Tipe Program</span>
                      <span className="font-semibold text-ink">Pelatihan Kerja</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">Isi Program</span>
                      <span className="font-semibold text-ink">{activities.length} Konten</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    {/* Tombol Tanya Program diarahkan ke WhatsApp */}
                    <ButtonLink href={getWaLink("Umum")} variant="primary" className="w-full">
                      Tanya Program Ini
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* =========================================
          KEGIATAN & BIDANG PEKERJAAN (Grid Premium)
          ========================================= */}
      <section className="bg-mist py-24 md:py-32 border-y border-line relative overflow-hidden">
        {/* Pattern halus */}
        <div className="absolute inset-0 bg-dots-pattern opacity-40" />

        <Container className="relative z-10">
          <Reveal animation="up">
            <div className="max-w-2xl mb-16">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-batik-wash shadow-sm mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-kunyit animate-pulse" />
                Jelajahi Program
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink">
                Kegiatan dan Bidang Pekerjaan
              </h2>
              <p className="mt-4 text-lg text-muted leading-relaxed">
                Kenali berbagai kegiatan dan bidang yang tersedia dalam program {program.title}.
              </p>
            </div>
          </Reveal>

          {activities.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity, index) => (
                <Reveal key={activity.id} animation="up" delay={index * 100}>
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-batik/10 hover:border-batik/30">
                    
                    {/* Gambar Activity */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                      {activity.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={activity.imageUrl}
                          alt={activity.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-mist">
                          <span className="text-sm text-muted font-medium">
                            Gambar belum tersedia
                          </span>
                        </div>
                      )}
                      
                      {/* Overlay Gradient saat Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Konten Kartu */}
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="text-xl font-bold text-ink group-hover:text-batik-soft transition-colors leading-snug">
                          {activity.title}
                        </h3>
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-mist flex items-center justify-center group-hover:bg-kunyit transition-colors">
                          <svg className="h-4 w-4 text-batik group-hover:text-ink transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {activity.description && (
                        <div className="prose-doc text-sm text-muted line-clamp-4">
                          <Markdown>{activity.description}</Markdown>
                        </div>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal animation="up">
              <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center max-w-2xl mx-auto">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-mist mb-4">
                  <svg className="h-8 w-8 text-batik/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">
                  Informasi kegiatan belum tersedia.
                </h3>
                <p className="text-muted">
                  Silakan hubungi kami untuk mendapatkan informasi lebih lanjut mengenai program {program.title}.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      {/* =========================================
          SKEMA PEMBIAYAAN
          ========================================= */}
      <section className="py-24 md:py-32 bg-white relative">
        <Container>
          {/* Header Skema Pembiayaan */}
          <Reveal animation="up">
            <div className="bg-batik rounded-2xl p-8 md:p-12 text-white mb-12 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-white/5 to-transparent" />
              
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-kunyit mb-3">
                    Skema Pembiayaan
                  </p>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                    Dukungan Finansial untuk <br /> Peserta Program
                  </h2>
                </div>
                <div>
                  <p className="text-white/80 leading-relaxed text-lg">
                    LPK Intron Global Academy menyediakan dukungan finansial transparan, terjangkau, dan sesuai kebutuhan peserta dalam mengikuti program kerja resmi di Jepang.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Pilihan Skema */}
          <div className="space-y-8">
            
            {/* SKEMA 1: DANA MANDIRI */}
            <Reveal animation="up">
              <div className="bg-mist rounded-2xl p-8 md:p-12 border border-line">
                <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16">
                  <div>
                    <h3 className="text-3xl font-bold text-ink mb-6">
                      Dana <span className="text-batik-soft">Mandiri</span>
                    </h3>
                    <ul className="space-y-2 text-muted mb-8">
                      <li>Pelatihan : <strong className="text-ink">Rp 16.500.000,-</strong></li>
                      <li>Keberangkatan : <strong className="text-ink">Rp 25.000.000,-</strong></li>
                    </ul>
                    {/* Tombol Info Lebih Lanjut diarahkan ke WhatsApp (Dana Mandiri) */}
                    <ButtonLink href={getWaLink("Dana Mandiri")} variant="primary" rounded="full" className="!min-h-10 !px-6 !text-sm">
                      Info Lebih Lanjut
                    </ButtonLink>
                  </div>

                  <div>
                    <h4 className="font-bold text-ink mb-4 uppercase tracking-wider text-sm">Fasilitas :</h4>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                      {[
                        "4 bulan pelatihan",
                        "4 bulan asrama",
                        "Modul Pembelajaran",
                        "Cathering setiap weekdays",
                        "Kelas Full AC",
                        "Paspor",
                        "Visa",
                        "Layanan Job Matching",
                        "Pendampingan Kelengkapan Dokumen",
                        "Certificate of Eligibility (COE)",
                        "Pendampingan ke Bandara",
                        "E-KTLN",
                        "Medical Check UP",
                        '"Seragam" (Jaket, Rompi, Batik, Baju olahraga, dan Dasi)',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-batik/10 flex items-center justify-center">
                            <svg className="h-3 w-3 text-batik" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-sm text-muted leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* SKEMA 2: DANA TALANG KEBERANGKATAN */}
            <Reveal animation="up" delay={100}>
              <div className="bg-white rounded-2xl p-8 md:p-12 border border-line shadow-sm">
                <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16">
                  <div>
                    <h3 className="text-3xl font-bold text-ink mb-6">
                      Dana Talang <br /> <span className="text-kunyit">Keberangkatan</span>
                    </h3>
                    <ul className="space-y-2 text-muted mb-8">
                      <li>Pelatihan : <strong className="text-ink">Rp 16.500.000,-</strong></li>
                      <li>Keberangkatan : <strong className="text-ink">Rp 0,-</strong></li>
                    </ul>
                    {/* Tombol Info Lebih Lanjut diarahkan ke WhatsApp (Dana Talang) */}
                    <ButtonLink href={getWaLink("Dana Talang Keberangkatan")} variant="primary" rounded="full" className="!min-h-10 !px-6 !text-sm">
                      Info Lebih Lanjut
                    </ButtonLink>
                  </div>

                  <div>
                    <h4 className="font-bold text-ink mb-4 uppercase tracking-wider text-sm">Fasilitas :</h4>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                      {[
                        "4 bulan pelatihan",
                        "4 bulan asrama",
                        "Modul Pembelajaran",
                        "Cathering setiap weekdays",
                        "Kelas Full AC",
                        "Tiket Pesawat",
                        "Layanan Job Matching",
                        "Pendampingan Kelengkapan Dokumen",
                        "Certificate of Eligibility (COE)",
                        "Paspor",
                        '"Seragam" (Jaket, Rompi, Batik, Baju olahraga, dan Dasi)',
                        "Visa",
                        "E-KTLN",
                        "Pendampingan ke Bandara",
                        "Medical Check UP",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-kunyit/20 flex items-center justify-center">
                            <svg className="h-3 w-3 text-kunyit" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-sm text-muted leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-line">
                  <p className="text-sm text-muted">
                    <span className="text-danger font-bold">*)</span> Dana Talang Rp 35.000.000,- namun dibayar secara ansuran setelah bekerja di Jepang.
                  </p>
                </div>
              </div>
            </Reveal>

          </div>
        </Container>
      </section>
    </>
  );
}
