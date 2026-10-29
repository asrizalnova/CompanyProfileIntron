import Link from "next/link";
import { Lattice } from "@/components/site/Kawung";
import {
  ButtonLink,
  Container,
  SectionTitle,
  TextLink,
  Reveal,
} from "@/components/site/ui";
import {
  getPartners,
  getPosts,
  getServices,
  getSettings,
  getStats,
  getTeam,
  getTestimonials,
  getFeaturedProjects,
} from "@/lib/data";
import { formatDate, splitTags } from "@/lib/utils";
import { TestimonialSlider } from "@/components/site/TestimonialSlider";


function getYouTubeEmbedUrl(
  url: string | null | undefined
): string | null {
  if (!url?.trim()) return null;

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

    let videoId = "";

    if (host === "youtu.be") {
      videoId = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v") ?? "";
      } else {
        const match = parsed.pathname.match(
          /^\/(?:embed|shorts|live)\/([a-zA-Z0-9_-]+)/
        );

        videoId = match?.[1] ?? "";
      }
    }

    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return null;
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [
    settings,
    stats,
    services,
    team,
    projects,
    testimonials,
    partners,
    posts,
  ] = await Promise.all([
    getSettings(),
    getStats(),
    getServices(),
    getTeam(),
    getFeaturedProjects(4),
    getTestimonials(),
    getPartners(),
    getPosts(3),
  ]);

  const aboutIntro = settings.aboutBody.split(/\n{2,}/)[0] ?? "";
  const companyProfileVideoUrl = getYouTubeEmbedUrl(
    settings.companyProfileVideoUrl
  );
  const [leadProject, ...otherProjects] = projects;

  return (
    <>
          {/* HERO SECTION - Fixed Layout & Terkunci */}
      <section className="relative isolate flex w-full items-center overflow-hidden bg-[#0f0f0f] text-white">
        
        {/* 1. BACKGROUND GAMBAR (Menggunakan object-cover & object-center) */}
        {settings.heroImageUrl && (
          <div className="absolute inset-0 -z-20 h-full w-full">
            <img
              src={settings.heroImageUrl}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              className="h-full w-full object-cover object-center opacity-60"
            />
            {/* Overlay Gelap agar teks terbaca (kiri lebih gelap) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
          </div>
        )}

        {/* Pendaran Cahaya Logo */}
        <div className="pointer-events-none absolute left-0 top-1/2 -z-10 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#00AEEF]/20 blur-[150px]" />
        <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[400px] w-[400px] rounded-full bg-[#E31E24]/10 blur-[120px]" />

        {/* 2. CONTAINER UTAMA: Dikunci lebarnya (max-w-6xl) & diberi tinggi pasti (min-h) */}
        <Container className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
          
          {/* 3. KONTEN TEKS: Dikunci maksimal 3xl agar kalimat turun ke bawah, tidak memanjang */}
          <div className="flex max-w-3xl flex-col justify-center">
            
            <Reveal animation="up">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md md:text-xs">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00AEEF] md:h-2 md:w-2" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#39B54A] md:h-2 md:w-2" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E31E24] md:h-2 md:w-2" />
                </span>
                Solusi Peluang Jepang Terpercaya
              </div>
            </Reveal>

            <Reveal animation="up" delay={150}>
              {/* Ukuran font H1 diturunkan sedikit agar proporsional */}
              <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">
                {settings.heroTitle}
              </h1>
            </Reveal>

            {settings.heroSubtitle && (
              <Reveal animation="up" delay={300}>
                {/* Teks paragraf dibuat lebih kecil dan padat */}
                <p className="mt-5 border-l-[3px] border-[#39B54A] pl-5 text-sm leading-relaxed text-gray-300 md:text-base">
                  {settings.heroSubtitle}
                </p>
              </Reveal>
            )}

            <Reveal animation="up" delay={450}>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/program" variant="primary">
                  {settings.heroPrimaryLabel || "Lihat Program"}
                </ButtonLink>
                <ButtonLink href="/kontak" variant="outline-light">
                  {settings.heroSecondaryLabel || "Hubungi Kami"}
                </ButtonLink>
              </div>
            </Reveal>

          </div>
        </Container>
      </section>

      {/* STATS SECTION - Mengambang (Floating) & Bersih */}
      {stats.length > 0 && (
        <section aria-label="Angka perusahaan" className="relative z-20 -mt-20">
          <Container>
            <Reveal animation="up">
              <dl className="grid grid-cols-2 gap-8 rounded-[2rem] border border-gray-100 bg-white/90 p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] backdrop-blur-xl md:grid-cols-4 md:p-12">
                {stats.map((s) => (
                  <div key={s.id} className="flex flex-col items-center text-center md:items-start md:text-left">
                    <dd className="font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#00AEEF] to-[#39B54A] md:text-5xl">
                      {s.value}
                    </dd>
                    <dt className="mt-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </Container>
        </section>
      )}

      {/* ABOUT SECTION */}
      {(settings.aboutTitle || aboutIntro) && (
        <section className="overflow-hidden py-24 md:py-32 bg-white">
          <Container>
            <div className="grid items-center gap-16 md:grid-cols-2 md:gap-24">
              <Reveal animation="left">
                <SectionTitle>{settings.aboutTitle}</SectionTitle>
                <p className="mt-8 whitespace-pre-line text-lg leading-relaxed text-gray-600">
                  {aboutIntro}
                </p>
                <div className="mt-10">
                  <TextLink href="/tentang">Kenali kami lebih jauh</TextLink>
                </div>
              </Reveal>

              <Reveal animation="right" delay={200}>
                <div className="relative">
                  <div className="absolute -inset-4 rotate-2 rounded-[2rem] bg-gradient-to-br from-[#00AEEF]/20 to-[#39B54A]/20" />
                  <div className="absolute -inset-4 -rotate-2 rounded-[2rem] bg-[#E31E24]/10 blur-md" />
                  
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl">
                    {settings.aboutImageUrl || settings.heroImageUrl ? (
                      <img
                        src={settings.aboutImageUrl || settings.heroImageUrl}
                        alt="Tentang Kami"
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100 text-xl font-bold text-gray-300">
                        Gambar Perusahaan
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      )}

      {/* COMPANY PROFILE VIDEO SECTION */}
      {companyProfileVideoUrl && (
        <section className="overflow-hidden bg-gray-50 py-20 md:py-28">
          <Container>
            <Reveal animation="up">
              <SectionTitle
                align="center"
                intro="Kenali profil, kegiatan, dan perjalanan Intron Global Academy melalui video company profile kami."
              >
                Mengenal Intron Global Lebih Dekat
              </SectionTitle>
            </Reveal>

            <Reveal animation="up" delay={150}>
              <div id="company-profile-video" className="mx-auto mt-12 max-w-4xl relative">
                
                <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-[#00AEEF] via-[#39B54A] to-[#E31E24] opacity-20 blur-xl"></div>

                <div className="relative w-full overflow-hidden rounded-3xl border-4 border-white bg-black shadow-2xl aspect-video">
                  <div 
                    className="absolute inset-0 h-full w-full"
                    style={{
                      WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                      maskImage: 'radial-gradient(white, black)'
                    }}
                  >
                    <iframe
                      src={companyProfileVideoUrl}
                      title="Video Company Profile Intron Global Academy"
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                </div>

              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* PROGRAM SECTION - Minimalis */}
      {services.length > 0 && (
        <section className="relative overflow-hidden border-y border-gray-100 bg-[#fafafa] py-24 md:py-32">
          <Container className="relative z-10">
            <Reveal animation="up">
              <SectionTitle
                align="center"
                intro="Dari Kaigou (Perawatan Lansia) hingga menjadi perawat di rumah sakit."
              >
                Yang Kami Carikan
              </SectionTitle>
            </Reveal>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 6).map((s, i) => (
                <Reveal key={s.id} animation="up" delay={i * 100}>
                  <Link href={`/program#${s.slug}`} className="block h-full">
                    <div className="group h-full rounded-3xl bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-transparent hover:border-gray-100">
                      <div className="mb-6 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00AEEF]/10 to-[#39B54A]/10 text-xl font-bold text-[#00AEEF] transition-colors group-hover:from-[#00AEEF] group-hover:to-[#39B54A] group-hover:text-white">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <svg
                          className="h-6 w-6 text-gray-300 transition-colors group-hover:text-[#E31E24]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>

                      <h3 className="text-xl font-bold text-[#1A1A1A] transition-colors group-hover:text-[#00AEEF]">
                        {s.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-500">
                        {s.summary}
                      </p>

                      {s.tags && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {splitTags(s.tags).slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-gray-50 px-2.5 py-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal animation="up" delay={400}>
              <div className="mt-14 text-center">
                <ButtonLink href="/program" variant="outline">
                  Lihat Semua Program
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* INSTRUKTUR SECTION */}
      {team.length > 0 && (
        <section className="relative overflow-hidden py-24 md:py-32 bg-white">
          <Container className="relative z-10">
            <Reveal animation="up">
              <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
                <SectionTitle intro="Belajar bersama instruktur yang siap mendampingi persiapan bahasa dan dunia kerja di Jepang.">
                  Kenali Para Staff Kami
                </SectionTitle>
              </div>
            </Reveal>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {team.slice(0, 4).map((instructor, i) => (
                <Reveal key={instructor.id} animation="up" delay={i * 100}>
                  <div className="group h-full overflow-hidden rounded-3xl bg-white transition-all duration-500 hover:-translate-y-2">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100">
                      {instructor.photoUrl ? (
                        <img
                          src={instructor.photoUrl}
                          alt={instructor.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#00AEEF]/10 to-[#39B54A]/10">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="h-24 w-24 text-[#00AEEF]/30"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="8" r="4" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 21a8 8 0 0 1 16 0" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 pb-2 px-2">
                      <h3 className="text-xl font-bold text-[#1A1A1A] transition-colors group-hover:text-[#00AEEF]">
                        {instructor.name}
                      </h3>
                      {instructor.role && (
                        <p className="mt-1 text-sm font-bold text-[#E31E24]">
                          {instructor.role}
                        </p>
                      )}
                      {instructor.bio && (
                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
                          {instructor.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal animation="up" delay={300}>
              <div className="mt-16 text-center">
                <ButtonLink href="/tentang" variant="outline">
                  Kunjungi Profil Para Instruktur
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* TESTIMONI SECTION - Dark Premium Mode */}
{testimonials.length > 0 && (
  <section className="relative overflow-hidden bg-[#0f0f0f] py-24 md:py-32">
    <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#00AEEF]/10 blur-[150px]" />
    <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[#E31E24]/10 blur-[120px]" />

    <Container className="relative z-10">
      <Reveal animation="up">
        <h2 className="mb-16 max-w-[20ch] text-4xl font-bold tracking-tight text-white md:text-5xl">
          Kata Mereka Setelah{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AEEF] to-[#39B54A]">
            Berhasil Berangkat ke Jepang
          </span>
        </h2>
      </Reveal>
      <Reveal animation="up" delay={150}>
        <TestimonialSlider testimonials={testimonials} />
      </Reveal>

      {/* Tombol Lihat Semua Ulasan */}
      <Reveal animation="up" delay={300}>
        <div className="mt-12 flex justify-center">
          <Link
            href="/ulasan-siswa"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#00AEEF] hover:bg-[#00AEEF]/10 hover:shadow-[0_0_30px_rgba(0,174,239,0.3)]"
          >
            Lihat Semua Ulasan Siswa
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </Reveal>
    </Container>
  </section>
)}

      {/* PARTNERS SECTION */}
      {partners.length > 0 && (
        <section className="overflow-hidden border-b border-gray-100 bg-white py-16">
          <style>{`
            @keyframes geserKiriSmooth {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            .track-geser {
              animation: geserKiriSmooth 30s linear infinite;
            }
            .track-geser:hover {
              animation-play-state: paused;
            }
            @media (prefers-reduced-motion: reduce) {
              .track-geser { animation: none; }
            }
          `}</style>

          <Container>
            <Reveal animation="up">
              <h2 className="mb-10 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                Mitra-mitra Kami yang Tersebar di Seluruh Indonesia
              </h2>
            </Reveal>

            <div
              className="relative w-full overflow-hidden"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              }}
            >
              <div className="track-geser flex w-max items-center">
                {[...partners, ...partners, ...partners, ...partners].map(
                  (p, i) => (
                    <div
                      key={`${p.id}-${i}`}
                      aria-hidden={i >= partners.length}
                      className="shrink-0 px-8 opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                    >
                      {p.logoUrl ? (
                        <img
                          src={p.logoUrl}
                          alt={p.name}
                          loading="lazy"
                          className="h-10 w-auto object-contain"
                        />
                      ) : (
                        <span className="whitespace-nowrap font-display text-xl font-bold text-[#1A1A1A]">
                          {p.name}
                        </span>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>

            <Reveal animation="up" delay={200}>
              <div className="mt-12 text-center">
                <ButtonLink href="/mitra" variant="outline">
                  Lihat Semua Mitra
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* ARTIKEL / BLOG SECTION */}
      {posts.length > 0 && (
        <section className="py-24 md:py-32 bg-white">
          <Container>
            <Reveal animation="up">
              <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
                <SectionTitle>Catatan dari Tim</SectionTitle>
                <TextLink href="/blog">Semua Artikel</TextLink>
              </div>
            </Reveal>

            <div className="grid gap-8 md:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.id} animation="up" delay={i * 150}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      {p.coverUrl ? (
                        <img
                          src={p.coverUrl}
                          alt={`Sampul artikel ${p.title}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#00AEEF]/10 to-[#E31E24]/10">
                          <span className="text-sm font-semibold text-gray-400">Artikel</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-center gap-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <time
                          dateTime={
                            p.publishedAt instanceof Date && !Number.isNaN(p.publishedAt.getTime())
                              ? p.publishedAt.toISOString()
                              : undefined
                          }
                        >
                          {p.publishedAt instanceof Date && !Number.isNaN(p.publishedAt.getTime())
                            ? formatDate(p.publishedAt)
                            : ""}
                        </time>
                        <span className="h-1 w-1 rounded-full bg-gray-300" />
                        <span>Artikel</span>
                      </div>

                      <h3 className="mb-3 line-clamp-2 text-xl font-bold text-[#1A1A1A] transition-colors group-hover:text-[#00AEEF]">
                        {p.title}
                      </h3>

                      {p.excerpt && (
                        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500">
                          {p.excerpt}
                        </p>
                      )}

                      <div className="mt-auto flex items-center text-sm font-bold text-[#00AEEF]">
                        Baca Selengkapnya
                        <svg
                          className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA SECTION - Full Color Gradient Logo */}
      <section className="relative overflow-hidden bg-[#fafafa] py-24">
        <Container>
          <Reveal animation="zoom">
            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#00AEEF] via-[#1A1A1A] to-[#0f0f0f] p-12 text-center shadow-2xl md:p-24">
              
              <Lattice
                cols={6} rows={4} cell={96}
                className="pointer-events-none absolute inset-y-0 right-0 z-0 h-full w-[50%] text-white/5 [mask-image:linear-gradient(to_right,transparent,black_50%)]"
              />

              <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#E31E24]/30 blur-[100px]" />
              <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#39B54A]/20 blur-[100px]" />

              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                  {settings.ctaTitle || "Mari Bicara"}
                </h2>

                {settings.ctaBody && (
                  <p className="mx-auto mb-10 max-w-xl text-lg text-white/80">
                    {settings.ctaBody}
                  </p>
                )}

                <div className="flex flex-wrap justify-center gap-4">
                  <ButtonLink href="/kontak" variant="secondary" className="shadow-2xl">
                    Hubungi Kami
                  </ButtonLink>
                  <ButtonLink href="/program" variant="outline-light">
                    Lihat Program
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

    </>
  );
}
