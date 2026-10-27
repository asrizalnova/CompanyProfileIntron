import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/Footer";
import { SiteHeader } from "@/components/site/Header";
import { FloatingActions } from "@/components/site/FloatingActions";
import {
  getGalleryAlbums,
  getServices,
  getSettings,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s.seoTitle || s.companyName;

  return {
    title: {
      default: title,
      template: `%s | ${s.companyName}`,
    },
    description: s.seoDescription || s.tagline || undefined,
    openGraph: {
      siteName: s.companyName,
      locale: "id_ID",
      type: "website",
      title,
      description: s.seoDescription || s.tagline || undefined,
    },
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, programs, albums] = await Promise.all([
    getSettings(),
    getServices(),
    getGalleryAlbums(),
  ]);

  const navigationPrograms = programs.map(({ title, slug }) => ({
    title,
    slug,
  }));

  const navigationAlbums = albums.map(({ title, slug }) => ({
    title,
    slug,
  }));

  return (
    <>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-kunyit focus:px-4 focus:py-2 focus:font-semibold"
      >
        Lewati ke konten
      </a>

      <SiteHeader
        settings={settings}
        programs={navigationPrograms}
        galleries={navigationAlbums}
      />

      <main id="konten" className="overflow-hidden">
        {children}
      </main>

      <SiteFooter settings={settings} />

      <FloatingActions whatsappNumber={settings.whatsapp} />
    </>
  );
}