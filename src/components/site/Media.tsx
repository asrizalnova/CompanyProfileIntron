/* eslint-disable @next/next/no-img-element */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PatternCover } from "./Kawung";

/** Gambar biasa. Unggahan dilayani lewat /uploads dan sudah ber-cache panjang. */
export function Img({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={className} />;
}

/** Sampul dengan rasio tetap: gambar bila ada, pola kawung bila tidak. */
export function Cover({
  src,
  alt,
  seed,
  className = "aspect-[4/3]",
}: {
  src?: string;
  alt: string;
  seed: string;
  className?: string;
}) {
  if (src) {
    return (
      <div className={`overflow-hidden bg-mist ${className}`}>
        <Img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }
  return <PatternCover seed={seed} className={className} />;
}

/** Markdown aman: HTML mentah tidak dirender. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={`prose-doc ${className ?? ""}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
