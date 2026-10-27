
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { MIME_BY_EXT, uploadDir } from "@/lib/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await context.params;

  if (!segments || segments.length === 0) {
    return new Response("File tidak ditemukan.", { status: 404 });
  }

  const root = path.resolve(uploadDir());
  const target = path.resolve(root, ...segments);

  // Mencegah akses ke file di luar folder unggahan.
  if (
    target === root ||
    !target.startsWith(root + path.sep)
  ) {
    return new Response("File tidak ditemukan.", { status: 404 });
  }

  const ext = path.extname(target).slice(1).toLowerCase();
  const contentType = MIME_BY_EXT[ext];

  if (!contentType) {
    return new Response("Format file tidak didukung.", { status: 404 });
  }

  try {
    const file = await fs.readFile(target);

    return new Response(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(file.byteLength),
        "Content-Disposition": "inline",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "File tidak ditemukan." },
      { status: 404 }
    );
  }
}
