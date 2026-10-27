"use client";

import { useState } from "react";

const dataPersyaratan = [
  {
    title: "Overview",
    content: "Program Tokutei Ginou (SSW) adalah program kerja resmi di Jepang dengan kontrak hingga 5 tahun. Anda akan mendapatkan gaji setara pekerja tetap, hak cuti, tunjangan, dan kesempatan untuk membawa keluarga.",
  },
  {
    title: "Persyaratan Umum",
    content: "Usia minimal 18 tahun, sehat jasmani dan rohani, belum pernah mengikuti program magang/Tokutei Ginou di Jepang, dan memiliki kemauan kuat untuk belajar bahasa dan budaya Jepang.",
  },
  {
    title: "Persyaratan Administrasi",
    content: "Fotokopi KTP, Kartu Keluarga (KK), Akta Kelahiran, Ijazah pendidikan terakhir, Paspor (jika sudah ada), dan Surat Keterangan Catatan Kepolisian (SKCK).",
  },
  {
    title: "Persyaratan Kesehatan",
    content: "Mampu bekerja dalam kondisi fisik yang baik, tidak memiliki penyakit menular, dan bersedia mengikuti tes kesehatan (medical check-up) sebelum keberangkatan.",
  },
];

export function AccordionPersyaratan() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col w-full">
      {dataPersyaratan.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border-b border-white/10 last:border-b-0 py-2"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-start gap-4 py-4 text-left group transition-colors"
            >
              {/* Ikon Plus / Minus */}
              <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                <svg
                  className={`w-4 h-4 transition-all duration-300 ${
                    isOpen ? "rotate-45 text-[#39B54A]" : "rotate-0 text-white"
                  } group-hover:text-[#00AEEF]`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              
              <span className={`text-lg font-semibold tracking-wide transition-colors group-hover:text-[#00AEEF] ${isOpen ? "text-[#00AEEF]" : "text-white"}`}>
                {item.title}
              </span>
            </button>

            {/* Konten Accordion */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100 mb-4" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-white/70 text-sm leading-relaxed pl-10 pr-4">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}