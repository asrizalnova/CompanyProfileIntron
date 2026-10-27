import type { Metadata } from "next";
import Link from "next/link";
import { Cover } from "@/components/site/Media";
import { Container, Reveal, SectionTitle } from "@/components/site/ui";
import { getPosts, getSettings } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { SiteHero } from "@/components/site/SiteHero";

export const metadata: Metadata = {
  title: "Blog",
  description: "Catatan tentang pengembangan sistem, data, dan operasional dari tim kami.",
};

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([
    getPosts(),
    getSettings(),
  ]);

  return (
    <>
      <SiteHero
        title="Artikel"
        subtitle="Catatan dan hal hal yang ditulis dan ingin dibagikan oleh tim kami."
        imageUrl={settings.heroImageUrl}
      />

      <section className="relative bg-paper py-20 md:py-28">
        <Container>
          <Reveal animation="up">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <SectionTitle
                align="center"
                intro="Wawasan, tutorial, dan cerita di balik layar dari tim Intron Global Akademi."
              >
                Catatan Terbaru
              </SectionTitle>
            </div>
          </Reveal>

          {posts.length === 0 ? (
            <Reveal animation="up">
              <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-line bg-white p-12 text-center">
                <p className="text-muted">
                  Belum ada artikel yang terbit.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, index) => (
                <Reveal key={p.id} animation="up" delay={index * 100}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-500 hover:-translate-y-2 hover:border-batik/30 hover:shadow-2xl hover:shadow-batik/10"
                  >
                    {/* Gambar Cover / Placeholder */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-mist">
                      {p.coverUrl ? (
                        <>
                          <Cover
                            src={p.coverUrl}
                            alt={p.title}
                            seed={p.slug}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </>
                      ) : (
                        // Placeholder jika tidak ada cover
                        <div className="flex h-full w-full flex-col items-center justify-center bg-mist text-muted">
                          <svg className="h-10 w-10 mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium">Pratinjau tidak tersedia</span>
                        </div>
                      )}
                    </div>

                    {/* Konten Artikel */}
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-batik-wash mb-4">
                        <time dateTime={p.publishedAt?.toISOString()}>
                          {formatDate(p.publishedAt)}
                        </time>
                        {p.author && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-line" />
                            <span>{p.author}</span>
                          </>
                        )}
                      </div>

                      <h2 className="text-xl font-bold leading-snug text-ink transition-colors group-hover:text-batik-soft md:text-2xl mb-3 line-clamp-2">
                        {p.title}
                      </h2>

                      {p.excerpt && (
                        <p className="flex-1 text-sm leading-relaxed text-muted line-clamp-3 mb-6">
                          {p.excerpt}
                        </p>
                      )}

                      <div className="mt-auto pt-4 border-t border-line/50 flex items-center justify-between">
                        <span className="text-sm font-bold text-batik-soft uppercase tracking-wider group-hover:text-batik transition-colors">
                          Baca Artikel
                        </span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mist text-batik group-hover:bg-kunyit group-hover:text-ink transition-colors">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}