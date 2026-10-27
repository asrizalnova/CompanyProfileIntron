"use client";

import { useEffect, useState } from "react";
import { ArrowUp, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_MESSAGE =
  "Halo Intron Global Academy, saya ingin bertanya dan berkonsultasi mengenai program dan layanan yang tersedia.";

type FloatingActionsProps = {
  whatsappNumber: string;
};

export function FloatingActions({
  whatsappNumber,
}: FloatingActionsProps) {
  const [showMessage, setShowMessage] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Ambil nomor dari pengaturan admin dan hapus karakter nonangka.
  const cleanWhatsappNumber = (whatsappNumber ?? "").replace(/\D/g, "");

  const whatsappUrl = cleanWhatsappNumber
    ? `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
        WHATSAPP_MESSAGE
      )}`
    : null;

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
      {/* Pesan di sebelah kiri ikon WhatsApp */}
      <div className="flex items-end gap-3">
        {showMessage && whatsappUrl && (
          <div
            role="status"
            className="relative mb-1 w-[min(290px,calc(100vw-6.5rem))] rounded-2xl border border-line bg-white p-4 pr-9 text-ink shadow-xl"
          >
            <button
              type="button"
              onClick={() => setShowMessage(false)}
              aria-label="Tutup pesan WhatsApp"
              title="Tutup"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-mist hover:text-ink"
            >
              <X size={16} />
            </button>

            <p className="text-sm font-semibold">
              Ada yang ingin ditanyakan?
            </p>

            <p className="mt-1 text-sm leading-relaxed text-muted">
              Tertarik dengan program kami atau ingin konsultasi?
              Silakan hubungi kami melalui WhatsApp.
            </p>
          </div>
        )}

        {/* Ikon WhatsApp mengikuti nomor dari pengaturan admin */}
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hubungi kami melalui WhatsApp"
            title="Hubungi kami melalui WhatsApp"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:bg-[#1DA851] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#128C4A] focus-visible:ring-offset-2"
          >
            <FaWhatsapp size={32} />
          </a>
        )}
      </div>

      {/* Tombol kembali ke atas */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          aria-label="Kembali ke atas"
          title="Kembali ke atas"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-lg transition hover:-translate-y-1 hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kunyit"
        >
          <ArrowUp size={21} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}