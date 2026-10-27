
import "server-only";
import path from "node:path";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function uploadDir() {
  const dir = process.env.UPLOAD_DIR ?? "./uploads";

  return path.isAbsolute(dir)
    ? dir
    : path.resolve(/*turbopackIgnore: true*/ process.cwd(), dir);
}

export const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  pdf: "application/pdf",
};

/** Deteksi format gambar berdasarkan byte awal file. */
export function detectImageExt(
  bytes: Uint8Array
): "png" | "jpg" | "webp" | "gif" | null {
  const b = bytes;

  if (
    b.length > 8 &&
    b[0] === 0x89 &&
    b[1] === 0x50 &&
    b[2] === 0x4e &&
    b[3] === 0x47
  ) {
    return "png";
  }

  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    return "jpg";
  }

  if (
    b.length > 3 &&
    b[0] === 0x47 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x38
  ) {
    return "gif";
  }

  if (
    b.length > 12 &&
    b[0] === 0x52 &&
    b[1] === 0x49 &&
    b[2] === 0x46 &&
    b[3] === 0x46 &&
    b[8] === 0x57 &&
    b[9] === 0x45 &&
    b[10] === 0x42 &&
    b[11] === 0x50
  ) {
    return "webp";
  }

  return null;
}
