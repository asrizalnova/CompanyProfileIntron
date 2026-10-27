
import "server-only";

/** Pemetaan kunci resource admin → nama tabel database. */
export const tables: Record<string, { name: string; hasSlug: boolean }> = {
  program: { name: "programs", hasSlug: true },
  tim: { name: "team_members", hasSlug: false },
  testimoni: { name: "testimonials", hasSlug: false },
  mitra: { name: "partners", hasSlug: false },
  dokumentasi_partner: { name: "partner_documentations", hasSlug: false },
  tim_partner: { name: "partner_members", hasSlug: false },
  galeri: { name: "gallery_albums", hasSlug: true },
  statistik: { name: "stats", hasSlug: false },
  artikel: { name: "posts", hasSlug: true },
  pendaftaran: { name: "registration_batches", hasSlug: false },
  "unduh-berkas": { name: "download_documents", hasSlug: false },
};