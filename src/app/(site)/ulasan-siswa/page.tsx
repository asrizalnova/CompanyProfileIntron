import type { Metadata } from "next";
import { getTestimonials, getSettings } from "@/lib/data";
import { Container, Reveal, SectionTitle } from "@/components/site/ui";
import { SiteHero } from "@/components/site/SiteHero";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = {
  title: "Ulasan Siswa",
  description: "Baca dan bagikan pengalaman siswa Intron Global Indonesia.",
};

export default async function UlasanSiswaPage() {
  // Ambil data testimonials dan settings secara paralel
  const [testimonials, settings] = await Promise.all([
    getTestimonials(),
    getSettings(),
  ]);

  const averageRating =
    testimonials.length > 0
      ? (
          testimonials.reduce(
            (total, item) => total + Math.min(5, Math.max(1, Number(item.rating) || 5)),
            0,
          ) / testimonials.length
        ).toFixed(1)
      : "0.0";

  return (
    <main className="min-h-screen bg-paper">
      {/* =========================================
          HERO SECTION (Standar seperti menu lain)
          ========================================= */}
      <SiteHero
        title="Ulasan Siswa"
        subtitle="Baca pengalaman siswa lainnya atau bagikan ceritamu sendiri setelah mengikuti program Intron Global Indonesia."
        imageUrl={settings.heroImageUrl}
      />

      {/* =========================================
          TOTAL RATING (Melayang di bawah Hero)
          ========================================= */}
      {testimonials.length > 0 && (
        <section className="relative z-20 -mt-16">
          <Container>
            <Reveal animation="up">
              <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-white p-6 shadow-2xl shadow-batik/10 md:p-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
                <div className="text-center">
                  <span className="text-5xl font-extrabold text-batik">{averageRating}</span>
                  <span className="text-xl font-bold text-muted">/5</span>
                </div>
                <div className="hidden sm:block h-16 w-px bg-line" />
                <div className="text-center sm:text-left">
                  <div className="flex justify-center sm:justify-start gap-1.5 text-2xl text-kunyit mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>{i < Math.round(Number(averageRating)) ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-muted">
                    Berdasarkan <strong className="text-ink">{testimonials.length}</strong> ulasan siswa
                  </p>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* =========================================
          KONTEN UTAMA (2 Kolom: Form & Ulasan)
          ========================================= */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] items-start">
            
            {/* KOLOM KIRI: Form Ulasan (Sticky) */}
            <div className="lg:sticky lg:top-28">
              <Reveal animation="left">
                <ReviewForm />
              </Reveal>
            </div>

            {/* KOLOM KANAN: Daftar Ulasan */}
            <div>
              <Reveal animation="right">
                <div className="mb-8">
                  <SectionTitle intro="Apa kata mereka yang sudah merasakan program kami.">
                    Pengalaman Siswa
                  </SectionTitle>
                </div>
              </Reveal>

              {testimonials.length === 0 ? (
                <Reveal animation="up">
                  <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
                    <h3 className="text-xl font-bold text-ink">Belum ada ulasan</h3>
                    <p className="mt-2 text-muted">Jadilah yang pertama membagikan pengalamanmu!</p>
                  </div>
                </Reveal>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {testimonials.map((item, index) => {
                    const rating = Math.min(5, Math.max(1, Number(item.rating) || 5));

                    return (
                      <Reveal key={item.id} animation="up" delay={index * 100}>
                        <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-batik/30">
                          {/* Bintang Rating */}
                          <div className="mb-4 flex gap-1 text-lg" aria-label={`Rating ${rating} dari 5 bintang`}>
                            {Array.from({ length: 5 }, (_, i) => (
                              <span key={i} className={i < rating ? "text-kunyit" : "text-line"} aria-hidden="true">★</span>
                            ))}
                          </div>

                          <blockquote className="flex-1 text-sm leading-relaxed text-muted italic">
                            “{item.quote}”
                          </blockquote>

                          <div className="mt-6 flex items-center gap-3 border-t border-line/50 pt-5">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-mist">
                              {item.photoUrl ? (
                                <img src={item.photoUrl} alt={`Foto ${item.name}`} loading="lazy" className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-batik">
                                  {item.name?.trim().charAt(0).toUpperCase() || "?"}
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-ink truncate">{item.name}</h3>
                              {item.role && <p className="text-xs text-muted truncate">{item.role}</p>}
                              {item.company && <p className="text-xs text-muted truncate">{item.company}</p>}
                            </div>
                          </div>
                        </article>
                      </Reveal>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </Container>
      </section>
    </main>
  );
}