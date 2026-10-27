import { slugify } from "./utils";
import type { Field } from "./resources";

export type ParsedForm = {
  values: Record<string, string | number | boolean | Date | null>;
  /** Nilai mentah (string) untuk mengisi ulang form bila ada kesalahan. */
  raw: Record<string, string>;
  errors: Record<string, string>;
};

const DEFAULT_MAX: Record<Field["type"], number> = {
  text: 200,
  textarea: 2000,
  markdown: 60000,
  number: 20,
  boolean: 5,
  image: 500,
  file: 2048,
  url: 500,
  email: 200,
  date: 20,
  select: 200,
  slug: 100,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseForm(fields: Field[], fd: FormData): ParsedForm {
  const values: ParsedForm["values"] = {};
  const raw: Record<string, string> = {};
  const errors: Record<string, string> = {};

  for (const f of fields) {
    if (f.type === "boolean") {
      const on = fd.get(f.name) === "on";
      values[f.name] = on;
      raw[f.name] = on ? "on" : "";
      continue;
    }

    const input = fd.get(f.name);
    const text = (typeof input === "string" ? input.replace(/\r\n/g, "\n") : "").trim();
    raw[f.name] = text;

    const max = f.max ?? DEFAULT_MAX[f.type];
    if (text.length > max) {
      errors[f.name] = `${f.label} maksimal ${max} karakter.`;
      continue;
    }

    if (f.type === "number") {
      if (text === "") {
        if (f.required) errors[f.name] = `${f.label} wajib diisi.`;
        values[f.name] = f.nullable ? null : 0;
        continue;
      }
      const n = Number(text);
      if (!Number.isInteger(n) || n < -1_000_000 || n > 1_000_000_000) {
        errors[f.name] = `${f.label} harus berupa bilangan bulat.`;
        continue;
      }
      values[f.name] = n;
      continue;
    }

    if (f.type === "date") {
      if (text === "") {
        values[f.name] = null;
        continue;
      }
      const d = /^\d{4}-\d{2}-\d{2}$/.test(text) ? new Date(`${text}T00:00:00.000Z`) : null;
      if (!d || Number.isNaN(d.getTime())) {
        errors[f.name] = `${f.label} tidak valid.`;
        continue;
      }
      values[f.name] = d;
      continue;
    }

    if (f.required && text === "") {
      errors[f.name] = `${f.label} wajib diisi.`;
      continue;
    }

if (text !== "") {
  if (f.type === "url" && !/^https?:\/\/\S+$/i.test(text)) {
    errors[f.name] = `${f.label} harus diawali http:// atau https://`;
    continue;
  }

  if (
    f.type === "image" &&
    !/^(\/uploads\/[\w./-]+|https?:\/\/\S+)$/i.test(text)
  ) {
    errors[f.name] = `${f.label} tidak valid. Unggah ulang gambarnya.`;
    continue;
  }

  if (
    f.type === "file" &&
    !/^\/uploads\/[\w./-]+\.pdf$/i.test(text) &&
    !/^https?:\/\/\S+\.pdf(?:\?\S*)?$/i.test(text)
  ) {
    errors[f.name] = `${f.label} harus berupa berkas PDF yang valid.`;
    continue;
  }

  if (f.type === "email" && !EMAIL_RE.test(text)) {
    errors[f.name] = `${f.label} tidak valid.`;
    continue;
  }
}

    

    values[f.name] = text;
  }

  // Slug: turunkan dari field sumber bila kosong.
  for (const f of fields) {
    if (f.type !== "slug" || errors[f.name]) continue;
    const source = f.slugFrom ? raw[f.slugFrom] ?? "" : "";
    const slug = slugify(raw[f.name] || source);
    if (!slug) {
      errors[f.name] = `${f.label} tidak bisa dibuat. Isi ${f.slugFrom ? "judulnya" : "slug"} terlebih dahulu.`;
    } else {
      values[f.name] = slug;
      raw[f.name] = slug;
    }
  }

  return { values, raw, errors };
}
