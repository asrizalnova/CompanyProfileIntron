"use client";

import Link from "next/link";
import type { Settings, Service, GalleryAlbum } from "@/lib/data";
import {
  SiInstagram,
  SiTiktok,
  SiYoutube,
  SiThreads,
  SiFacebook,
} from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import { LogoMark } from "./Kawung";
import { DesktopNav, MobileMenu } from "./nav";
import { ButtonLink } from "./ui";

type SiteHeaderProps = {
  settings: Settings;
  programs: Pick<Service, "title" | "slug">[];
  galleries: Pick<GalleryAlbum, "title" | "slug">[];
};

export function SiteHeader({
  settings,
  programs,
  galleries,
}: SiteHeaderProps) {
  const socials = [
    {
      label: "Instagram",
      href: settings.instagram,
      Icon: SiInstagram,
    },
    {
      label: "TikTok",
      href: settings.tiktok,
      Icon: SiTiktok,
    },
    {
      label: "YouTube",
      href: settings.youtube,
      Icon: SiYoutube,
    },
    {
      label: "Threads",
      href: settings.threads,
      Icon: SiThreads,
    },
    {
      label: "Facebook",
      href: settings.facebook,
      Icon: SiFacebook,
    },
    {
      label: "LinkedIn",
      href: settings.linkedin,
      Icon: FaLinkedinIn,
    },
  ].filter((item) => item.href?.trim());

  return (
    <>
      {/* TOP BAR - Lebih kecil & elegan */}
      <div className="relative z-40 w-full bg-ink text-white">
        <div className="mx-auto flex min-h-9 w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-1.5 md:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[10px] font-medium tracking-wide text-white/80 sm:text-[11px]">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true">📚</span>
              <span>Lembaga Pelatihan Bahasa dan Kerja Jepang</span>
            </span>

            {settings.email?.trim() && (
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-1.5 transition-colors hover:text-kunyit"
              >
                <span aria-hidden="true">✉</span>
                <span>{settings.email}</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-1">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-white/70 transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:text-kunyit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kunyit"
              >
                <Icon size={13} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-line/60 bg-paper/90 shadow-sm backdrop-blur-lg supports-[backdrop-filter]:bg-paper/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 text-batik transition-transform duration-300 hover:scale-[1.02]"
            aria-label={`${settings.companyName}, ke beranda`}
          >
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt=""
                className="h-7 w-auto object-contain"
              />
            ) : (
              <LogoMark className="h-7 w-7 text-batik" />
            )}
          </Link>

          <DesktopNav
            programs={programs}
            galleries={galleries}
          />

          <div className="relative z-50 flex shrink-0 items-center gap-2 sm:gap-3">
            <ButtonLink
              href="/kontak"
              variant="primary"
              rounded="full"
              showArrow={true}
              className="hidden lg:inline-flex !min-h-[32px] !h-[32px] !px-4 !text-[11px] !font-bold !tracking-wide !gap-1 [&>svg]:!h-3 [&>svg]:!w-3 [&>svg]:!ml-0.5 !shadow-sm transition-all duration-300 hover:!-translate-y-0.5 hover:!shadow-md"
            >
              Hubungi Kami
            </ButtonLink>

            <MobileMenu
              programs={programs}
              galleries={galleries}
            />
          </div>
        </div>
      </header>
    </>
  );
}