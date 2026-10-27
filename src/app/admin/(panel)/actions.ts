"use server";

import bcrypt from "bcryptjs";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { endSession, requireAdmin, startSession } from "@/lib/auth";
import { parseForm } from "@/lib/form-parser";
import { resources, settingsFields } from "@/lib/resources";
import { tables } from "@/lib/tables";

export type FormState = {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

function refreshSite() {
  revalidatePath("/", "layout");
}

function toSqlColumn(key: string) {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function quoteColumn(key: string) {
  if (!/^[a-z][a-zA-Z0-9]*$/.test(key)) {
    throw new Error(`Nama kolom tidak valid: ${key}`);
  }
  return `\`${toSqlColumn(key)}\``;
}

async function uniqueSlug(
  tableName: string,
  base: string,
  selfId: number | null,
) {
  let candidate = base;

  for (let i = 2; i < 100; i++) {
    const sql = selfId
      ? `SELECT id FROM \`${tableName}\` WHERE slug = ? AND id <> ? LIMIT 1`
      : `SELECT id FROM \`${tableName}\` WHERE slug = ? LIMIT 1`;

    const params = selfId ? [candidate, selfId] : [candidate];
    const [rows] = await db.execute<RowDataPacket[]>(sql, params);

    if (rows.length === 0) return candidate;
    candidate = `${base}-${i}`;
  }

  return `${base}-${Date.now().toString(36)}`;
}

export async function saveResource(
  key: string,
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const config = resources[key];
  const table = tables[key];

  if (!config || !table) {
    return { error: "Jenis konten tidak dikenal." };
  }

 
const { values, raw, errors } = parseForm(config.fields, formData);

// Validasi khusus untuk resource Unduh Berkas.
if (key === "unduh-berkas") {
  const sourceType = String(values.sourceType ?? "pdf");
  const fileUrl = String(values.fileUrl ?? "").trim();
  const externalUrl = String(values.externalUrl ?? "").trim();

  if (sourceType !== "pdf" && sourceType !== "link") {
    errors.sourceType = "Jenis berkas tidak valid.";
  } else if (sourceType === "pdf" && !fileUrl) {
    errors.fileUrl = "Silakan unggah file PDF.";
  } else if (sourceType === "link" && !externalUrl) {
    errors.externalUrl = "Tautan dokumen wajib diisi.";
  } else if (
    sourceType === "link" &&
    !/^https?:\/\/\S+$/i.test(externalUrl)
  ) {
    errors.externalUrl = "Tautan harus menggunakan URL HTTP atau HTTPS.";
  }

  // Simpan hanya sumber yang sesuai dengan jenis yang dipilih.
  values.sourceType = sourceType;
  values.fileUrl = sourceType === "pdf" ? fileUrl : "";
  values.externalUrl = sourceType === "link" ? externalUrl : null;
}

if (Object.keys(errors).length > 0) {
  return {
    error: "Periksa kembali isian yang ditandai.",
    fieldErrors: errors,
    values: raw,
  };
}


  if (table.hasSlug && typeof values.slug === "string") {
    values.slug = await uniqueSlug(table.name, values.slug, id);
  }

  if (key === "artikel" && values.published && !values.publishedAt) {
    values.publishedAt = new Date();
  }


const entries = Object.entries(values);
const columns = entries.map(([key]) => quoteColumn(key));

const dateFields = new Set([
  "selectionStartDate",
  "registrationCloseDate",
]);

const params = entries.map(([key, value]) => {
  if (dateFields.has(key)) {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    if (value instanceof Date) {
      return [
        value.getUTCFullYear(),
        String(value.getUTCMonth() + 1).padStart(2, "0"),
        String(value.getUTCDate()).padStart(2, "0"),
      ].join("-");
    }

    const raw = String(value).trim();

    // Nilai berupa YYYY-MM-DD.
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return raw;
    }

    // Nilai berupa Unix timestamp dalam detik atau milidetik.
    if (/^\d{9,13}$/.test(raw)) {
      const timestamp = Number(raw);
      const date = new Date(
        raw.length <= 10 ? timestamp * 1000 : timestamp,
      );

      if (Number.isNaN(date.getTime())) {
        throw new Error(`Tanggal ${key} tidak valid.`);
      }

      return [
        date.getUTCFullYear(),
        String(date.getUTCMonth() + 1).padStart(2, "0"),
        String(date.getUTCDate()).padStart(2, "0"),
      ].join("-");
    }

    throw new Error(`Format tanggal ${key} tidak valid.`);
  }

  if (value instanceof Date) {
    return Math.floor(value.getTime() / 1000);
  }

  return value;
});


  if (id) {
    const [existing] = await db.execute<RowDataPacket[]>(
      `SELECT id FROM \`${table.name}\` WHERE id = ? LIMIT 1`,
      [id],
    );

    if (existing.length === 0) {
      return { error: "Data tidak ditemukan. Mungkin sudah dihapus." };
    }

    if (entries.length > 0) {
      const assignments = columns.map((column) => `${column} = ?`).join(", ");

      await db.execute(
        `UPDATE \`${table.name}\` SET ${assignments} WHERE id = ?`,
        [...params, id],
      );
    }
  } else {
    if ("sortOrder" in values && !values.sortOrder) {
      const [rows] = await db.execute<RowDataPacket[]>(
        `SELECT COALESCE(MAX(sort_order), 0) AS maxOrder FROM \`${table.name}\``,
      );

      values.sortOrder = Number(rows[0]?.maxOrder ?? 0) + 1;

      const index = entries.findIndex(([key]) => key === "sortOrder");
      if (index >= 0) {
        params[index] = values.sortOrder;
      }
    }

    if (entries.length > 0) {
      await db.execute(
        `INSERT INTO \`${table.name}\` (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
        params,
      );
    }
  }

  refreshSite();
  redirect(`/admin/${key}?ok=${id ? "diperbarui" : "ditambahkan"}`);
}

export async function deleteResource(key: string, id: number) {
  await requireAdmin();

  const table = tables[key];
  if (!table) return;

  await db.execute(`DELETE FROM \`${table.name}\` WHERE id = ?`, [id]);

  refreshSite();
  redirect(`/admin/${key}?ok=dihapus`);
}

export async function moveResource(
  key: string,
  id: number,
  direction: "up" | "down",
) {
  await requireAdmin();

  const table = tables[key];
  if (!table || !resources[key]?.orderable) return;

  const [result] = await db.execute<RowDataPacket[]>(
    `SELECT id FROM \`${table.name}\` ORDER BY sort_order ASC, id ASC`,
  );

  const rows = result as { id: number }[];
  const index = rows.findIndex((row) => Number(row.id) === id);
  const target = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || target < 0 || target >= rows.length) return;

  [rows[index], rows[target]] = [rows[target], rows[index]];

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    for (let i = 0; i < rows.length; i++) {
      await connection.execute(
        `UPDATE \`${table.name}\` SET sort_order = ? WHERE id = ?`,
        [i + 1, rows[i].id],
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  refreshSite();
  revalidatePath(`/admin/${key}`);
}

export async function saveSettings(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const { values, raw, errors } = parseForm(settingsFields, formData);

  if (Object.keys(errors).length > 0) {
    return {
      error: "Periksa kembali isian yang ditandai.",
      fieldErrors: errors,
      values: raw,
    };
  }


const entries = Object.entries(values);
const columns = entries.map(([key]) => quoteColumn(key));

const dateFields = new Set([
  "selectionStartDate",
  "registrationCloseDate",
]);

const params = entries.map(([key, value]) => {
  if (dateFields.has(key)) {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    if (value instanceof Date) {
      return [
        value.getUTCFullYear(),
        String(value.getUTCMonth() + 1).padStart(2, "0"),
        String(value.getUTCDate()).padStart(2, "0"),
      ].join("-");
    }

    const raw = String(value).trim();

    // Nilai berupa YYYY-MM-DD.
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return raw;
    }

    // Nilai berupa Unix timestamp dalam detik atau milidetik.
    if (/^\d{9,13}$/.test(raw)) {
      const timestamp = Number(raw);
      const date = new Date(
        raw.length <= 10 ? timestamp * 1000 : timestamp,
      );

      if (Number.isNaN(date.getTime())) {
        throw new Error(`Tanggal ${key} tidak valid.`);
      }

      return [
        date.getUTCFullYear(),
        String(date.getUTCMonth() + 1).padStart(2, "0"),
        String(date.getUTCDate()).padStart(2, "0"),
      ].join("-");
    }

    throw new Error(`Format tanggal ${key} tidak valid.`);
  }

  if (value instanceof Date) {
    return Math.floor(value.getTime() / 1000);
  }

  return value;
});


  const insertColumns = ["`id`", ...columns];
  const placeholders = insertColumns.map(() => "?").join(", ");

  const updates = columns.map((column) => `${column} = VALUES(${column})`);

  await db.execute(
    `INSERT INTO site_settings (${insertColumns.join(", ")}) VALUES (${placeholders})
     ON DUPLICATE KEY UPDATE ${updates.length ? updates.join(", ") : "`id` = 1"}`,
    [1, ...params],
  );

  refreshSite();

  return {
    ok: true,
    message: "Pengaturan tersimpan dan sudah tampil di situs.",
    values: raw,
  };
}

export async function markMessage(id: number, isRead: boolean) {
  await requireAdmin();

  await db.execute(
    "UPDATE messages SET is_read = ? WHERE id = ?",
    [isRead ? 1 : 0, id],
  );

  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: number) {
  await requireAdmin();

  await db.execute("DELETE FROM messages WHERE id = ?", [id]);

  revalidatePath("/admin", "layout");
}

export async function updateAccount(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const admin = await requireAdmin();

  const str = (key: string) => String(formData.get(key) ?? "").trim();
  const name = str("name");
  const email = str("email").toLowerCase();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  const fieldErrors: Record<string, string> = {};

  if (!name) fieldErrors.name = "Nama wajib diisi.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Email tidak valid.";
  }
  if (newPassword && newPassword.length < 8) {
    fieldErrors.newPassword = "Password baru minimal 8 karakter.";
  }
  if (newPassword && newPassword !== confirm) {
    fieldErrors.confirmPassword = "Konfirmasi tidak sama dengan password baru.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Periksa kembali isian yang ditandai.", fieldErrors };
  }

  if (!(await bcrypt.compare(currentPassword, admin.passwordHash))) {
    return {
      error: "Periksa kembali isian yang ditandai.",
      fieldErrors: { currentPassword: "Password saat ini salah." },
    };
  }

  const [clashes] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM admin_users WHERE email = ? AND id <> ? LIMIT 1",
    [email, admin.id],
  );

  if (clashes.length > 0) {
    return {
      error: "Periksa kembali isian yang ditandai.",
      fieldErrors: { email: "Email sudah dipakai admin lain." },
    };
  }

  const passwordHash = newPassword
    ? await bcrypt.hash(newPassword, 12)
    : admin.passwordHash;

  await db.execute(
    "UPDATE admin_users SET name = ?, email = ?, password_hash = ? WHERE id = ?",
    [name, email, passwordHash, admin.id],
  );

  await startSession({ id: admin.id, passwordHash });

  revalidatePath("/admin", "layout");

  return {
    ok: true,
    message: newPassword
      ? "Akun dan password diperbarui."
      : "Akun diperbarui.",
  };
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

export async function saveProgramActivity(
  programId: number,
  activityId: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  if (!Number.isInteger(programId) || programId < 1) {
    return { error: "Program tidak valid." };
  }

  const [programRows] = await db.execute<RowDataPacket[]>(
    "SELECT id, slug FROM programs WHERE id = ? LIMIT 1",
    [programId],
  );

  const program = programRows[0];

  if (!program) {
    return { error: "Program tidak ditemukan." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sortOrderRaw = String(formData.get("sortOrder") ?? "").trim();
  const published = formData.get("published") === "on";
  const sortOrder = sortOrderRaw === "" ? 0 : Number(sortOrderRaw);

  const fieldErrors: Record<string, string> = {};

  if (!title) {
    fieldErrors.title = "Nama kegiatan wajib diisi.";
  } else if (title.length > 160) {
    fieldErrors.title = "Nama kegiatan maksimal 160 karakter.";
  }

  if (
    imageUrl &&
    !imageUrl.startsWith("/") &&
    !/^https?:\/\//i.test(imageUrl)
  ) {
    fieldErrors.imageUrl = "URL gambar tidak valid.";
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    fieldErrors.sortOrder = "Urutan harus berupa angka bulat minimal 0.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Periksa kembali isian yang ditandai.", fieldErrors };
  }

  if (activityId !== null) {
    if (!Number.isInteger(activityId) || activityId < 1) {
      return { error: "ID kegiatan tidak valid." };
    }

    const [activityRows] = await db.execute<RowDataPacket[]>(
      `SELECT id
       FROM program_activities
       WHERE id = ? AND program_id = ?
       LIMIT 1`,
      [activityId, programId],
    );

    if (activityRows.length === 0) {
      return { error: "Kegiatan tidak ditemukan pada program ini." };
    }

    await db.execute(
      `UPDATE program_activities
       SET title = ?, image_url = ?, description = ?,
           sort_order = ?, published = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND program_id = ?`,
      [
        title,
        imageUrl || null,
        description,
        sortOrder,
        published ? 1 : 0,
        activityId,
        programId,
      ],
    );
  } else {
    await db.execute(
      `INSERT INTO program_activities
       (program_id, title, image_url, description, sort_order, published)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        programId,
        title,
        imageUrl || null,
        description,
        sortOrder,
        published ? 1 : 0,
      ],
    );
  }

  refreshSite();
  revalidatePath(`/admin/program/${programId}`);
  revalidatePath(`/program/${program.slug}`);

  return {
    ok: true,
    message: activityId === null
      ? "Kegiatan berhasil ditambahkan."
      : "Kegiatan berhasil diperbarui.",
  };
}


export async function deleteProgramActivity(
  programId: number,
  activityId: number,
): Promise<void> {
  await requireAdmin();

  if (
    !Number.isInteger(programId) ||
    programId < 1 ||
    !Number.isInteger(activityId) ||
    activityId < 1
  ) {
    throw new Error("ID program atau kegiatan tidak valid.");
  }

  const [programRows] = await db.execute<RowDataPacket[]>(
    "SELECT id, slug FROM programs WHERE id = ? LIMIT 1",
    [programId],
  );

  const program = programRows[0];

  if (!program) {
    throw new Error("Program tidak ditemukan.");
  }

  await db.execute(
    `DELETE FROM program_activities
     WHERE id = ? AND program_id = ?`,
    [activityId, programId],
  );

  refreshSite();
  revalidatePath(`/admin/program/${programId}`);
  revalidatePath(`/program/${program.slug}`);
}



export async function savePartnerMember(
  partnerId: number,
  memberId: number | null,
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const [partners] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM partners WHERE id = ? LIMIT 1",
    [partnerId],
  );

  if (partners.length === 0) {
    throw new Error("Mitra tidak ditemukan.");
  }

  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim();
  const sortOrderRaw = String(formData.get("sortOrder") ?? "0").trim();
  const sortOrder = sortOrderRaw === "" ? 0 : Number(sortOrderRaw);
  const published = formData.get("published") === "on";

  if (!name) throw new Error("Nama pengurus wajib diisi.");

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error("Urutan tampil harus berupa angka bulat minimal 0.");
  }


  if (memberId !== null) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT id FROM partner_members
       WHERE id = ? AND partner_id = ? LIMIT 1`,
      [memberId, partnerId],
    );

    if (rows.length === 0) {
      throw new Error("Pengurus tidak ditemukan.");
    }

    await db.execute(
      `UPDATE partner_members
       SET name = ?, position = ?,
           sort_order = ?, published = ?
       WHERE id = ? AND partner_id = ?`,
      [
        name,
        position || null,
        sortOrder,
        published ? 1 : 0,
        memberId,
        partnerId,
      ],
    );
  } else {
    await db.execute(
      `INSERT INTO partner_members
       (partner_id, name, position, sort_order, published)
       VALUES (?, ?, ?, ?, ?)`,
      [
        partnerId,
        name,
        position || null,
        sortOrder,
        published ? 1 : 0,
      ],
    );
  }

  refreshSite();
  revalidatePath("/admin/mitra");
  revalidatePath(`/admin/mitra/${partnerId}`);
}

export async function deletePartnerMember(
  partnerId: number,
  memberId: number,
): Promise<void> {
  await requireAdmin();

  await db.execute(
    `DELETE FROM partner_members
     WHERE id = ? AND partner_id = ?`,
    [memberId, partnerId],
  );

  refreshSite();
  revalidatePath("/admin/mitra");
  revalidatePath(`/admin/mitra/${partnerId}`);
}

export async function savePartnerDocumentation(
  partnerId: number,
  documentationId: number | null,
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const [partners] = await db.execute<RowDataPacket[]>(
    "SELECT id FROM partners WHERE id = ? LIMIT 1",
    [partnerId],
  );

  if (partners.length === 0) {
    throw new Error("Mitra tidak ditemukan.");
  }

  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  if (!imageUrl) {
    throw new Error("Foto dokumentasi wajib diunggah.");
  }

  if (
    !imageUrl.startsWith("/") &&
    !/^https?:\/\/\S+$/i.test(imageUrl)
  ) {
    throw new Error("URL foto dokumentasi tidak valid.");
  }

  if (documentationId !== null) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT id FROM partner_documentations
       WHERE id = ? AND partner_id = ? LIMIT 1`,
      [documentationId, partnerId],
    );

    if (rows.length === 0) {
      throw new Error("Dokumentasi tidak ditemukan.");
    }

    // Edit dokumentasi hanya mengganti gambar.
    await db.execute(
      `UPDATE partner_documentations
       SET image_url = ?
       WHERE id = ? AND partner_id = ?`,
      [imageUrl, documentationId, partnerId],
    );
  } else {
    // Judul diisi otomatis karena tabel menyimpan kolom title.
    const [sortRows] = await db.execute<RowDataPacket[]>(
      `SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order
       FROM partner_documentations
       WHERE partner_id = ?`,
      [partnerId],
    );

    const nextOrder = Number(sortRows[0]?.next_order ?? 0);

await db.execute(
  `INSERT INTO partner_documentations
   (partner_id, title, description, image_url, sort_order, published)
   VALUES (?, '', NULL, ?, ?, 1)`,
  [partnerId, imageUrl, nextOrder],
);
  }

  refreshSite();
  revalidatePath("/admin/mitra");
  revalidatePath(`/admin/mitra/${partnerId}`);
}

export async function deletePartnerDocumentation(
  partnerId: number,
  documentationId: number,
): Promise<void> {
  await requireAdmin();

  await db.execute(
    `DELETE FROM partner_documentations
     WHERE id = ? AND partner_id = ?`,
    [documentationId, partnerId],
  );

  refreshSite();
  revalidatePath("/admin/mitra");
  revalidatePath(`/admin/mitra/${partnerId}`);
}


export async function saveGalleryPhoto(
  albumId: number,
  photoId: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  if (!Number.isInteger(albumId) || albumId < 1) {
    return { error: "Album galeri tidak valid." };
  }

  const [albumRows] = await db.execute<RowDataPacket[]>(
    "SELECT id, slug FROM gallery_albums WHERE id = ? LIMIT 1",
    [albumId],
  );

  const album = albumRows[0];

  if (!album) {
    return { error: "Album galeri tidak ditemukan." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const sortOrderRaw = String(formData.get("sortOrder") ?? "").trim();
  const sortOrder = sortOrderRaw === "" ? 0 : Number(sortOrderRaw);
  const published = formData.get("published") === "on";

  const fieldErrors: Record<string, string> = {};

  if (title.length > 255) {
    fieldErrors.title = "Judul foto maksimal 255 karakter.";
  }

  if (!imageUrl) {
    fieldErrors.imageUrl = "Foto wajib diunggah.";
  } else if (
    !imageUrl.startsWith("/") &&
    !/^https?:\/\/\S+$/i.test(imageUrl)
  ) {
    fieldErrors.imageUrl = "URL foto tidak valid.";
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    fieldErrors.sortOrder = "Urutan harus berupa angka bulat minimal 0.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Periksa kembali isian yang ditandai.",
      fieldErrors,
    };
  }

  if (photoId !== null) {
    if (!Number.isInteger(photoId) || photoId < 1) {
      return { error: "ID foto tidak valid." };
    }

    const [photoRows] = await db.execute<RowDataPacket[]>(
      `SELECT id
       FROM gallery_photos
       WHERE id = ? AND album_id = ?
       LIMIT 1`,
      [photoId, albumId],
    );

    if (photoRows.length === 0) {
      return { error: "Foto tidak ditemukan dalam album ini." };
    }

    await db.execute(
      `UPDATE gallery_photos
       SET title = ?, description = ?, image_url = ?,
           sort_order = ?, published = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND album_id = ?`,
      [
        title || null,
        description || null,
        imageUrl,
        sortOrder,
        published ? 1 : 0,
        photoId,
        albumId,
      ],
    );
  } else {
    await db.execute(
      `INSERT INTO gallery_photos
       (album_id, title, description, image_url, sort_order, published)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        albumId,
        title || null,
        description || null,
        imageUrl,
        sortOrder,
        published ? 1 : 0,
      ],
    );
  }

  refreshSite();
  revalidatePath("/galeri");
  revalidatePath(`/galeri/${album.slug}`);
  revalidatePath(`/admin/galeri/${albumId}`);

  return {
    ok: true,
    message: photoId === null
      ? "Foto berhasil ditambahkan."
      : "Foto berhasil diperbarui.",
  };
}

export async function deleteGalleryPhoto(
  albumId: number,
  photoId: number,
): Promise<void> {
  await requireAdmin();

  if (
    !Number.isInteger(albumId) ||
    albumId < 1 ||
    !Number.isInteger(photoId) ||
    photoId < 1
  ) {
    throw new Error("ID album atau foto tidak valid.");
  }

  const [albumRows] = await db.execute<RowDataPacket[]>(
    "SELECT id, slug FROM gallery_albums WHERE id = ? LIMIT 1",
    [albumId],
  );

  const album = albumRows[0];

  if (!album) {
    throw new Error("Album galeri tidak ditemukan.");
  }

  await db.execute(
    `DELETE FROM gallery_photos
     WHERE id = ? AND album_id = ?`,
    [photoId, albumId],
  );

  refreshSite();
  revalidatePath("/galeri");
  revalidatePath(`/galeri/${album.slug}`);
  revalidatePath(`/admin/galeri/${albumId}`);
}
