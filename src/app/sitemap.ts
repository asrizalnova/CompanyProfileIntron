import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/data";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const pages = ["", "/program", "/mitra", "/tentang", "/blog", "/kontak"].map((p) => ({
    url: `${base}${p}`,
  }));
  return [
    ...pages,
    ...projects.map((p) => ({ url: `${base}/mitra/${p.slug}`, lastModified: p.updatedAt })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
