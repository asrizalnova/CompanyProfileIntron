
"use client";

import { useState, useEffect, useRef } from "react";
import type {
  PartnerDocumentation,
  PartnerMember,
} from "@/lib/data";
import { ImageField } from "@/components/admin/ImageField";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import {
  deletePartnerDocumentation,
  deletePartnerMember,
  savePartnerDocumentation,
  savePartnerMember,
} from "@/app/admin/(panel)/actions";

type Props = {
  partnerId: number;
  members: PartnerMember[];
  documentations: PartnerDocumentation[];
};

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-batik";

const buttonPrimary =
  "rounded-xl bg-batik px-4 py-2 text-sm font-semibold text-white hover:opacity-90";

const buttonSecondary =
  "rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-mist";

function PublishedField({
  published,
}: {
  published: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        name="published"
        defaultChecked={published}
        className="h-4 w-4 accent-current"
      />
      Tampilkan di website
    </label>
  );
}

/**
 * Form tambah dan edit foto dokumentasi.
 * Setelah berhasil menyimpan, halaman dimuat ulang
 * agar preview upload kembali kosong dan daftar foto diperbarui.
 */
function DocumentationImageForm({
  partnerId,
  documentationId,
  initialImageUrl = "",
  onCancel,
}: {
  partnerId: number;
  documentationId: number | null;
  initialImageUrl?: string;
  onCancel?: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [error, setError] = useState("");

  useEffect(() => {
    setImageUrl(initialImageUrl);
  }, [initialImageUrl]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = formRef.current;
    if (!form) return;

    const input = form.querySelector<HTMLInputElement>(
      'input[name="imageUrl"]',
    );

    const url = input?.value.trim() ?? "";

    if (!url) {
      setError("Pilih gambar dan tunggu sampai proses upload selesai.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData(form);
      formData.set("imageUrl", url);

      await savePartnerDocumentation(
        partnerId,
        documentationId,
        formData,
      );

      // Muat ulang data setelah foto berhasil disimpan.
      // Preview upload akan kembali kosong.
      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan dokumentasi.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-line p-4"
    >
      <ImageField
        name="imageUrl"
        label="Foto dokumentasi *"
        initial={imageUrl}
        help="Pilih gambar dan tunggu hingga proses upload selesai."
      />

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-batik px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {submitting ? "Menyimpan..." : "Simpan Gambar"}
      </button>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="ml-2 rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50"
        >
          Batal
        </button>
      )}
    </form>
  );
}

export function PartnerContentEditor({
  partnerId,
  members,
  documentations,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    "members" | "documentation"
  >("members");

  const [editingMember, setEditingMember] = useState<number | null>(
    null,
  );

  const [editingDocumentation, setEditingDocumentation] = useState<
    number | null
  >(null);

  return (
    <section className="mt-8 rounded-2xl border border-line bg-white p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-ink">
          Konten Mitra
        </h2>

        <p className="mt-1 text-sm text-muted">
          Kelola data pengurus dan foto dokumentasi mitra ini.
        </p>
      </div>

      {/* TAB */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("members")}
          className={
            activeTab === "members"
              ? `${buttonPrimary} rounded-full`
              : `${buttonSecondary} rounded-full`
          }
        >
          Pengurus ({members.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("documentation")}
          className={
            activeTab === "documentation"
              ? `${buttonPrimary} rounded-full`
              : `${buttonSecondary} rounded-full`
          }
        >
          Dokumentasi ({documentations.length})
        </button>
      </div>

      {/* ============================= */}
      {/* CRUD PENGURUS */}
      {/* ============================= */}
      {activeTab === "members" && (
        <div className="space-y-6">
          {/* TAMBAH PENGURUS */}
          <div>
            <h3 className="mb-4 font-semibold text-ink">
              Tambah Pengurus
            </h3>

            <form
              action={savePartnerMember.bind(null, partnerId, null)}
              className="space-y-4 rounded-xl border border-line p-4"
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-ink">
                  Nama pengurus *
                </label>

                <input
                  name="name"
                  required
                  maxLength={255}
                  className={inputClass}
                  placeholder="Masukkan nama pengurus"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-ink">
                  Jabatan
                </label>

                <input
                  name="position"
                  maxLength={255}
                  className={inputClass}
                  placeholder="Contoh: Direktur"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-ink">
                  Urutan tampil
                </label>

                <input
                  type="number"
                  name="sortOrder"
                  min="0"
                  defaultValue="0"
                  className={inputClass}
                />
              </div>

              <PublishedField published={true} />

              <button type="submit" className={buttonPrimary}>
                Simpan Pengurus
              </button>
            </form>
          </div>

          {/* DAFTAR PENGURUS */}
          <div>
            <h3 className="mb-4 font-semibold text-ink">
              Daftar Pengurus
            </h3>

            {members.length === 0 ? (
              <p className="text-sm text-muted">
                Belum ada pengurus untuk mitra ini.
              </p>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <article
                    key={member.id}
                    className="rounded-xl border border-line p-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="h-14 w-14 rounded-full border border-line object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mist font-bold text-batik">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-ink">
                          {member.name}
                        </p>

                        <p className="text-sm text-muted">
                          {member.position || "Jabatan belum diisi"}
                        </p>

                        <p className="text-xs text-muted">
                          {member.published
                            ? "Ditampilkan di website"
                            : "Disembunyikan dari website"}
                        </p>
                      </div>

                      <button
                        type="button"
                        className={buttonSecondary}
                        onClick={() =>
                          setEditingMember(
                            editingMember === member.id
                              ? null
                              : member.id,
                          )
                        }
                      >
                        {editingMember === member.id ? "Tutup" : "Edit"}
                      </button>

                      <ConfirmForm
                        action={deletePartnerMember.bind(
                          null,
                          partnerId,
                          member.id,
                        )}
                        confirmText={`Hapus pengurus "${member.name}"?`}
                      >
                        Hapus
                      </ConfirmForm>
                    </div>

                    {/* EDIT PENGURUS */}
                    {editingMember === member.id && (
                      <form
                        action={savePartnerMember.bind(
                          null,
                          partnerId,
                          member.id,
                        )}
                        className="mt-5 space-y-4 border-t border-line pt-5"
                      >
                        <div>
                          <label className="mb-1 block text-sm font-medium text-ink">
                            Nama pengurus *
                          </label>

                          <input
                            name="name"
                            required
                            maxLength={255}
                            defaultValue={member.name}
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-ink">
                            Jabatan
                          </label>

                          <input
                            name="position"
                            maxLength={255}
                            defaultValue={member.position ?? ""}
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-ink">
                            Urutan tampil
                          </label>

                          <input
                            type="number"
                            name="sortOrder"
                            min="0"
                            defaultValue={member.sortOrder ?? 0}
                            className={inputClass}
                          />
                        </div>

                        <PublishedField
                          published={member.published}
                        />

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="submit"
                            className={buttonPrimary}
                          >
                            Simpan Perubahan
                          </button>

                          <button
                            type="button"
                            className={buttonSecondary}
                            onClick={() => setEditingMember(null)}
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================= */}
      {/* CRUD DOKUMENTASI */}
      {/* ============================= */}
      {activeTab === "documentation" && (
        <div className="space-y-6">
          {/* TAMBAH DOKUMENTASI */}
          <div>
            <h3 className="mb-4 font-semibold text-ink">
              Tambah Dokumentasi
            </h3>

            <DocumentationImageForm
              partnerId={partnerId}
              documentationId={null}
            />
          </div>

          {/* DAFTAR DOKUMENTASI */}
          <div>
            <h3 className="mb-4 font-semibold text-ink">
              Daftar Dokumentasi
            </h3>

            {documentations.length === 0 ? (
              <p className="text-sm text-muted">
                Belum ada foto dokumentasi untuk mitra ini.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {documentations.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-line"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt="Dokumentasi mitra"
                        className="aspect-[4/3] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center bg-mist text-sm text-muted">
                        Belum ada gambar
                      </div>
                    )}

                    <div className="space-y-3 p-3">
                      {editingDocumentation === item.id ? (
                        <DocumentationImageForm
                          key={`documentation-${item.id}`}
                          partnerId={partnerId}
                          documentationId={item.id}
                          initialImageUrl={item.imageUrl ?? ""}
                          onCancel={() =>
                            setEditingDocumentation(null)
                          }
                        />
                      ) : (
                        <button
                          type="button"
                          className={`${buttonSecondary} w-full`}
                          onClick={() =>
                            setEditingDocumentation(item.id)
                          }
                        >
                          Ganti Gambar
                        </button>
                      )}

                      <ConfirmForm
                        action={deletePartnerDocumentation.bind(
                          null,
                          partnerId,
                          item.id,
                        )}
                        confirmText="Hapus foto dokumentasi ini?"
                      >
                        Hapus Dokumentasi
                      </ConfirmForm>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <p className="mt-6 border-t border-line pt-4 text-xs text-muted">
        ID Mitra: {partnerId}
      </p>
    </section>
  );
}
