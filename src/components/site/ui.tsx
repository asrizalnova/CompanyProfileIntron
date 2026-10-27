"use client";

import Link from "next/link";
import { Lattice } from "./Kawung";
import React, { useRef, useEffect, useState, ReactNode } from "react";

// ==========================================
// 1. CONTAINER
// ==========================================
export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 md:px-10 lg:px-16 ${className}`}>{children}</div>;
}

// ==========================================
// 2. SCROLL REVEAL WRAPPER (Universal)
// ==========================================
type RevealProps = {
  children: ReactNode;
  animation?: "up" | "left" | "right" | "zoom";
  delay?: number;
  className?: string;
};

export function Reveal({ children, animation = "up", delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const animClass = {
    up: "slide-up",
    left: "slide-from-left",
    right: "slide-from-right",
    zoom: "zoom-in",
  }[animation];

  return (
    <div ref={ref} className={`${animClass} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ==========================================
// 3. BUTTON LINK (Lebih Premium & Modern)
// ==========================================
type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "outline-light" | "kunyit" | "batik";
  className?: string;
  /** Tampilkan panah di kanan tombol (default: true) */
  showArrow?: boolean;
  /** Bentuk sudut tombol (default: "lg"). Gunakan "full" untuk pill */
  rounded?: "sm" | "md" | "lg" | "full" | "none";
};

const buttonStyles = {
  primary: "bg-gradient-to-r from-batik-soft to-ok text-white shadow-lg shadow-ok/30 hover:shadow-ok/50 hover:from-batik hover:to-ok/90",
  secondary: "bg-ok text-white shadow-lg shadow-ok/20 hover:bg-ok/90",
  batik: "bg-batik text-white hover:bg-batik-soft shadow-lg shadow-batik/20",
  kunyit: "bg-kunyit text-ink hover:bg-kunyit-soft shadow-lg shadow-kunyit/20",
  "outline-light": "border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm",
  outline: "border-2 border-batik text-batik hover:bg-batik hover:text-white",
};

const roundedStyles = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  showArrow = true,
  rounded = "lg",
}: ButtonProps) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const cls = `group relative inline-flex min-h-[3.5rem] items-center justify-center ${roundedStyles[rounded]} px-8 text-base font-bold transition-all duration-300 hover:-translate-y-1 ${buttonStyles[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <svg
          className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      )}
    </>
  );

  return external ? (
    <a
      href={href}
      className={cls}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {content}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

// ==========================================
// 4. TEXT LINK
// ==========================================
export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center font-bold text-[#00AEEF] transition-colors hover:text-[#E31E24]">
      <span className="border-b-2 border-transparent transition-colors group-hover:border-[#E31E24] pb-0.5">{children}</span>
      <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// ==========================================
// 5. SECTION TITLE
// ==========================================
export function SectionTitle({
  children,
  intro,
  className = "",
  align = "left",
}: {
  children: React.ReactNode;
  intro?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center flex flex-col items-center" : ""} ${className}`}>
      <Reveal animation="up">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A] shadow-sm">
          {/* Garis warna logo */}
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E31E24]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#00AEEF]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#39B54A]" />
          </span>
          LPK Intron Global Academy
        </div>
      </Reveal>
      
      <Reveal animation="up" delay={100}>
        <h2 className="mt-6 max-w-[22ch] text-4xl font-extrabold tracking-tight text-[#1A1A1A] md:text-5xl lg:text-6xl">
          {children}
        </h2>
      </Reveal>
      
      {intro && (
        <Reveal animation="up" delay={200}>
          <p className={`mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed ${align === "center" ? "mx-auto" : ""}`}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}

// ==========================================
// 6. PAGE HEADER
// ==========================================
export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="relative overflow-hidden bg-[#0f0f0f] text-white">
      {/* Orbs Halus: Biru & Merah */}
      <div 
        className="absolute -left-20 top-0 h-[600px] w-[600px] rounded-full bg-[#00AEEF]/10 blur-[150px]"
        style={{ transform: `translateY(${offsetY * 0.2}px)` }}
      />
      <div 
        className="absolute -bottom-20 right-0 h-[500px] w-[500px] rounded-full bg-[#E31E24]/10 blur-[150px]"
        style={{ transform: `translateY(${offsetY * -0.15}px)` }}
      />
      
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

      <Container className="relative z-10 py-24 md:py-32 lg:py-40">
        <div className="max-w-4xl">
          <Reveal animation="up">
            <div className="mb-8 flex items-center gap-2">
              <div className="h-1.5 w-12 bg-[#00AEEF] rounded-full" />
              <div className="h-1.5 w-6 bg-[#39B54A] rounded-full" />
              <div className="h-1.5 w-3 bg-[#E31E24] rounded-full" />
            </div>
            <h1 className="text-5xl font-extrabold tracking-tighter md:text-7xl lg:text-8xl text-white">
              {title}
            </h1>
          </Reveal>
          
          {intro && (
            <Reveal animation="up" delay={200}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl border-l-[3px] border-[#E31E24] pl-6">
                {intro}
              </p>
            </Reveal>
          )}
          
          {children && (
            <Reveal animation="up" delay={400}>
              <div className="mt-12 flex flex-wrap gap-4">{children}</div>
            </Reveal>
          )}
        </div>
      </Container>
    </header>
  );
}

// ==========================================
// 7. FEATURE CARD
// ==========================================
export function FeatureCard({ 
  icon, 
  title, 
  description, 
  delay = 0,
  className = "" 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay?: number;
  className?: string;
}) {
  return (
    <Reveal animation="up" delay={delay} className={className}>
      <div className="group relative h-full overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 transition-all duration-500 hover:border-[#00AEEF]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,174,239,0.15)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00AEEF] via-[#39B54A] to-[#E31E24] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className="relative z-10">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-[#1A1A1A] transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-[#00AEEF] group-hover:to-[#39B54A] group-hover:text-white group-hover:scale-110 group-hover:shadow-lg">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{title}</h3>
          <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
        </div>
      </div>
    </Reveal>
  );
}