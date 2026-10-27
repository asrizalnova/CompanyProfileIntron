import type { Metadata } from "next";
import Link from "next/link";
import { getServices, getSettings } from "@/lib/data";
import { splitTags } from "@/lib/utils";
import { SiteHero } from "@/components/site/SiteHero";
import { ButtonLink, Container, SectionTitle, Reveal } from "@/components/site/ui";
import { Lattice } from "@/components/site/Kawung";
import { AccordionPersyaratan } from "@/components/site/AccordionPersyaratan";
import { AlurPendaftaran } from "@/components/site/AlurPendaftaran";


export const metadata: Metadata = {
  title: "Program",
  description: "Temukan berbagai program pelatihan bahasa dan kerja Jepang.",
};

// 1. DEKLARASI DATA DI LUAR FUNGSI (Mengatasi ReferenceError)
const trainingPrograms = [
  {
    title: "Pelatihan Bahasa",
    desc: "Belajar Bahasa Jepang dari dasar hingga mahir dengan metode praktis dan interaktif.",
  },
  {
    title: "Persiapan Ujian",
    desc: "Pelatihan intensif untuk menghadapi ujian bahasa Jepang JFT A2 dengan maksimal.",
  },
  {
    title: "Pelatihan Bisnis",
    desc: "Kemampuan bahasa dan etika kerja standar perusahaan di Jepang untuk kesuksesan karier.",
  },
  {
    title: "Budaya Jepang",
    desc: "Pembelajaran budaya dan kebiasaan Jepang untuk memudahkan adaptasi kerja dan hidup di sana.",
  },
];

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    getServices(),
    getSettings(),
  ]);

  return (
    <>
      {/* =========================================
          HERO SECTION
          ========================================= */}
      <SiteHero
        title="Program Kami"
        subtitle="Temukan program pelatihan bahasa dan kerja Jepang yang sesuai dengan kebutuhan Anda."
        imageUrl={settings.heroImageUrl}
      />

      {/* =========================================
          DAFTAR PROGRAM (Grid dengan Animasi)
          ========================================= */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <Container>
          {/* Section Title */}
          <Reveal animation="up">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <SectionTitle align="center" intro="Pilih dari berbagai program unggulan yang telah dirancang untuk mempersiapkan masa depan Anda.">
                Pilihan Program
              </SectionTitle>
            </div>
          </Reveal>

          {services.length === 0 ? (
            <Reveal animation="up">
              <div className="text-center py-20 bg-mist rounded-2xl border border-line">
                <p className="text-muted text-lg">
                  Belum ada program yang tersedia saat ini.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((program, index) => {
                const tags = splitTags(program.tags || "");

                return (
                  <Reveal key={program.id} animation="up" delay={index * 100}>
                    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-batik/10 hover:border-batik/30">
                      
                      {/* Gambar Program */}
                      <Link
                        href={`/program/${program.slug}`}
                        className="relative block overflow-hidden bg-mist aspect-[4/3]"
                        aria-label={`Lihat detail ${program.title}`}
                      >
                        {program.photoUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={program.photoUrl}
                            alt={program.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-mist">
                            <div className="px-4 text-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mx-auto text-batik/20"
                                aria-hidden="true"
                              >
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="m21 15-5-5L5 21" />
                              </svg>
                              <p className="mt-3 text-sm text-muted">
                                Gambar belum tersedia
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Overlay Gradient saat Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          <span className="text-white font-bold flex items-center gap-2">
                            Lihat Detail
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </span>
                        </div>
                      </Link>

                      {/* Informasi Program */}
                      <div className="flex flex-1 flex-col p-6">
                        {/* Tags */}
                        {tags.length > 0 && (
                          <ul className="mb-4 flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <li
                                key={tag}
                                className="rounded-full bg-batik/5 px-3 py-1 text-xs font-semibold text-batik uppercase tracking-wider"
                              >
                                {tag}
                              </li>
                            ))}
                          </ul>
                        )}

                        <h2 className="text-xl font-bold leading-snug text-ink group-hover:text-batik-soft transition-colors md:text-2xl">
                          <Link href={`/program/${program.slug}`}>
                            {program.title}
                          </Link>
                        </h2>

                        {program.summary && (
                          <p className="mt-3 flex-1 leading-relaxed text-muted line-clamp-3">
                            {program.summary}
                          </p>
                        )}

                        <div className="mt-6 pt-6 border-t border-line">
                          <ButtonLink
                            href={`/program/${program.slug}`}
                            variant="outline"
                            className="w-full !min-h-10 !text-sm"
                            showArrow={true}
                          >
                            Selengkapnya
                          </ButtonLink>
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

           {/* =========================================
          SECTION PROGRAM PELATIHAN 
          ========================================= */}
      <section className="relative pt-24 md:pt-32 pb-32 md:pb-48 bg-white overflow-hidden">
        
        {/* Background Gradasi Gelap: Biru Tua -> Hijau Tua -> Hitam */}
        <div className="absolute top-0 left-0 w-full h-[380px] md:h-[420px] bg-gradient-to-br from-[#005f82] via-[#0a6b30] to-[#1A1A1A]">
          {/* Efek pendaran / Blur agar tidak flat */}
          <div className="absolute top-0 right-0 h-full w-[60%] bg-gradient-to-l from-white/5 to-transparent blur-2xl" />
          
          {/* Aksen Glow Merah Logo yang lebih redup */}
          <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] bg-[#E31E24]/20 blur-[100px] rounded-full" />
          
          {/* Pattern Grid Halus agar terkesan premium */}
          <div className="absolute inset-0 bg-grid-pattern-dark opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        </div>

        <Container className="relative z-10">
          {/* Header Text di atas background gelap */}
          <div className="max-w-3xl mb-16 md:mb-24">
            <Reveal animation="up">
              {/* Tipografi: font-serif/font-display untuk kesan elegan */}
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 drop-shadow-md">
                Program Pelatihan
              </h2>
              <p className="text-base md:text-lg text-white/80 leading-relaxed font-medium">
                Program pelatihan ini dirancang untuk membekali peserta dengan keterampilan bahasa, pemahaman budaya, serta keahlian kerja yang relevan di Jepang.
              </p>
            </Reveal>
          </div>

          {/* Grid Kartu Putih yang Menumpuk (Overlap) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-stretch">
            {trainingPrograms.map((item, i) => (
              <Reveal key={i} animation="up" delay={i * 100} className="h-full">
                {/* flex flex-col dan h-full memastikan semua kotak sejajar tingginya */}
                <div className="group relative flex flex-col h-full bg-white p-8 pt-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2 border border-gray-50">
                  
                  {/* Lingkaran Plus yang menonjol di atas */}
                  <div className="absolute -top-8 left-8 h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgb(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-300">
                    {/* Ikon Plus Merah Logo */}
                    <span className="text-[#E31E24] text-3xl font-light group-hover:rotate-90 transition-transform duration-500">
                      +
                    </span>
                  </div>

                  {/* Judul Kartu */}
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#00AEEF] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  
                  {/* Deskripsi Kartu */}
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">
                    {item.desc}
                  </p>

                  {/* Garis aksen bawah: Gradasi Biru ke Hijau */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#00AEEF] to-[#39B54A] group-hover:w-full transition-all duration-500 rounded-b-2xl" />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

            {/* =========================================
          SECTION ALUR & PERSYARATAN (Biru-Hijau Logo)
          ========================================= */}
      <section className="relative py-24 bg-white overflow-hidden">
        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
            
            {/* Kolom Kiri: Teks & Tombol */}
            <div className="flex flex-col justify-center">
              <Reveal animation="left">
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.2] mb-8">
                  Raih <span className="text-[#00AEEF]">Kesuksesan Karir</span> anda bersama kami!
                </h2>
                <p className="text-lg text-gray-600 mb-10">
                  Daftarkan diri anda sekarang juga!
                </p>
                <div>
                  {/* Tombol diganti menjadi gradasi Biru ke Hijau */}
                  <Link
                    href="/skema-pembiayaan"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#00AEEF] to-[#39B54A] px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:shadow-[0_10px_30px_-5px_rgba(0,174,239,0.4)] hover:-translate-y-1"
                  >
                    Lihat Skema Pembiayaan
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Kolom Kanan: Panel Gelap Accordion */}
            <Reveal animation="right" delay={200} className="h-full">
              <div className="relative h-full bg-[#1A1A1A] rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden">
                {/* Ornamen Pendaran Halus (Biru & Hijau) */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00AEEF]/20 blur-[80px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#39B54A]/10 blur-[80px] rounded-full" />
                
                <div className="relative z-10">
                  <AccordionPersyaratan />
                </div>
              </div>
            </Reveal>

          </div>
        </Container>
      </section>

          {/* =========================================
          SECTION ALUR PENDAFTARAN (Tema Jepang)
          ========================================= */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-[#0f0f0f]">
        {/* Background Image: Pemandangan Jepang */}
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop')" 
          }}
        />
        
        {/* Overlay Gradasi Warna Logo: Hitam -> Biru Tua -> Hijau Tua */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0f0f0f] via-[#0f0f0f]/90 to-[#005f82]/60" />

        <Container className="relative z-10">
          {/* Header Teks */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <Reveal animation="up">
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide mb-6 drop-shadow-md">
                Alur Pendaftaran Tokutei Ginou !
              </h2>
              <p className="text-base md:text-lg text-white/70 leading-relaxed font-medium">
                Langkah Mudah Menuju Masa Depan Cemerlang: Daftarkan Diri Anda Sekarang dan Raih Kesempatan Emas!
              </p>
            </Reveal>
          </div>

          {/* Panggil Komponen Accordion Alur Pendaftaran */}
          <Reveal animation="up" delay={200}>
            <div className="mb-16 md:mb-24"> {/* Jarak aman sebelum ujung section */}
              <AlurPendaftaran />
            </div>
          </Reveal>
          
        </Container>
      </section>

      {/* =========================================
          CTA SECTION DI BAWAH (Diberi Jarak Atas)
          ========================================= */}
      <section className="relative pt-20 md:pt-28 pb-24 md:pb-32 bg-white">
        <Container>
          <Reveal animation="up" delay={300}>
            <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-batik via-batik to-ink p-10 md:p-16 shadow-2xl">
              {/* Ornamen Lattice */}
              <Lattice
                cols={6} rows={4} cell={96}
                className="pointer-events-none absolute inset-y-0 right-0 h-full w-[50%] text-white/5 mask-[linear-gradient(to_right,transparent,black_50%)]"
              />
              
              {/* Glow Effects */}
              <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-kunyit/20 blur-[80px]" />
              <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-batik-wash/40 blur-[80px]" />

              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
                  {settings.ctaTitle || "Punya Pertanyaan Tentang Program Kami?"}
                </h2>
                <p className="text-lg text-white/70 mb-8">
                  Tim kami siap membantu Anda menemukan program yang paling sesuai dengan kebutuhan dan tujuan karier Anda.
                </p>
                <div className="flex flex-wrap gap-4">
                  <ButtonLink href="/kontak" variant="secondary" className="shadow-2xl">
                    Hubungi Kami
                  </ButtonLink>
                  <ButtonLink href="/tentang" variant="outline-light">
                    Tentang Kami
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