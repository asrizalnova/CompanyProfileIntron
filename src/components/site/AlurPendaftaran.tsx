"use client";

import { useState } from "react";

// 1. Interface agar TypeScript tidak error
interface ItemAlur {
  title: string;
  desc: string;
  silabus?: string[];
}

interface FaseAlur {
  fase: string;
  items: ItemAlur[];
}

// Data Alur Pendaftaran
const alurData: FaseAlur[] = [
  {
    fase: "Pra Pelatihan",
    items: [
      { title: "Proses Pendaftaran", desc: "Proses ini dapat dilakukan dengan mengisi formulir pendaftaran sekaligus mengirimkan berkas lamaran dengan klik tombol dibawah ini" },
      { title: "Seleksi Administrasi", desc: "Proses seleksi akan dilakukan dalam jangka waktu kurang lebih 14 hari kerja. Para pendaftar akan mendapatkan informasi lebih lanjut via Whatsapp." },
      { title: "Test Psikotes", desc: "Test Psikotest meliputi tes logika penalaran, kemampuan verbal, karakter, dan lainnya. Jadwal test akan diumumkan lebih lanjut oleh admin via Whatsapp." },
    ],
  },
  {
    fase: "Fase Pelatihan",
    items: [
      {
        title: "Pendidikan Bahasa Jepang",
        desc: "Proses pendidikan ini akan dilakukan selama 3-4 bulan secara intensif setiap hari. Berikut adalah silabus pembelajaran kami:",
        silabus: [
          "Pertemuan 1-5 : perkenalan Hiragana Katakana",
          "Pertemuan 6-27 : Pembelajaran Buku Pemula",
          "Pertemuan 28-49 : Pembelajaran Bahasa Tingkat dasar 1",
          "Pertemuan 50-71 : Pembelajaran Bahasa Tingkat dasar 2",
          "Pertemuan 72-76 : Persiapan Ujian Sertifikasi Bahasa"
        ]
      },
      { 
        title: "Lulus Sertifikasi Bahasa dan Skill", 
        desc: "Para peserta diwajibkan mengikuti ujian sertifikasi bahasa & skill sebelum memasuki tahapan berikutnya.",
        silabus: [
          "Sertifikasi bahasa JFT A2 Atau JLPT N4",
          "Sertifikasi Tokutei Ginou (SSW)"
        ]
      },
    ],
  },
  {
    fase: "Pra Penempatan",
    items: [
      { title: "Interview User", desc: "Interview akan dilakukan langsung bersama para user di company Jepang via Zoom / Google meet selama 90 menit." },
      { title: "Pengurusan Administrasi Dokumen", desc: "Para peserta akan dibantu LPK Intron Global Academy dalam pengurusan dokumen seperti Pra Kerja, MCU, Paspor, Dokumen keberangkatan (Persiapan, COE, E-KTLN, Visa)" },
    ],
  },
];

export function AlurPendaftaran() {
  // State untuk menyimpan item mana yang sedang terbuka
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (faseIndex: number, itemIndex: number) => {
    const key = `${faseIndex}-${itemIndex}`;
    setOpenItem(openItem === key ? null : key);
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
      {alurData.map((fase, fIndex) => (
        <div key={fIndex} className="flex flex-col gap-4">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-white mb-2">
            {fase.fase}
          </h3>

          {fase.items.map((item, iIndex) => {
            const isOpen = openItem === `${fIndex}-${iIndex}`;

            return (
              <div
                key={iIndex}
                className="group border border-white/20 bg-white/10 backdrop-blur-md rounded-md overflow-hidden transition-all duration-300 hover:bg-white/20"
              >
                <button
                  onClick={() => toggleItem(fIndex, iIndex)}
                  className="w-full flex items-center justify-start gap-4 p-4 text-left cursor-pointer"
                >
                  {/* Ikon Plus yang berputar saat aktif */}
                  <span
                    className={`text-2xl font-light transition-all duration-300 ${
                      isOpen ? "rotate-45 text-[#00AEEF]" : "text-white/70 group-hover:text-white"
                    }`}
                  >
                    +
                  </span>
                  <span className={`font-semibold text-sm tracking-wide transition-colors ${isOpen ? "text-white" : "text-white/90 group-hover:text-white"}`}>
                    {item.title}
                  </span>
                </button>

                {/* Konten Dropdown */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-5 pl-10 text-sm text-white/80 leading-relaxed">
                      {/* Render Deskripsi */}
                      <p className={item.silabus ? "mb-3" : ""}>{item.desc}</p>
                      
                      {/* Render Silabus (jika ada) sebagai List dengan Bullet */}
                      {item.silabus && (
                        <ul className="list-disc pl-4 space-y-1.5 marker:text-white/50">
                          {item.silabus.map((list, idx) => (
                            <li key={idx}>{list}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}