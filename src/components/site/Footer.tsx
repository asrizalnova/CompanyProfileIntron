import Image from "next/image";
import Link from "next/link";
import type { Settings } from "@/lib/data";
// Hapus: import { LogoMark } from "./Kawung";
import { Container } from "./ui";
import { navItems } from "./nav-items";

export function SiteFooter({ settings }: { settings: Settings }) {
  const socials = [
    { label: "Instagram", href: settings.instagram },
    { label: "LinkedIn", href: settings.linkedin },
    { label: "Facebook", href: settings.facebook },
    { label: "YouTube", href: settings.youtube },
    { label: "Tiktok", href: settings.tiktok },
    { label: "Threads", href: settings.threads },
  ].filter((s) => s.href);

  // Class dasar untuk link dengan transisi halus
  const linkCls = "text-white/70 transition-colors duration-300 hover:text-white";
  
  // Class khusus untuk link yang memiliki efek underline gradient
  const underlineCls = "group relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#00AEEF] after:to-[#39B54A] after:transition-all after:duration-300 hover:after:w-full";

  return (
    <footer className="relative overflow-hidden bg-[#0a0a0a] text-white">
      {/* Garis Gradasi Logo di Bagian Paling Atas Footer */}
      <div className="h-1 w-full bg-gradient-to-r from-[#00AEEF] via-[#39B54A] to-[#E31E24]" />

      {/* Efek Pendaran (Glow) Halus di Background Footer */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-[#00AEEF]/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#E31E24]/5 blur-[120px]" />

      <Container className="relative z-10 grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1.2fr]">
        {/* Kolom 1: Logo & Tagline */}
        <div>
          <div className="flex items-center">
            <Image
              src="/logoputih.png"
              alt="Logo Intron Global Academy"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
          {settings.tagline && (
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/60">
              {settings.tagline}
            </p>
          )}
        </div>

        {/* Kolom 2: Navigasi */}
        <nav aria-label="Navigasi footer">
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-white">
            Halaman
          </h2>
          <ul className="mt-6 space-y-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={`${linkCls} ${underlineCls} text-sm font-medium`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Kolom 3: Kontak & Sosial Media */}
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-widest text-white">
            Kontak
          </h2>
          <address className="mt-6 space-y-3 not-italic text-sm text-white/60">
            {settings.address && (
              <p className="whitespace-pre-line leading-relaxed">
                {settings.address}
              </p>
            )}
            {settings.email && (
              <p>
                <a href={`mailto:${settings.email}`} className={`${linkCls} ${underlineCls}`}>
                  {settings.email}
                </a>
              </p>
            )}
            {settings.phone && (
              <p>
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className={`${linkCls} ${underlineCls}`}>
                  {settings.phone}
                </a>
              </p>
            )}
          </address>
          
          {socials.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a 
                    href={s.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${linkCls} ${underlineCls} text-xs font-bold uppercase tracking-wider`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>

      {/* Bagian Bawah (Copyright) */}
      <div className="relative z-10 border-t border-white/10 bg-black/20">
        <Container className="flex flex-col gap-3 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold text-white/70">{settings.companyName}</span>. All rights reserved.
          </p>
          {settings.footerNote && <p>{settings.footerNote}</p>}
        </Container>
      </div>
    </footer>
  );
}