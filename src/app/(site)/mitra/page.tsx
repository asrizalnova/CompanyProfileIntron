import type { Metadata } from "next";
import {
  getPartners,
  getSettings,
  getPartnerMembers,
  getPartnerDocumentations,
} from "@/lib/data";
import {
  Container,
  Reveal,
  SectionTitle,
  ButtonLink,
} from "@/components/site/ui";
import { SiteHero } from "@/components/site/SiteHero";
import { Lattice } from "@/components/site/Kawung";
import { PartnerGallery } from "@/components/site/PartnerGallery";

export const metadata: Metadata = {
  title: "Mitra",
  description: "Kenali klien dan mitra yang telah bekerja sama dengan kami.",
};

export default async function MitraPage() {
  const [partners, settings] = await Promise.all([
    getPartners(),
    getSettings(),
  ]);

  const partnerContents = await Promise.all(
    partners.map(async (partner) => {
      const [members, documentations] = await Promise.all([
        getPartnerMembers(partner.id),
        getPartnerDocumentations(partner.id),
      ]);

      return {
        partner,
        members,
        documentations,
      };
    }),
  );

  return (
    <>
      <SiteHero
        title="Mitra Kami"
        subtitle="Bersama klien dan mitra, kami membangun kolaborasi untuk menghasilkan dampak yang lebih baik."
        imageUrl={settings.heroImageUrl}
      />

      <section className="relative bg-paper py-20 md:py-28">
        <Container>
          <Reveal animation="up">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <SectionTitle
                align="center"
                intro="Kami bangga dapat bekerja sama dengan berbagai institusi dan perusahaan terkemuka."
              >
                Jaringan Kolaborasi
              </SectionTitle>
            </div>
          </Reveal>

          {partnerContents.length === 0 ? (
            <Reveal animation="up">
              <p className="py-10 text-center text-muted">
                Informasi mitra sedang disiapkan.
              </p>
            </Reveal>
          ) : (
            <div className="space-y-12 md:space-y-16">
              {partnerContents.map(({ partner, members, documentations }) => (
                <Reveal key={partner.id} animation="up">
                  <article className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow duration-500 hover:shadow-lg">
                    
                    {/* BAGIAN ATAS: INFO & MAPS */}
                    <div className="grid md:grid-cols-[1.2fr_1fr] divide-y md:divide-y-0 md:divide-x divide-line">
                      
                      {/* KIRI: Logo, Nama, Deskripsi, Tombol */}
                      <div className="p-6 md:p-10 flex flex-col justify-center">
                        {/* Logo Kecil di Atas Nama */}
                        {partner.logoUrl && (
                          <div className="mb-4">
                            <img
                              src={partner.logoUrl}
                              alt={`Logo ${partner.name}`}
                              className="h-10 md:h-12 w-auto object-contain"
                              loading="lazy"
                            />
                          </div>
                        )}
                        
                        <h3 className="text-2xl font-bold text-ink mb-3">
                          {partner.name}
                        </h3>

                        <p className="text-muted text-sm leading-relaxed mb-6">
                          {partner.description ||
                            "Mitra resmi kami yang berdedikasi untuk memberikan fasilitas, pelatihan, dan kerja sama terbaik bagi peserta."}
                        </p>

                        {/* Alamat */}
                        {partner.address && (
                          <div className="mb-6 flex items-start gap-2 text-sm text-muted">
                            <span className="shrink-0 text-batik mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                            </span>
                            <span>{partner.address}</span>
                          </div>
                        )}

                        {/* Tombol */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {partner.websiteUrl && (
                            <ButtonLink href={partner.websiteUrl} variant="primary" rounded="full" className="!min-h-8 !px-4 !text-xs" showArrow>
                              Website
                            </ButtonLink>
                          )}
                          {partner.whatsapp && (
                            <ButtonLink href={`https://wa.me/${partner.whatsapp.replace(/\D/g, "")}`} variant="secondary" rounded="full" className="!min-h-8 !px-4 !text-xs" showArrow>
                              WhatsApp
                            </ButtonLink>
                          )}
                        </div>
                      </div>

                      {/* KANAN: Google Maps */}
                      <div className="bg-mist min-h-[250px] relative">
                        {partner.mapEmbedUrl ? (
                          <iframe
                            src={partner.mapEmbedUrl}
                            title={`Lokasi ${partner.name}`}
                            className="absolute inset-0 h-full w-full"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted">
                            Peta belum tersedia
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BAGIAN BAWAH: PENGURUS & DOKUMENTASI (Menyatu) */}
                    {(members.length > 0 || documentations.length > 0) && (
                      <div className="p-6 md:p-10 bg-white border-t border-line/50">
                        
                       {/* PENGURUS (Gaya Grid Rapat) */}
                        {members.length > 0 && (
                          <div className="mb-10">
                            <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-batik-soft">
                              Pengurus {partner.name}
                            </h4>
                            
                            {/* Menggunakan inline-grid atau flex wrap agar item hanya selebar teksnya, tidak memanjang penuh */}
                            <ul className="flex flex-wrap gap-x-12 gap-y-4">
                              {members.map((member) => (
                                <li key={member.id} className="flex flex-col min-w-[120px]">
                                  <span className="text-sm font-semibold text-ink">
                                    {member.name}
                                  </span>
                                  {member.position && (
                                    <span className="text-xs text-muted mt-0.5">
                                      {member.position}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Dokumentasi (Tanpa sekat) */}
                        {documentations.length > 0 && (
                          <PartnerGallery photos={documentations} />
                        )}
                      </div>
                    )}

                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* CTA MENJADI MITRA */}
      <section className="relative overflow-hidden bg-white py-20">
        <Container>
          <Reveal animation="zoom">
            <div className="relative overflow-hidden rounded-3xl bg-batik p-12 text-center shadow-2xl md:p-16">
              <Lattice cols={6} rows={4} cell={96} className="pointer-events-none absolute inset-y-0 right-0 h-full w-[50%] text-white/5 mask-[linear-gradient(to_right,transparent,black_50%)]" />
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                  Ingin Menjadi Mitra Kami?
                </h2>
                <p className="mb-8 text-lg text-white/70">
                  Mari berkolaborasi untuk menciptakan dampak yang lebih luas dan berkelanjutan.
                </p>
                <ButtonLink href={settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}` : "/kontak"} variant="secondary" className="shadow-xl">
                  Hubungi Kami Sekarang
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}