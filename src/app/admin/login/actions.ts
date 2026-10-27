"use server";

import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { startSession } from "@/lib/auth";
import { clearRateLimit, clientIp, rateLimit } from "@/lib/rate-limit";

export type LoginState = {
  error?: string;
  email?: string;
};

type AdminRow = RowDataPacket & {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
};

// Hash palsu agar waktu respons sama baik email terdaftar maupun tidak.
const DUMMY_HASH = bcrypt.hashSync("tidak-dipakai", 12);

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Isi email dan password.", email };
  }

  const ip = await clientIp();
  const byIp = rateLimit(`login:ip:${ip}`, 20, 15 * 60 * 1000);
  const byEmail = rateLimit(`login:email:${email}`, 5, 15 * 60 * 1000);

  if (!byIp.ok || !byEmail.ok) {
    const minutes = Math.ceil(
      Math.max(byIp.retryAfterSec, byEmail.retryAfterSec) / 60,
    );

    return {
      error: `Terlalu banyak percobaan. Coba lagi dalam ${minutes} menit.`,
      email,
    };
  }

  const [rows] = await db.execute<AdminRow[]>(
    `SELECT id, email, name, password_hash AS passwordHash
     FROM admin_users
     WHERE email = ?
     LIMIT 1`,
    [email],
  );

  const user = rows[0];
  const valid = await bcrypt.compare(
    password,
    user?.passwordHash ?? DUMMY_HASH,
  );

  if (!user || !valid) {
    return { error: "Email atau password salah.", email };
  }

  clearRateLimit(`login:email:${email}`);

  await startSession({
    id: Number(user.id),
    passwordHash: user.passwordHash,
  });

  redirect("/admin");
}