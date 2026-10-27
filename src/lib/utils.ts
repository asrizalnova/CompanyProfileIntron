export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Jakarta",
});

/**
 * Mengonversi nilai tanggal menjadi objek Date.
 * BIGINT pada created_at diasumsikan Unix timestamp dalam detik.
 */
function parseDate(value: Date | number | string | null | undefined): Date | null {
  if (value == null || value === "") return null;

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "number") {
    date = new Date(value * 1000);
  } else {
    const numericValue = Number(value);

    if (value.trim() !== "" && Number.isFinite(numericValue)) {
      date = new Date(numericValue * 1000);
    } else {
      date = new Date(value);
    }
  }

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

export function formatDate(
  value: Date | number | string | null | undefined,
) {
  const date = parseDate(value);

  if (!date) return "";

  return dateFormatter.format(date);
}

export function formatDateTime(
  value: Date | number | string | null | undefined,
) {
  const date = parseDate(value);

  if (!date) return "";

  return dateTimeFormatter.format(date);
}

/** Format tanggal untuk <input type="date"> (YYYY-MM-DD). */
export function toDateInput(
  value: Date | string | number | null | undefined,
): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "number" || /^\d+$/.test(value)) {
    const timestamp = Number(value);

    // Timestamp Unix dalam detik dikonversi menjadi milidetik.
    date = new Date(
      Math.abs(timestamp) < 100000000000 ? timestamp * 1000 : timestamp,
    );
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function splitTags(value: string) {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

/** Hash string sederhana → angka stabil (untuk memilih warna sampul). */
export function hashString(input: string) {
  let h = 2166136261;

  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  return h >>> 0;
}