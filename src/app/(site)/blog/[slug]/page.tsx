import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cover, Markdown } from "@/components/site/Media";
import { Container, Reveal, TextLink } from "@/components/site/ui";
import { getPostBySlug, getPosts, getSettings } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { SiteHero } from "@/components/site/SiteHero";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverUrl ? [post.coverUrl] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  
  // Ambil post dan settings secara paralel
  const [post, settings] = await Promise.all([
    getPostBySlug(slug),
    getSettings()
  ]);
  
  if (!post) notFound();

  const more = (await getPosts()).filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <>
      {/* HERO SECTION STANDAR (Sama seperti halaman lain) */}
      <SiteHero
        title={post.title}
        subtitle={`${formatDate(post.publishedAt)}${post.author ? `, oleh ${post.author}` : ""}`}
        imageUrl={post.coverUrl || settings.heroImageUrl}
      />

      {/* KONTEN ARTIKEL */}
      <section className="relative bg-white py-16 md:py-24 overflow-hidden">
        <Container>
          {/* Gambar Cover di dalam konten (Opsional, jika ingin tetap ditampilkan) */}
          {post.coverUrl && (
            <Reveal animation="up">
              <div className="mx-auto max-w-5xl mb-12 md:mb-20">
                <Cover 
                  src={post.coverUrl} 
                  alt={post.title} 
                  seed={post.slug} 
                  className="aspect-[16/9] md:aspect-[21/9] rounded-2xl shadow-2xl shadow-batik/10 border border-line" 
                />
              </div>
            </Reveal>
          )}

          <Reveal animation="up" delay={200}>
            <article className="mx-auto max-w-3xl prose-doc text-lg md:text-xl text-ink/80 leading-relaxed">
              <Markdown>{post.content}</Markdown>
            </article>
          </Reveal>
        </Container>
      </section>

      {/* BACA JUGA */}
      {more.length > 0 && (
        <section className="relative bg-mist py-20 md:py-28 border-t border-line">
          <Container>
            <Reveal animation="up">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl md:text-3xl font-extrabold text-ink">Baca Juga</h2>
                <TextLink href="/blog">Semua Artikel</TextLink>
              </div>
            </Reveal>

            <div className="grid gap-8 md:grid-cols-2">
              {more.map((p, index) => (
                <Reveal key={p.id} animation="up" delay={index * 150}>
                  <Link href={`/blog/${p.slug}`} className="group flex flex-col bg-white rounded-2xl p-6 md:p-8 border border-line transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-batik/30">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-batik-wash mb-3">
                      <time dateTime={p.publishedAt?.toISOString()}>{formatDate(p.publishedAt)}</time>
                    </div>
                    <h3 className="text-xl font-bold text-ink transition-colors group-hover:text-batik-soft mb-2">
                      {p.title}
                    </h3>
                    {p.excerpt && <p className="text-muted text-sm line-clamp-2">{p.excerpt}</p>}
                    <div className="mt-4 pt-4 border-t border-line/50 flex items-center text-sm font-bold text-batik-soft group-hover:text-batik transition-colors">
                      Baca Selengkapnya <span className="ml-2">→</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}