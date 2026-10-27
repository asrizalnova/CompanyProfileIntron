
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { uploadDir } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const fileUrl = params.get("file");
  const requestedName = params.get("name") ?? "";

  // Hanya izinkan PDF dari folder uploads.
  if (
    !fileUrl ||
    !fileUrl.startsWith("/uploads/") ||
    fileUrl.includes("?") ||
    fileUrl.includes("#")
  ) {
    return NextResponse.json(
      { error: "Berkas tidak valid." },
      { status: 400 }
    );
  }

  const filename = fileUrl.slice("/uploads/".length);

  // Cegah akses ke file di luar folder uploads.
  if (
    !filename ||
    path.basename(filename) !== filename ||
    path.extname(filename).toLowerCase() !== ".pdf"
  ) {
    return NextResponse.json(
      { error: "Berkas PDF tidak valid." },
      { status: 400 }
    );
  }

  const safeName = requestedName
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.pdf$/i, "");

  if (!safeName) {
    return NextResponse.json(
      { error: "Nama berkas belum tersedia." },
      { status: 400 }
    );
  }

  const root = path.resolve(uploadDir());
  const target = path.resolve(root, filename);

  if (!target.startsWith(root + path.sep)) {
    return NextResponse.json(
      { error: "Berkas tidak valid." },
      { status: 400 }
    );
  }

  try {
    const file = await fs.readFile(target);

    return new Response(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(file.byteLength),
        "Content-Disposition": `attachment; filename="document.pdf"; filename*=UTF-8''${encodeURIComponent(`${safeName}.pdf`)}`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "File PDF tidak ditemukan." },
      { status: 404 }
    );
  }
}
