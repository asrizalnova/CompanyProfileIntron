
/* eslint-disable @next/next/no-img-element */

import { Container } from "@/components/site/ui";

type SiteHeroProps = {
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
};

export function SiteHero({
  title,
  subtitle,
  imageUrl,
}: SiteHeroProps) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-batik text-white">
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />
      )}

      {imageUrl && (
        <div className="absolute inset-0 -z-10 bg-ink/65" />
      )}

      <Container className="py-16 md:py-24">
        <h1 className="max-w-3xl text-[2.5rem] font-semibold leading-[1.04] md:text-[4.25rem]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-6 max-w-xl text-lg text-white/80 md:text-xl">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
