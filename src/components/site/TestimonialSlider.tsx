
"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Testimonial = {
  id: string | number;
  quote: string;
  name: string;
  role?: string | null;
  company?: string | null;
  photoUrl?: string | null;
  rating?: number | null;
};

export function TestimonialSlider({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = testimonials.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused || total <= 1) return;

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total]);

  const goTo = useCallback(
    (i: number) => setIndex((i + total) % total),
    [total],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;

    const delta = e.changedTouches[0].clientX - touchStart.current;

    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        prev();
      } else {
        next();
      }
    }

    touchStart.current = null;
    setIsPaused(false);
  };

  if (total === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="w-full shrink-0 px-2 md:px-4"
            >
              <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors duration-300 hover:bg-white/10 md:p-10">
             <div>
  <svg
    className="mb-6 h-10 w-10 text-kunyit/40"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>

        <div
          className="mb-4 flex items-center gap-1 text-xl"
          aria-label={`Rating ${Math.min(5, Math.max(1, Number(t.rating) || 5))} dari 5 bintang`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={
                i < Math.min(5, Math.max(1, Number(t.rating) || 5))
                  ? "text-kunyit"
                  : "text-white/25"
              }
              aria-hidden="true"
            >
              ★
            </span>
          ))}
        </div>

        <blockquote className="text-lg font-medium leading-relaxed text-white/90 md:text-xl">
          “{t.quote}”
        </blockquote>
      </div>
                <figcaption className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-kunyit/60 bg-white/10">
                    {t.photoUrl ? (
                      <img
                        src={t.photoUrl}
                        alt={`Foto ${t.name}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-batik-soft to-kunyit/30 text-2xl font-bold text-white"
                        aria-label={`Avatar ${t.name}`}
                      >
                        {t.name?.trim().charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    {t.name && (
                      <span className="block text-base font-bold text-white">
                        {t.name}
                      </span>
                    )}

                    {t.role && (
                      <span className="mt-1 block text-sm text-kunyit">
                        {t.role}
                      </span>
                    )}

                    {t.company && (
                      <span className="mt-0.5 block text-sm text-white/60">
                        {t.company}
                      </span>
                    )}
                  </div>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Testimoni sebelumnya"
            className="absolute left-0 top-1/2 flex h-10 w-10 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink text-white transition-colors hover:bg-kunyit hover:text-ink md:-translate-x-6"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Testimoni berikutnya"
            className="absolute right-0 top-1/2 flex h-10 w-10 translate-x-2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink text-white transition-colors hover:bg-kunyit hover:text-ink md:translate-x-6"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="mt-10 flex items-center justify-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Lihat testimoni ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-8 bg-kunyit"
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
