
import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { Container } from "@/components/site/ui";
import { getSettings } from "@/lib/data";
import { SiteHero } from "@/components/site/SiteHero";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi kami untuk membicarakan kebutuhan sistem Anda.",
};

const ALLOWED_MAP_PREFIXES = [
  "https://www.google.com/maps/embed",
  "https://maps.google.com/maps",
  "https://www.openstreetmap.org/export/embed.html",
];

export default async function ContactPage() {
  const s = await getSettings();

  const mapOk =
    s.mapEmbedUrl &&
    ALLOWED_MAP_PREFIXES.some((p) => s.mapEmbedUrl.startsWith(p));

  const link =
    "text-batik-soft underline underline-offset-4 hover:text-batik";

  return (
    <>
      <SiteHero
        title="Kontak"
        subtitle={
          s.ctaBody ||
          "Ceritakan kebutuhan Anda. Kami balas dalam satu hari kerja."
        }
        imageUrl={s.heroImageUrl}
      />

      <Container className="grid gap-14 py-16 md:grid-cols-[1fr_1.2fr] md:gap-20 md:py-24">
        <div className="space-y-8">
          {s.address && (
            <div>
              <h2 className="text-xl font-semibold">Alamat</h2>
              <address className="mt-2 whitespace-pre-line not-italic text-muted">
                {s.address}
              </address>
            </div>
          )}

          {(s.email || s.phone || s.whatsapp) && (
            <div>
              <h2 className="text-xl font-semibold">
                Hubungi langsung
              </h2>

              <ul className="mt-2 space-y-1 text-muted">
                {s.email && (
                  <li>
                    <a href={`mailto:${s.email}`} className={link}>
                      {s.email}
                    </a>
                  </li>
                )}

                {s.phone && (
                  <li>
                    <a
                      href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}
                      className={link}
                    >
                      {s.phone}
                    </a>
                  </li>
                )}

                {s.whatsapp && (
                  <li>
                    <a
                      href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={link}
                    >
                      WhatsApp
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {mapOk && (
            <iframe
              src={s.mapEmbedUrl}
              title={`Peta lokasi ${s.companyName}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full border border-line"
            />
          )}
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-semibold">
            Kirim pesan
          </h2>
          <ContactForm />
        </div>
      </Container>
    </>
  );
}
