import type { Metadata } from "next";import Image from "next/image";
import Link from "next/link";
import { Lattice } from "@/components/site/Kawung";
import { getSettings } from "@/lib/data";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Masuk | Panel admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const settings = await getSettings();

  return (
    <div className="on-dark relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-batik px-5 py-12">
      <Lattice
        cols={10}
        rows={8}
        cell={110}
        accentEvery={10}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-white/15"
      />

      <main className="w-full max-w-md bg-paper p-8 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] md:p-10">
        {/* Logo besar dan berada tepat di tengah */}
        <div className="flex w-full items-center justify-center">
          <Image
            src="/logo.png"
            alt="Logo perusahaan"
            width={600}
            height={600}
            priority
            quality={100}
            unoptimized
            className="h-auto w-64 max-w-full object-contain md:w-72"
            style={{
              imageRendering: "auto",
            }}
          />
        </div>

        <h1 className="mt-8 text-center text-3xl font-semibold">
          Masuk ke panel admin
        </h1>

        <p className="mt-2 text-center text-muted">
          Gunakan akun admin untuk mengelola isi situs.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>

        <p className="mt-8 text-center text-sm">
          <Link
            href="/"
            className="text-batik-soft underline underline-offset-4"
          >
            Kembali ke situs
          </Link>
        </p>
      </main>
    </div>
  );
}