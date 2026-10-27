import "server-only";
import { createHash } from "node:crypto";
import type { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
SESSION_COOKIE,
SESSION_MAX_AGE,
signSession,
verifySession,
} from "./session-token";
/** Sidik jari hash password: sesi lama otomatis tidak berlaku setelah password diganti. */
function passwordVersion(passwordHash: string) {
return createHash("sha256").update(passwordHash).digest("hex").slice(0, 16);
}
type AdminRow = RowDataPacket & {
id: number;
email: string;
name: string;
passwordHash: string;
};
export async function startSession(user: { id: number; passwordHash: string }) {
const token = await signSession({
userId: user.id,
pv: passwordVersion(user.passwordHash),
});
const secure = (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://");
(await cookies()).set(SESSION_COOKIE, token, {
httpOnly: true,
sameSite: "lax",
secure,
path: "/",
maxAge: SESSION_MAX_AGE,
});
}
export async function endSession() {
(await cookies()).delete(SESSION_COOKIE);
}
/** Mengembalikan admin yang sedang login, atau null. */
export async function getCurrentAdmin() {
const token = (await cookies()).get(SESSION_COOKIE)?.value;
const session = await verifySession(token);
if (!session) return null;
const [rows] = await db.execute<AdminRow[]>(
  `SELECT id, email, name, password_hash AS passwordHash
   FROM admin_users
   WHERE id = ?
   LIMIT 1`,
  [session.userId],
);
const user = rows[0];
if (!user || passwordVersion(user.passwordHash) !== session.pv) {
return null;
}
return {
id: Number(user.id),
email: user.email,
name: user.name,
passwordHash: user.passwordHash,
};
}
/** Pagar untuk halaman dan server action admin: arahkan ke login bila belum masuk. */
export async function requireAdmin() {
const admin = await getCurrentAdmin();
if (!admin) redirect("/admin/login");
return admin;
}