"use server";

import { db } from "@/db";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type ContactState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Partial<
    Record<"name" | "email" | "phone" | "subject" | "body", string>
  >;
  values?: Record<string, string>;
};

const contactSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(100, "Nama maksimal 100 karakter."),
  email: z.string().trim().email("Email tidak valid.").max(200),
  phone: z.string().trim().max(40, "Nomor telepon terlalu panjang.").optional().default(""),
  subject: z.string().trim().max(150, "Subjek maksimal 150 karakter.").optional().default(""),
  body: z.string().trim().min(10, "Pesan minimal 10 karakter.").max(4000, "Pesan maksimal 4000 karakter."),
});

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Kolom jebakan untuk bot: pengguna asli tidak melihat atau mengisinya.
  if (String(formData.get("website") ?? "") !== "") {
    return { ok: true };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    body: String(formData.get("body") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: NonNullable<ContactState["fieldErrors"]> = {};

    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof typeof fieldErrors;

      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }

    return {
      error: "Periksa kembali isian yang ditandai.",
      fieldErrors,
      values: raw,
    };
  }

  const ip = await clientIp();
  const limit = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);

  if (!limit.ok) {
    return {
      error: `Anda sudah mengirim beberapa pesan. Coba lagi dalam ${Math.ceil(limit.retryAfterSec / 60)} menit.`,
      values: raw,
    };
  }

  const { name, email, phone, subject, body } = parsed.data;

  await db.execute(
    `INSERT INTO messages (name, email, phone, subject, body)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, phone, subject, body],
  );

  return { ok: true };
}