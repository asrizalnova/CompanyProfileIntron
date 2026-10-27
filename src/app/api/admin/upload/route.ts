// vercel
import { randomBytes } from "node:crypto";
import path from "node:path";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob"; // <-- Import Vercel Blob
import { getCurrentAdmin } from "@/lib/auth";
import {
  MAX_UPLOAD_BYTES,
  detectImageExt,
} from "@/lib/uploads";

// local
// import { randomBytes } from "node:crypto";

// import fs from "node:fs/promises";

// import path from "node:path";

// import { NextResponse } from "next/server";

// import { getCurrentAdmin } from "@/lib/auth";

// import {

//   MAX_UPLOAD_BYTES,

//   detectImageExt,

//   uploadDir,

// } from "@/lib/uploads";

export const runtime = "nodejs";

const MAX_PDF_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await getCurrentAdmin())) {
    return NextResponse.json(
      { error: "Sesi berakhir. Silakan masuk lagi." },
      { status: 401 }
    );
  }

  let form: FormData;

  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Permintaan tidak valid." },
      { status: 400 }
    );
  }

  const file = form.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Pilih file terlebih dahulu." },
      { status: 400 }
    );
  }

  const isPdf = path.extname(file.name).toLowerCase() === ".pdf";
  const maxBytes = isPdf ? MAX_PDF_BYTES : MAX_UPLOAD_BYTES;

  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: isPdf
          ? "Ukuran PDF maksimal 10 MB."
          : "Ukuran gambar maksimal 5 MB.",
      },
      { status: 413 }
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  let ext: string | null;

  if (isPdf) {
    const signature = new TextDecoder().decode(bytes.subarray(0, 5));

    if (signature !== "%PDF-") {
      return NextResponse.json(
        { error: "Format PDF tidak valid." },
        { status: 415 }
      );
    }

    ext = "pdf";
  } else {
    ext = detectImageExt(bytes);

    if (!ext) {
      return NextResponse.json(
        { error: "Format harus PNG, JPG, WebP, GIF, atau PDF." },
        { status: 415 }
      );
    }
  }

  // Buat nama file yang unik
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
  const filename = `uploads/${name}`;

  try {
    // Unggah file langsung ke Vercel Blob (menggantikan fs.writeFile lokal)
    const blob = await put(filename, file, {
      access: "public",
    });

    // Mengembalikan URL publik dari Vercel Blob untuk disimpan ke database
    return NextResponse.json({
      url: blob.url,
    });
  } catch (error) {
    console.error("Vercel Blob upload error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file ke penyimpanan." },
      { status: 500 }
    );
  }
}
