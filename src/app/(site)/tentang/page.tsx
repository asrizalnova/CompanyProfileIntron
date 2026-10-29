/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Lattice } from "@/components/site/Kawung";
import { Markdown } from "@/components/site/Media";
import { ButtonLink, Container, SectionTitle, Reveal } from "@/components/site/ui";
import { getSettings, getStats, getTeam } from "@/lib/data";
import { SiteHero } from "@/components/site/SiteHero";
import { InstructorSlider } from "@/components/site/InstructorSlider";

export const metadata: Metadata = {
  title: "Tentang kami",
  description: "Cerita, visi, misi, dan tim di balik perusahaan.",
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function AboutPage() {
  const [settings, team, stats] = await Promise.all([
    getSettings(),
    getTeam(),
    getStats(),
  ]);

  const missions = settings.mission
    .split("\n")
    .map((m) => m.trim())
    .filter(Boolean);

  return (
    <>
      {/* =========================================
          HERO SECTION
          ========================================= */}
      <SiteHero
        title={settings.aboutTitle || "Tentang Kami"}
        subtitle={
          settings.foundedYear
            ? `Berdiri sejak ${settings.foundedYear}.`
            : "Cerita, visi, misi, dan tim di balik perusahaan."
        }
        imageUrl={settings.heroImageUrl}
      />

      {/* =========================================
          CERITA PERUSAHAAN (Split Layout Asimetris)
          ========================================= */}
      <section className="py-24 md:py-32 overflow-hidden">
        <Container>
          <div className="grid gap-16 md:grid-cols-[1.3fr_1fr] md:gap-24 items-start">
            
            {/* Teks Cerita */}
            <Reveal animation="left">
              <SectionTitle intro="Perjalanan kami dimulai dari sebuah visi sederhana: memberikan yang terbaik.">
                Cerita Kami
              </SectionTitle>
              <div className="mt-8 prose-doc text-lg">
                {settings.aboutBody ? (
                  <Markdown>{settings.aboutBody}</Markdown>
                ) : (
                  <p className="text-muted">
                    Profil perusahaan sedang disiapkan.
                  </p>
                )}
              </div>
            </Reveal>

            {/* Gambar dengan Dekorasi */}
            {settings.aboutImageUrl && (
              <Reveal animation="right" delay={200} className="relative">
                {/* Dekorasi Kotak Miring di Belakang */}
                <div className="absolute -inset-4 bg-kunyit/10 rounded-2xl transform rotate-3 -z-10" />
                <div className="absolute -inset-4 bg-batik/5 rounded-2xl transform -rotate-3 -z-10" />
                
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-line">
                  <img
                    src={settings.aboutImageUrl}
                    alt="Tentang Kami"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      
      {/* =========================================
          LATAR BELAKANG PERUSAHAAN (Layout Grid Profesional)
          ========================================= */}
      {(settings.backgroundBody || settings.backgroundImageUrl) && (
        <section className="relative overflow-hidden bg-[#0a0a0a] py-24 md:py-32">
          
          {/* Background Solid */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#005f82] via-[#0a0a0a] to-[#1A1A1A]" />
          
          {/* Ornamen Glow */}
          <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#00AEEF]/10 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#39B54A]/10 blur-[120px]" />
          
          <Container className="relative z-10 max-w-7xl">
            <div className="w-full">
              
              {/* Header Section */}
              <Reveal animation="up">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: 'white' }}>
                    {settings.backgroundTitle || "Latar Belakang"}
                  </h2>
                  <div className="mt-4 mx-auto w-24 h-1 bg-gradient-to-r from-[#00AEEF] to-[#39B54A] rounded-full" />
                </div>
              </Reveal>

              {/* Konten Grid */}
              <Reveal animation="up" delay={200}>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 md:gap-16 items-center">
                  
                  {/* KOLOM KIRI: GAMBAR */}
                  {settings.backgroundImageUrl && (
                    <div className="flex justify-center md:justify-end">
                      <div className="relative group w-full max-w-[320px] md:max-w-[400px]">
                        <div className="absolute -inset-3 rounded-full border-2 border-dashed border-white/20 animate-[spin_20s_linear_infinite]" />
                        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#39B54A] opacity-30 blur-lg group-hover:opacity-60 transition-opacity duration-500" />
                        
                        <div className="relative aspect-square overflow-hidden rounded-full border-4 border-[#0a0a0a] bg-[#1A1A1A] shadow-2xl">
                          <img
                            src={settings.backgroundImageUrl}
                            alt={settings.backgroundTitle || "Latar Belakang Perusahaan"}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* KOLOM KANAN: TEKS */}
                  <div className="text-left">
                    {/* NGGAK PAKE PROSE LAGI! LANGSUNG PAKE INLINE STYLE BIAR PASTI PUTIH */}
                    <div 
                      className="max-w-none text-base md:text-lg leading-relaxed space-y-6"
                      style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                    >
                      <Markdown>{settings.backgroundBody}</Markdown>
                    </div>
                  </div>

                </div>
              </Reveal>

            </div>
          </Container>
        </section>
      )}


      {/* =========================================
          VISI & MISI (Background Abu dengan Pattern)
          ========================================= */}
      {(settings.vision || missions.length > 0) && (
        <section className="bg-mist py-24 md:py-32 border-y border-line relative overflow-hidden">
          {/* Pattern Halus */}
          <div className="absolute inset-0 bg-dots-pattern opacity-40" />
          
          <Container className="relative z-10">
            <Reveal animation="up">
              <div className="text-center mb-16">
                <SectionTitle align="center" intro="Pondasi yang membimbing setiap langkah kami.">
                  Visi & Misi
                </SectionTitle>
              </div>
            </Reveal>

            <div className="grid gap-8 md:grid-cols-2">
              
              {/* Kartu Visi */}
              {settings.vision && (
                <Reveal animation="up" delay={100}>
                  <div className="h-full bg-white rounded-2xl p-10 border border-line shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-batik/5 rounded-full -mr-16 -mt-16 group-hover:bg-batik/10 transition-colors" />
                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-batik/10 text-batik font-bold mb-6">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-ink mb-4">Visi Kami</h2>
                      <p className="text-xl leading-relaxed text-muted font-medium">
                        {settings.vision}
                      </p>
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Kartu Misi */}
              {missions.length > 0 && (
                <Reveal animation="up" delay={200}>
                  <div className="h-full bg-ink rounded-2xl p-10 border border-ink shadow-xl text-white relative overflow-hidden">
                    {/* Glow */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-kunyit/20 rounded-full blur-[80px]" />
                    
                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white/10 text-kunyit font-bold mb-6">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold mb-6">Misi Kami</h2>
                      <ul className="space-y-4">
                        {missions.map((m, i) => (
                          <li key={m} className="flex gap-4 items-start">
                            <span className="flex-shrink-0 mt-1.5 h-2 w-2 rotate-45 bg-kunyit" />
                            <span className="text-white/80 leading-relaxed">{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* =========================================
          STATISTIK (Kartu Mengambang)
          ========================================= */}
      {stats.length > 0 && (
        <section aria-label="Angka perusahaan" className="relative z-20 -mt-12 md:-mt-16">
          <Container>
            <Reveal animation="up">
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-white rounded-2xl shadow-2xl shadow-batik/10 border border-line p-6 md:p-10">
                {stats.map((s, i) => (
                  <div key={s.id} className="flex flex-col items-center text-center md:items-start md:text-left p-4 border-r last:border-r-0 border-line">
                    <dd className="font-display text-4xl font-extrabold text-batik md:text-5xl">{s.value}</dd>
                    <dt className="mt-2 text-sm font-medium text-muted">{s.label}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </Container>
        </section>
      )}

           {/* INSTRUKTUR / TIM KAMI SECTION (Menggunakan Swiper) */}
      {team.length > 0 && (
        <section className="relative overflow-hidden py-24 md:py-32 bg-white">
          <Container className="relative z-10">
            <Reveal animation="up">
              <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
                <SectionTitle intro="Belajar bersama instruktur yang siap mendampingi persiapan bahasa dan dunia kerja di Jepang.">
                  Kenali Para Staff Kami
                </SectionTitle>
              </div>
            </Reveal>

            {/* Slider Instruktur (Menampilkan semua team) */}
            <Reveal animation="up" delay={150}>
              <InstructorSlider team={team} />
            </Reveal>
            
          </Container>
        </section>
      )}

      {/* =========================================
          CTA SECTION (Gradient & Ornamen)
          ========================================= */}
      <section className="py-24 relative overflow-hidden bg-paper">
        <Container>
          <Reveal animation="zoom">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-batik via-batik to-ink p-12 md:p-20 text-center shadow-2xl">
              {/* Ornamen Lattice di Background */}
              <Lattice
                cols={6} rows={4} cell={96}
                className="pointer-events-none absolute inset-y-0 right-0 -z-0 h-full w-[50%] text-white/5 mask-[linear-gradient(to_right,transparent,black_50%)]"
              />
              
              {/* Glow Effects */}
              <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-kunyit/20 blur-[80px]" />
              <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-batik-wash/40 blur-[80px]" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
                  {settings.ctaTitle || "Mari Bicara"}
                </h2>
                {settings.ctaBody && (
                  <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
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