"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Animasi pesawat melesat lurus dari kiri ke kanan
const planeVariants: Variants = {
  initial: { x: "-150vw", y: "0vh", opacity: 0 },
  animate: { 
    x: "150vw", 
    y: "0vh", 
    opacity: [0, 1, 1, 0], 
    transition: { 
      duration: 1, 
      ease: [0.45, 0, 0.55, 1], 
    } 
  },
};

// Garis angin (speed line) horizontal
const speedLineVariants: Variants = {
  initial: { scaleX: 0, originX: 0, opacity: 0 },
  animate: { 
    scaleX: [0, 1, 1, 0], 
    originX: [0, 0, 1, 1],
    opacity: [0, 1, 1, 0],
    transition: { duration: 1, ease: "easeInOut" } 
  },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="relative min-h-screen w-full bg-paper overflow-hidden">
      
      {/* ===== EFEK PESAWAT ===== */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="airplane-effect"
            className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden flex items-center"
          >
            {/* Speed Line horizontal di belakang pesawat */}
            <motion.div
              variants={speedLineVariants}
              initial="initial"
              animate="animate"
              className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#00AEEF] to-transparent"
            />
            
            {/* Ikon Pesawat - Ukuran Full Screen */}
            <motion.div
              variants={planeVariants}
              initial="initial"
              animate="animate"
              className="absolute flex items-center justify-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                // PERBAIKAN: Ubah -rotate-90 menjadi rotate-90 agar hidung pesawat menghadap KANAN
                className="h-[150vh] w-[150vw] md:h-[100vh] md:w-[100vw] text-[#1A1A1A] opacity-90 rotate-90"
              >
                <path d="M21.5 15.5v-2l-8.5-5V4.5c0-1.1-.9-2-2-2s-2 .9-2 2v4L.5 13.5v2l8.5-2.5V17l-2.5 2.5v1.5l4-1.5 4 1.5v-1.5L12 17v-4l9.5 2.5z" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== KONTEN HALAMAN ===== */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isTransitioning ? 0.2 : 1, 
        }}
        transition={{ duration: 0.4 }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}