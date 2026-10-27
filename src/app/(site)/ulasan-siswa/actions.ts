
// "use server";

// import { randomUUID } from "node:crypto";
// import { mkdir, writeFile } from "node:fs/promises";
// import path from "node:path";
// import type { RowDataPacket } from "mysql2";
// import { revalidatePath } from "next/cache";
// import { db } from "@/db";

// export type ReviewFormState = {
//   ok?: boolean;
//   message?: string;
//   error?: string;
//   fieldErrors?: Record<string, string>;
//   values?: Record<string, string>;
// };

// const MAX_PHOTO_SIZE = 3 * 1024 * 1024;

// async function saveReviewPhoto(file: File): Promise<string | null> {
//   if (file.size === 0) return null;

//   if (file.size > MAX_PHOTO_SIZE) {
//     throw new Error("Ukuran foto maksimal 3 MB.");
//   }

//   const allowedTypes: Record<string, string> = {
//     "image/jpeg": ".jpg",
//     "image/png": ".png",
//     "image/webp": ".webp",
//   };

//   const extension = allowedTypes[file.type];

//   if (!extension) {
//     throw new Error("Format foto harus JPG, PNG, atau WebP.");
//   }

//   const buffer = Buffer.from(await file.arrayBuffer());

//   // Periksa signature file, bukan hanya nama atau MIME dari browser.
//   const isJpeg =
//     extension === ".jpg" &&
//     buffer.length >= 3 &&
//     buffer[0] === 0xff &&
//     buffer[1] === 0xd8 &&
//     buffer[2] === 0xff;

//   const isPng =
//     extension === ".png" &&
//     buffer.length >= 8 &&
//     buffer.subarray(0, 8).equals(
//       Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
//     );

//   const isWebp =
//     extension === ".webp" &&
//     buffer.length >= 12 &&
//     buffer.toString("ascii", 0, 4) === "RIFF" &&
//     buffer.toString("ascii", 8, 12) === "WEBP";

//   if (!isJpeg && !isPng && !isWebp) {
//     throw new Error("Isi file bukan gambar JPG, PNG, atau WebP yang valid.");
//   }

//   const uploadDir = path.join(
//     process.cwd(),
//     "public",
//     "uploads",
//     "ulasan-siswa",
//   );

//   await mkdir(uploadDir, { recursive: true });

//   const filename = `${randomUUID()}${extension}`;

//   await writeFile(path.join(uploadDir, filename), buffer, {
//     flag: "wx",
//   });

//   return `/uploads/ulasan-siswa/${filename}`;
// }

// export async function submitStudentReview(
//   _prevState: ReviewFormState,
//   formData: FormData,
// ): Promise<ReviewFormState> {
//   const name = String(formData.get("name") ?? "").trim();
//   const role = String(formData.get("role") ?? "").trim();
//   const company = String(formData.get("company") ?? "").trim();
//   const quote = String(formData.get("quote") ?? "").trim();
//   const ratingRaw = String(formData.get("rating") ?? "").trim();
//   const website = String(formData.get("website") ?? "").trim();
//   const photo = formData.get("photo");

//   const values = {
//     name,
//     role,
//     company,
//     quote,
//     rating: ratingRaw,
//   };

//   // Honeypot untuk mengurangi spam otomatis sederhana.
//   if (website) {
//     return { error: "Ulasan tidak dapat dikirim." };
//   }

//   const fieldErrors: Record<string, string> = {};
//   const rating = Number(ratingRaw);

//   if (!name) {
//     fieldErrors.name = "Nama wajib diisi.";
//   } else if (name.length > 100) {
//     fieldErrors.name = "Nama maksimal 100 karakter.";
//   }

//   if (role.length > 100) {
//     fieldErrors.role = "Status maksimal 100 karakter.";
//   }

//   if (company.length > 120) {
//     fieldErrors.company = "Perusahaan maksimal 120 karakter.";
//   }

//   if (!quote) {
//     fieldErrors.quote = "Ulasan wajib diisi.";
//   } else if (quote.length < 10 || quote.length > 500) {
//     fieldErrors.quote = "Ulasan harus terdiri dari 10–500 karakter.";
//   }

//   if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
//     fieldErrors.rating = "Pilih rating antara 1 sampai 5 bintang.";
//   }

//   if (!(photo instanceof File)) {
//     fieldErrors.photo = "Data foto tidak valid.";
//   } else if (photo.size > MAX_PHOTO_SIZE) {
//     fieldErrors.photo = "Ukuran foto maksimal 3 MB.";
//   } else if (
//     photo.size > 0 &&
//     !["image/jpeg", "image/png", "image/webp"].includes(photo.type)
//   ) {
//     fieldErrors.photo = "Foto harus berformat JPG, PNG, atau WebP.";
//   }

//   if (Object.keys(fieldErrors).length > 0) {
//     return {
//       error: "Periksa kembali isian yang ditandai.",
//       fieldErrors,
//       values,
//     };
//   }

//   let photoUrl: string | null = null;

//   try {
//     if (photo instanceof File && photo.size > 0) {
//       photoUrl = await saveReviewPhoto(photo);
//     }
//   } catch (error) {
//     return {
//       error:
//         error instanceof Error
//           ? error.message
//           : "Foto gagal diunggah.",
//       fieldErrors: { photo: "Foto gagal diunggah." },
//       values,
//     };
//   }

