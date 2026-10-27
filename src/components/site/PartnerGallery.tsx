"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";

type Photo = {
  id: string | number;
  imageUrl: string | null;
  title: string;
  description?: string | null;
};

export function PartnerGallery({ photos }: { photos: Photo[] }) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => setCurrentIndex(null), []);

  useEffect(() => {
    if (currentIndex === null) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [currentIndex, handleClose]);

  if (photos.length === 0) return null;

  const Lightbox = () => {
    if (currentIndex === null) return null;
    return (
      <div
        className="fixed inset-0 z-[9999] flex flex-col bg-black/60 backdrop-blur-md transition-all duration-300"
        onClick={handleClose}
      >
        <div className="flex shrink-0 items-center justify-between px-6 py-6 text-white/70">
          <span className="text-sm font-medium tracking-widest">
            {currentIndex + 1} of {photos.length}
          </span>
          <button
            onClick={handleClose}
            className="group flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/10"
            aria-label="Tutup"
          >
            <svg
              className="h-7 w-7 text-white/70 transition-transform duration-300 group-hover:rotate-90 group-hover:text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 md:p-12">
          <div
            className="relative flex max-h-full max-w-full items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {photos[currentIndex].imageUrl && (
              <img
                src={photos[currentIndex].imageUrl}
                alt={photos[currentIndex].title}
                className="max-h-[85vh] w-auto max-w-[90vw] object-contain"
              />
            )}
          </div>
        </div>

        <div
          className="shrink-0 px-6 pb-10 pt-4 text-center text-white/90"
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="text-xl font-bold">{photos[currentIndex].title}</h4>
          {photos[currentIndex].description && (
            <p className="mx-auto mt-2 max-w-2xl text-sm text-white/60">
              {photos[currentIndex].description}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      <DragLoopGallery photos={photos} onPhotoClick={setCurrentIndex} />
      {mounted && currentIndex !== null && createPortal(<Lightbox />, document.body)}
    </div>
  );
}

function DragLoopGallery({
  photos,
  onPhotoClick,
}: {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragState = useRef({
    startX: 0,
    offset: 0, // offset posisi track saat drag mulai (px, negatif = geser kiri)
    moved: false,
    pointerId: -1,
    active: false,
  });

  // offset sekarang di state supaya React re-render
  const [offset, setOffset] = useState(0);
  const offsetRef = useRef(0);

  // Duplikasi 3x
  const REPEAT = 3;
  const looped = useMemo(() => {
    const out: { photo: Photo; realIndex: number; key: string }[] = [];
    for (let r = 0; r < REPEAT; r++) {
      photos.forEach((p, i) => {
        out.push({ photo: p, realIndex: i, key: `${p.id}-${r}-${i}` });
      });
    }
    return out;
  }, [photos]);

  // Lebar 1 set (tanpa duplikasi) dihitung dari track
  const getSetWidth = () => {
    const el = trackRef.current;
    if (!el) return 0;
    return el.scrollWidth / REPEAT;
  };

  // Set posisi awal di tengah (set ke-2)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const setWidth = getSetWidth();
      if (setWidth > 0) {
        const init = -setWidth;
        offsetRef.current = init;
        setOffset(init);
      }
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  // Wrap offset supaya infinite
  const wrapOffset = (val: number, setWidth: number) => {
    if (setWidth <= 0) return val;
    let v = val;
    // Kalau geser terlalu ke kiri (lewat 2 set), majukan 1 set
    while (v <= -setWidth * 2) v += setWidth;
    // Kalau geser terlalu ke kanan (lewat 1 set), mundurkan 1 set
    while (v > 0) v -= setWidth;
    return v;
  };

  const applyOffset = (val: number) => {
    const setWidth = getSetWidth();
    const wrapped = wrapOffset(val, setWidth);
    offsetRef.current = wrapped;
    setOffset(wrapped);
  };

  // === DRAG pakai pointer events ===
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragState.current = {
      startX: e.clientX,
      offset: offsetRef.current,
      moved: false,
      pointerId: e.pointerId,
      active: true,
    };
    // jangan set isDragging=true di sini (biar klik tetap jalan)
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragState.current.active) return;
      if (e.pointerId !== dragState.current.pointerId) return;

      const dx = e.clientX - dragState.current.startX;
      if (Math.abs(dx) > 4) {
        if (!dragState.current.moved) {
          dragState.current.moved = true;
          setIsDragging(true);
        }
      }
      if (dragState.current.moved) {
        applyOffset(dragState.current.offset + dx);
      }
    };

    const onUp = (e: PointerEvent) => {
      if (!dragState.current.active) return;
      if (e.pointerId !== dragState.current.pointerId) return;
      dragState.current.active = false;
      setIsDragging(false);
      setTimeout(() => {
        dragState.current.moved = false;
      }, 0);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wheel horizontal (trackpad)
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      applyOffset(offsetRef.current - e.deltaX);
    }
  };

  const handleClick = (realIndex: number) => {
    if (dragState.current.moved) {
      dragState.current.moved = false;
      return;
    }
    onPhotoClick(realIndex);
  };

  return (
    <div
      ref={scrollerRef}
      className="relative w-full overflow-hidden select-none"
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none", // penting: biar touch drag horizontal bisa
      }}
      onPointerDown={onPointerDown}
      onWheel={onWheel}
    >
      <div
        ref={trackRef}
        className="flex gap-3 will-change-transform"
        style={{
          transform: `translate3d(${offset}px, 0, 0)`,
        }}
      >
        {looped.map(({ photo, realIndex, key }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleClick(realIndex)}
            draggable={false}
            className="group relative aspect-square w-32 shrink-0 overflow-hidden rounded-xl border border-line bg-mist focus:outline-none focus:ring-2 focus:ring-batik focus:ring-offset-2 sm:w-40 md:w-48 lg:w-56"
          >
            {photo.imageUrl && (
              <img
                src={photo.imageUrl}
                alt={photo.title}
                loading="lazy"
                draggable={false}
                className="pointer-events-none h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="rounded-full bg-white/20 p-2 text-white backdrop-blur-md">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}