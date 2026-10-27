
 // Aman dipakai di proxy.ts maupun kode server: tidak mengimpor next/headers.
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 30 * 60; // 30 menit

function secretKey() {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET belum diatur atau kurang dari 32 karakter. Lihat .env.example."
    );
  }

  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: number;
  pv: string;
};

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ pv: payload.pv })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(payload.userId))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ["HS256"],
    });

    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || typeof payload.pv !== "string") {
      return null;
    }

    return { userId, pv: payload.pv };
  } catch {
    return null;
  }
}