//   try {
//     const [sortRows] = await db.execute<RowDataPacket[]>(
//       "SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextOrder FROM testimonials",
//     );

//     const sortOrder = Number(sortRows[0]?.nextOrder ?? 1);

//     await db.execute(
//       `INSERT INTO testimonials
//         (name, role, company, quote, rating, photo_url, published, sort_order)
//        VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
//       [
//         name,
//         role || null,
//         company || null,
//         quote,
//         rating,
//         photoUrl,
//         sortOrder,
//       ],
//     );
//   } catch {
//     return {
//       error: "Ulasan gagal disimpan. Silakan coba kembali.",
//       values,
//     };
//   }

//   revalidatePath("/ulasan-siswa");
//   revalidatePath("/");

//   return {
//     ok: true,
//     message: "Terima kasih! Ulasanmu berhasil dikirim dan langsung ditampilkan.",
//   };
// }

//DIATAS ADALAH LOKAL

"use server";

import { put } from "@vercel/blob"; // <-- Ganti import fs dengan Vercel Blob put
import type { RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";
import { db } from "@/db";

export type ReviewFormState = {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

const MAX_PHOTO_SIZE = 3 * 1024 * 1024;

async function saveReviewPhoto(file: File): Promise<string | null> {
  if (file.size === 0) return null;

  if (file.size > MAX_PHOTO_SIZE) {
    throw new Error("Ukuran foto maksimal 3 MB.");
  }

  const allowedTypes: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  const extension = allowedTypes[file.type];

  if (!extension) {
    throw new Error("Format foto harus JPG, PNG, atau WebP.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Periksa signature file, bukan hanya nama atau MIME dari browser.
  const isJpeg =
    extension === ".jpg" &&
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;

  const isPng =
    extension === ".png" &&
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    );

  const isWebp =
    extension === ".webp" &&
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP";

  if (!isJpeg && !isPng && !isWebp) {
    throw new Error("Isi file bukan gambar JPG, PNG, atau WebP yang valid.");
  }

  // Buat nama file unik untuk Vercel Blob
  const filename = `ulasan-siswa/${Date.now()}-${Math.random().toString(36).substring(2, 8)}${extension}`;

  // Unggah langsung ke Vercel Blob
  const blob = await put(filename, file, {
    access: "public",
  });

  return blob.url; // Mengembalikan URL publik Vercel Blob (https://...)
}

export async function submitStudentReview(
  _prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const photo = formData.get("photo");

  const values = {
    name,
    role,
    company,
    quote,
    rating: ratingRaw,
  };

  // Honeypot untuk mengurangi spam otomatis sederhana.
  if (website) {
    return { error: "Ulasan tidak dapat dikirim." };
  }

  const fieldErrors: Record<string, string> = {};
  const rating = Number(ratingRaw);

  if (!name) {
    fieldErrors.name = "Nama wajib diisi.";
  } else if (name.length > 100) {
    fieldErrors.name = "Nama maksimal 100 karakter.";
  }

  if (role.length > 100) {
    fieldErrors.role = "Status maksimal 100 karakter.";
  }

  if (company.length > 120) {
    fieldErrors.company = "Perusahaan maksimal 120 karakter.";
  }

  if (!quote) {
    fieldErrors.quote = "Ulasan wajib diisi.";
  } else if (quote.length < 10 || quote.length > 500) {
    fieldErrors.quote = "Ulasan harus terdiri dari 10–500 karakter.";
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    fieldErrors.rating = "Pilih rating antara 1 sampai 5 bintang.";
  }

  if (!(photo instanceof File)) {
    fieldErrors.photo = "Data foto tidak valid.";
  } else if (photo.size > MAX_PHOTO_SIZE) {
    fieldErrors.photo = "Ukuran foto maksimal 3 MB.";
  } else if (
    photo.size > 0 &&
    !["image/jpeg", "image/png", "image/webp"].includes(photo.type)
  ) {
    fieldErrors.photo = "Foto harus berformat JPG, PNG, atau WebP.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Periksa kembali isian yang ditandai.",
      fieldErrors,
      values,
    };
  }

  let photoUrl: string | null = null;

  try {
    if (photo instanceof File && photo.size > 0) {
      photoUrl = await saveReviewPhoto(photo);
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Foto gagal diunggah.",
      fieldErrors: { photo: "Foto gagal diunggah." },
      values,
    };
  }

  try {
    const [sortRows] = await db.execute<RowDataPacket[]>(
      "SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextOrder FROM testimonials",
    );

    const sortOrder = Number(sortRows[0]?.nextOrder ?? 1);

    await db.execute(
      `INSERT INTO testimonials
        (name, role, company, quote, rating, photo_url, published, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
      [
        name,
        role || null,
        company || null,
        quote,
        rating,
        photoUrl,
        sortOrder,
      ],
    );
  } catch {
    return {
      error: "Ulasan gagal disimpan. Silakan coba kembali.",
      values,
    };
  }

  revalidatePath("/ulasan-siswa");
  revalidatePath("/");

  return {
    ok: true,
    message: "Terima kasih! Ulasanmu berhasil dikirim dan langsung ditampilkan.",
  };
}