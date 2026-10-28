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
            className="relative mb-1 w-[min(290px,calc(100vw-6.5rem))] rounded-2xl border border-line bg-white p-4 pr-9 text-ink shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <button
              type="button"
              onClick={() => setShowMessage(false)}
              aria-label="Tutup pesan WhatsApp"
              title="Tutup"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-mist hover:text-ink"
            >
              <X size={16} />
            </button>

            <p className="text-sm font-bold text-ink">
              Ada yang ingin ditanyakan?
            </p>

            <p className="mt-1 text-sm leading-relaxed text-muted">
              Tertarik dengan program kami atau ingin konsultasi?
              Silakan hubungi kami melalui WhatsApp.
            </p>
          </div>
        )}

        {/* Ikon WhatsApp dengan efek Ring Berdenyut */}
        {whatsappUrl && (
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            {/* Efek Ring Berdenyut (Ping) */}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30"></span>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hubungi kami melalui WhatsApp"
              title="Hubungi kami melalui WhatsApp"
              // Menggunakan gradient hijau agar lebih premium dan animasi hover
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#128C4A] text-white shadow-[0_8px_20px_-6px_rgba(37,211,102,0.6)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_12px_25px_-6px_rgba(37,211,102,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#128C4A] focus-visible:ring-offset-2"
            >
              <FaWhatsapp size={32} className="drop-shadow-sm" />
            </a>
          </div>
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
          // Tombol lebih elegan dengan border tebal, bayangan, dan efek grup hover
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-batik hover:bg-batik hover:text-white hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-batik focus-visible:ring-offset-2"
        >
          <ArrowUp 
            size={20} 
            strokeWidth={2.5} 
            className="transition-transform duration-300 group-hover:-translate-y-0.5" 
          />
        </button>
      )}
    </div>
  );
}