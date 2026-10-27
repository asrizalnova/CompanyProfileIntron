import "server-only";
import type { RowDataPacket } from "mysql2";
import { db } from "@/db";


export type Settings = {
  id: number;
  companyName: string;
  tagline: string;
  logoUrl: string;
  heroTitle: string;
  heroImageUrl: string;
  heroSubtitle: string;
  heroPrimaryLabel: string;
  heroSecondaryLabel: string;
  aboutTitle: string;
  aboutBody: string;
  aboutImageUrl: string;
  backgroundTitle: string;
  backgroundBody: string;
  backgroundImageUrl: string;
  vision: string;
  mission: string;
  foundedYear: number | null;
  companyProfileVideoUrl: string | null;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  mapEmbedUrl: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  threads: string;
  linkedin: string;
  facebook: string;
  ctaTitle: string;
  ctaBody: string;
  footerNote: string;
  seoTitle: string;
  seoDescription: string;
  updatedAt: Date;
};

export type Stat = {
  id: number;
  value: string;
  label: string;
  sortOrder: number;
  createdAt: Date;
};

export type Service = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  tags: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  photoUrl: string | null;
};

export type Project = {
  id: number;
  title: string;
  slug: string;
  client: string;
  category: string;
  year: string | number | null;
  summary: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedin: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  photoUrl: string | null;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Partner = {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  mapEmbedUrl: string;
  description: string | null;
  whatsapp: string;
  address: string | null;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
};


export type PartnerMember = {
  id: number;
  partnerId: number;
  name: string;
  position: string;
  photoUrl: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
};

export type PartnerDocumentation = {
  id: number;
  partnerId: number;
  title: string;
  description: string | null;
  imageUrl: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
};

export type DocumentationPhoto = {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
};


export type RegistrationBatch = {
  id: number;
  batchName: string;
  title: string;
  period: string | null;  
  selectionStartDate: string | Date | null;
  registrationCloseDate: string | Date | null;
  description: string | null;
  status: string;
  registrationUrl: string | null;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};


export async function getDocumentationPhotos(): Promise<
  DocumentationPhoto[]
> {
  return queryRows<DocumentationPhoto>(
    `SELECT *
     FROM documentations
     WHERE published = 1
     ORDER BY sort_order ASC, id ASC`,
  );
}


export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  author: string;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProgramActivity = {
  id: number;
  programId: number;
  title: string;
  imageUrl: string | null;
  description: string;
  sortOrder: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const fallbackSettings: Settings = {
  id: 1,
  companyName: "Nama Perusahaan",
  tagline: "",
  logoUrl: "",
  heroTitle: "Selamat datang",
  heroSubtitle: "Lengkapi profil perusahaan ini dari panel admin di /admin.",
  heroPrimaryLabel: "Lihat Program",
  heroSecondaryLabel: "Hubungi kami",
  heroImageUrl: "",
  aboutTitle: "Tentang kami",
  companyProfileVideoUrl: "",
  aboutBody: "",
  aboutImageUrl: "",
  backgroundTitle: "Latar Belakang",
  backgroundBody: "",
  backgroundImageUrl: "",
  vision: "",
  mission: "",
  foundedYear: null,
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  mapEmbedUrl: "",
  instagram: "",
  tiktok: "",
  youtube: "",
  threads: "",
  linkedin: "",
  facebook: "",
  ctaTitle: "Mari bicara tentang kebutuhan Anda",
  ctaBody: "",
  footerNote: "",
  seoTitle: "",
  seoDescription: "",
  updatedAt: new Date(0),
};


export type GalleryAlbum = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GalleryPhoto = {
  id: number;
  albumId: number;
  title: string | null;
  description: string | null;
  imageUrl: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};


export function mapDatabaseRow<T>(row: RowDataPacket): T {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter: string) =>
      letter.toUpperCase()
    );

    let mappedValue = value;

    if (
      ["published", "featured", "is_read"].includes(key) &&
      value !== null
    ) {
      mappedValue = Boolean(value);
    }

if (
  ["created_at", "updated_at", "published_at"].includes(key) &&
  value !== null &&
  value !== undefined
) {
  const timestamp =
    typeof value === "number"
      ? value
      : typeof value === "string" && /^\d+$/.test(value)
        ? Number(value)
        : NaN;

  if (Number.isFinite(timestamp) && timestamp > 0) {
    const timestampText = String(Math.trunc(timestamp));

      if (key === "published_at" && /^\d{14}$/.test(timestampText)) {
        // Menangani data lama berformat YYYYMMDDHHmmss.
        const year = Number(timestampText.slice(0, 4));
        const month = Number(timestampText.slice(4, 6));
        const day = Number(timestampText.slice(6, 8));
        const hour = Number(timestampText.slice(8, 10));
        const minute = Number(timestampText.slice(10, 12));
        const second = Number(timestampText.slice(12, 14));

        const date = new Date(
          Date.UTC(year, month - 1, day, hour, minute, second),
        );

        const valid =
          date.getUTCFullYear() === year &&
          date.getUTCMonth() === month - 1 &&
          date.getUTCDate() === day &&
          date.getUTCHours() === hour &&
          date.getUTCMinutes() === minute &&
          date.getUTCSeconds() === second;

        mappedValue = valid ? date : null;
      } else {
        const date = new Date(
          timestamp < 100_000_000_000
            ? timestamp * 1000
            : timestamp,
        );

        mappedValue = Number.isNaN(date.getTime()) ? null : date;
      }
    } else if (key === "published_at") {
      mappedValue = null;
    }
  }

    result[camelKey] = mappedValue;
  }

  return result as T;
}

