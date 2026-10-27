import Image from "next/image";
import { hashString } from "@/lib/utils";

/**
 * Motif kawung: empat kelopak elips yang bertemu di satu titik.
 * Ujung kelopak bunga yang bersebelahan bertemu di batas sel, sehingga membentuk kisi.
 */
function Flower({ cx, cy, r, fillVertical }: { cx: number; cy: number; r: number; fillVertical?: boolean }) {
  const a = r / 2; // setengah panjang kelopak
  const b = r * 0.3; // setengah lebar kelopak
  const vertical = fillVertical ? { fill: "var(--color-kunyit)", stroke: "var(--color-kunyit)" } : {};
  return (
    <>
      <ellipse cx={cx} cy={cy - a} rx={b} ry={a} {...vertical} />
      <ellipse cx={cx} cy={cy + a} rx={b} ry={a} {...vertical} />
      <ellipse cx={cx - a} cy={cy} rx={a} ry={b} />
      <ellipse cx={cx + a} cy={cy} rx={a} ry={b} />
    </>
  );
}

type LatticeProps = {
  cols: number;
  rows: number;
  cell: number;
  className?: string;
  /** Satu dari setiap N bunga diberi isian kunyit. 0 = tanpa aksen. */
  accentEvery?: number;
  /** Geser pola aksen agar tiap penggunaan tampak berbeda. */
  seed?: number;
  /** Munculkan bunga satu per satu saat halaman dimuat. */
  animate?: boolean;
  strokeWidth?: number;
};

export function Lattice({
  cols,
  rows,
  cell,
  className,
  accentEvery = 0,
  seed = 0,
  animate = false,
  strokeWidth = 1.25,
}: LatticeProps) {
  const r = cell / 2;
  const flowers = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const accent = accentEvery > 0 && (i * 5 + j * 3 + seed) % accentEvery === 0;
      flowers.push(
        <g
          key={`${i}-${j}`}
          className={animate ? "petal" : undefined}
          style={animate ? ({ "--d": `${(i + j) * 80}ms` } as React.CSSProperties) : undefined}
        >
          <Flower cx={i * cell + r} cy={j * cell + r} r={r} fillVertical={accent} />
        </g>,
      );
    }
  }
  return (
    <svg
      viewBox={`0 0 ${cols * cell} ${rows * cell}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
    >
      {flowers}
    </svg>
  );
}

const COVER_TONES = [
  "bg-batik text-white/25",
  "bg-batik-soft text-white/25",
  "bg-ink text-white/20",
  "bg-batik-wash text-white/30",
];

/** Sampul pengganti saat proyek atau artikel belum punya gambar. */
export function PatternCover({ seed, className }: { seed: string; className?: string }) {
  const h = hashString(seed);
  const tone = COVER_TONES[h % COVER_TONES.length];
  return (
    <div className={`relative overflow-hidden ${tone} ${className ?? ""}`}>
      <Lattice cols={4} rows={3} cell={80} accentEvery={7} seed={h % 7} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

/** Tanda merek kecil: satu bunga kawung. */
// export function LogoMark({ className }: { className?: string }) {
//   return (
//     <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
//       <g fill="none" stroke="currentColor" strokeWidth="2">
//         <ellipse cx="20" cy="10" rx="6" ry="10" fill="var(--color-kunyit)" stroke="var(--color-kunyit)" />
//         <ellipse cx="20" cy="30" rx="6" ry="10" fill="var(--color-kunyit)" stroke="var(--color-kunyit)" />
//         <ellipse cx="10" cy="20" rx="10" ry="6" />
//         <ellipse cx="30" cy="20" rx="10" ry="6" />
//       </g>
//     </svg>
//   );
// }

/** Tanda merek berupa gambar logo perusahaan. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Logo perusahaan"
      width={40}
      height={40}
      className={className}
    />
  );
}

