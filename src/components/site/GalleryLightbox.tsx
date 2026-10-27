"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type Photo = {
  id: string | number;
  imageUrl: string;
  title?: string | null;
  description?: string | null;
};

export function GalleryLightbox({ photos, albumTitle }: { photos: Photo[], albumTitle: string }) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === null || prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === null || prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  const handleClose = () => setCurrentIndex(null);

  useEffect(() => {
    if (currentIndex === null) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [currentIndex, handlePrev, handleNext]);

  const Lightbox = () => {
    if (currentIndex === null) return null;
    const currentPhoto = photos[currentIndex];

    return (
      <div className="fixed inset-0 z-[9999] flex flex-col bg-black/60 backdrop-blur-md" onClick={handleClose}>
        <div className="flex items-center justify-between px-6 py-6 text-white/70 shrink-0">
          <span className="text-sm font-medium tracking-widest">
            {currentIndex + 1} of {photos.length}
          </span>
          <button onClick={handleClose} className="group flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/10">
            <svg className="w-7 h-7 text-white/70 transition-transform duration-300 group-hover:rotate-90 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative flex flex-1 items-center justify-center p-4 md:p-12 overflow-hidden">
          {photos.length > 1 && (
            <button onClick={handlePrev} className="absolute left-4 md:left-12 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-black/20 text-white/50 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}

          <div className="relative flex max-h-full max-w-full items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* KUNCI ANIMASI: Menggunakan key={currentPhoto.id} dan class animate-modal-card-in */}
            {currentPhoto.imageUrl && (
              <img 
                key={currentPhoto.id} // React akan me-render ulang gambar ini jika key berubah
                src={currentPhoto.imageUrl} 
                alt={currentPhoto.title || albumTitle} 
                className="max-h-[85vh] w-auto max-w-[90vw] object-contain animate-modal-card-in" 
              />
            )}
          </div>

          {photos.length > 1 && (
            <button onClick={handleNext} className="absolute right-4 md:right-12 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-black/20 text-white/50 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>

        <div className="shrink-0 pb-10 pt-4 text-center text-white/90 px-6" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-xl font-bold">{currentPhoto.title || albumTitle}</h4>
            {currentPhoto.description && (
              <p className="text-sm text-white/60 mt-2 max-w-2xl mx-auto">{currentPhoto.description}</p>
            )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-10">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setCurrentIndex(index)}
            className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-mist focus:outline-none focus:ring-2 focus:ring-batik focus:ring-offset-2 text-left"
          >
            <Image
              src={photo.imageUrl}
              alt={photo.title || albumTitle}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-5 pt-12 pointer-events-none">
              <h3 className="text-base md:text-lg font-bold text-white line-clamp-1 leading-snug">
                {photo.title || "Tanpa Judul"}
              </h3>
              {photo.description && (
                 <p className="text-xs text-white/70 line-clamp-1 mt-0.5">
                   {photo.description}
                 </p>
              )}
            </div>

            <div className="absolute inset-0 bg-ink/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
      {mounted && currentIndex !== null && createPortal(<Lightbox />, document.body)}
    </>
  );
}