async function queryRows<T>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const [rows] = await db.execute<RowDataPacket[]>(sql, params);
  return rows.map((row) => mapDatabaseRow<T>(row));
}

export async function getSettings(): Promise<Settings> {
  const rows = await queryRows<Settings>(
    "SELECT * FROM site_settings WHERE id = ? LIMIT 1",
    [1]
  );

  const row = rows[0];

  if (!row) return fallbackSettings;

  if (!(row.updatedAt instanceof Date)) {
    row.updatedAt = new Date(row.updatedAt);
  }

  return row;
}

export async function getStats(): Promise<Stat[]> {
  return queryRows<Stat>(
    "SELECT * FROM stats ORDER BY sort_order ASC, id ASC"
  );
}

export async function getServiceBySlug(
  slug: string
): Promise<Service | undefined> {
  const rows = await queryRows<Service>(
    "SELECT * FROM programs WHERE slug = ? AND published = 1 LIMIT 1",
    [slug]
  );

  return rows[0] ?? undefined;
}


export async function getServices(): Promise<Service[]> {
  return queryRows<Service>(
    "SELECT * FROM programs WHERE published = 1 ORDER BY sort_order ASC, id ASC"
  );
}

export async function getProjects(): Promise<Project[]> {
  return queryRows<Project>(
    "SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC, id ASC"
  );
}

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  const safeLimit = Math.max(0, Math.floor(limit));

  if (safeLimit === 0) return [];

  const featured = await queryRows<Project>(
    "SELECT * FROM projects WHERE published = 1 AND featured = 1 ORDER BY sort_order ASC, id ASC LIMIT ?",
    [safeLimit]
  );

  if (featured.length >= safeLimit) return featured;

  const others = await queryRows<Project>(
    "SELECT * FROM projects WHERE published = 1 AND featured = 0 ORDER BY sort_order ASC, id ASC LIMIT ?",
    [safeLimit - featured.length]
  );

  return [...featured, ...others];
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const rows = await queryRows<Project>(
    "SELECT * FROM projects WHERE slug = ? AND published = 1 LIMIT 1",
    [slug]
  );

  return rows[0] ?? undefined;
}

export async function getTeam(): Promise<TeamMember[]> {
  return queryRows<TeamMember>(
    "SELECT * FROM team_members WHERE published = 1 ORDER BY sort_order ASC, id ASC"
  );
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return queryRows<Testimonial>(
    "SELECT * FROM testimonials WHERE published = 1 ORDER BY sort_order ASC, id ASC"
  );
}


export async function getPartners(): Promise<Partner[]> {
  return queryRows<Partner>(
    `SELECT *
     FROM partners
     WHERE published = 1
     ORDER BY sort_order ASC, id ASC`,
  );
}



export async function getPartnerMembers(
  partnerId: number,
): Promise<PartnerMember[]> {
  return queryRows<PartnerMember>(
    `SELECT *
     FROM partner_members
     WHERE partner_id = ? AND published = 1
     ORDER BY sort_order ASC, id ASC`,
    [partnerId],
  );
}

export async function getPartnerDocumentations(
  partnerId: number,
): Promise<PartnerDocumentation[]> {
  return queryRows<PartnerDocumentation>(
    `SELECT *
     FROM partner_documentations
     WHERE partner_id = ? AND published = 1
     ORDER BY sort_order ASC, id ASC`,
    [partnerId],
  );
}


export async function getPosts(limit?: number): Promise<Post[]> {
  const sql =
    "SELECT * FROM posts WHERE published = 1 AND published_at IS NOT NULL AND published_at <= ? ORDER BY published_at DESC, id DESC";

  const now = Math.floor(Date.now() / 1000);

  if (limit !== undefined) {
    const safeLimit = Math.max(0, Math.floor(limit));
    return queryRows<Post>(`${sql} LIMIT ?`, [now, safeLimit]);
  }

  return queryRows<Post>(sql, [now]);
}

export async function getPostBySlug(
  slug: string
): Promise<Post | undefined> {
  const now = Math.floor(Date.now() / 1000);

  const rows = await queryRows<Post>(
    "SELECT * FROM posts WHERE slug = ? AND published = 1 AND published_at IS NOT NULL AND published_at <= ? LIMIT 1",
    [slug, now]
  );

  return rows[0] ?? undefined;
}

export async function getProgramActivities(
  programId: number,
): Promise<ProgramActivity[]> {
  return queryRows<ProgramActivity>(
    `SELECT *
     FROM program_activities
     WHERE program_id = ? AND published = 1
     ORDER BY sort_order ASC, id ASC`,
    [programId],
  );
}

export async function getRegistrationBatches(): Promise<
  RegistrationBatch[]
> {
  return queryRows<RegistrationBatch>(
    `SELECT *
     FROM registration_batches
     WHERE published = 1
     ORDER BY sort_order ASC, id ASC`,
  );
}


export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  return queryRows<GalleryAlbum>(
    `SELECT *
     FROM gallery_albums
     WHERE published = 1
     ORDER BY sort_order ASC, id ASC`,
  );
}

export async function getGalleryAlbumBySlug(
  slug: string,
): Promise<GalleryAlbum | undefined> {
  const rows = await queryRows<GalleryAlbum>(
    `SELECT *
     FROM gallery_albums
     WHERE slug = ? AND published = 1
     LIMIT 1`,
    [slug],
  );

  return rows[0] ?? undefined;
}

export async function getGalleryPhotos(
  albumId: number,
): Promise<GalleryPhoto[]> {
  return queryRows<GalleryPhoto>(
    `SELECT *
     FROM gallery_photos
     WHERE album_id = ? AND published = 1
     ORDER BY sort_order ASC, id ASC`,
    [albumId],
  );
}
