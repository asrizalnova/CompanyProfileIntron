
"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { GalleryPhoto } from "@/lib/data";
import {
  saveGalleryPhoto,
  deleteGalleryPhoto,
} from "@/app/admin/(panel)/actions";
import type { FormState } from "@/app/admin/(panel)/actions";
import { ImageField } from "@/components/admin/ImageField";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import {
  btnPrimary,
  btnSecondary,
  inputCls,
} from "@/components/admin/styles";

type Props = {
  albumId: number;
  photos: GalleryPhoto[];
};

export function GalleryPhotosEditor({ albumId, photos }: Props) {
  return (
    <section className="mt-12 border-t border-line pt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Foto Album</h2>
        <p className="mt-2 text-sm text-muted">
          Tambahkan dan kelola banyak foto untuk album ini.
          Foto yang diterbitkan akan tampil di halaman Galeri.
        </p>
      </div>

      <GalleryPhotoForm
        key={`new-${albumId}`}
        albumId={albumId}
        photo={null}
      />

      <div className="mt-8 space-y-5">
        {photos.length === 0 ? (
          <p className="rounded-sm border border-dashed border-line p-5 text-sm text-muted">
            Belum ada foto dalam album ini. Tambahkan foto melalui
            formulir di atas.
          </p>
        ) : (
          photos.map((photo) => (
            <GalleryPhotoForm
              key={photo.id}
              albumId={albumId}
              photo={photo}
            />
          ))
        )}
      </div>
    </section>
  );
}

function GalleryPhotoForm({
  albumId,
  photo,
}: {
  albumId: number;
  photo: GalleryPhoto | null;
}) {
  const router = useRouter();
  const isNew = photo === null;
  const [editing, setEditing] = useState(isNew);
  const [formKey, setFormKey] = useState(0);

  const action = saveGalleryPhoto.bind(
    null,
    albumId,
    photo?.id ?? null,
  );

  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      router.refresh();

      if (isNew) {
        setFormKey((key) => key + 1);
      } else {
        setEditing(false);
      }
    }
  }, [state.ok, isNew, router]);

  if (!isNew && !editing && photo) {
    return (
      <article className="rounded-sm border border-line p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <img
            src={photo.imageUrl}
            alt={photo.title || "Foto galeri"}
            className="h-28 w-40 rounded-sm border border-line object-cover"
          />

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold">
              {photo.title || "Tanpa judul"}
            </h3>

            <p className="mt-1 text-sm text-muted">
              Urutan: {photo.sortOrder} ·{" "}
              {photo.published ? "Tampil di situs" : "Disembunyikan"}
            </p>

            <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm text-muted">
              {photo.description || "Belum ada deskripsi."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={btnSecondary}
              onClick={() => setEditing(true)}
            >
              Edit
            </button>

            <ConfirmForm
              action={deleteGalleryPhoto.bind(
                null,
                albumId,
                photo.id,
              )}
              confirmText={`Hapus foto "${photo.title || "Tanpa judul"}"? Catatan foto akan dihapus dari album.`}
            >
              Hapus
            </ConfirmForm>
          </div>
        </div>
      </article>
    );
  }

  return (
    <form
      key={formKey}
      action={formAction}
      className="space-y-5 rounded-sm border border-line p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold">
          {isNew ? "Tambah Foto" : `Edit: ${photo?.title || "Foto"}`}
        </h3>

        {!isNew && (
          <button
            type="button"
            className={btnSecondary}
            onClick={() => setEditing(false)}
          >
            Batal
          </button>
        )}
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      {state.ok && (
        <p role="status" className="text-sm text-green-700">
          {state.message}
        </p>
      )}

      <div>
        <label
          htmlFor={`gallery-title-${photo?.id ?? "new"}`}
          className="mb-1.5 block text-sm font-medium"
        >
          Judul foto
        </label>
        <input
          id={`gallery-title-${photo?.id ?? "new"}`}
          name="title"
          maxLength={255}
          defaultValue={photo?.title ?? ""}
          className={inputCls}
          placeholder="Contoh: Kegiatan pelatihan bahasa"
        />
        {state.fieldErrors?.title && (
          <p className="mt-1 text-sm text-danger">
            {state.fieldErrors.title}
          </p>
        )}
      </div>

      <ImageField
        key={`gallery-image-${photo?.id ?? "new"}-${formKey}`}
        name="imageUrl"
        label="Foto *"
        initial={photo?.imageUrl ?? ""}
        help="PNG, JPG, WebP, atau GIF; maksimal 5 MB."
        error={state.fieldErrors?.imageUrl}
      />

      <div>
        <label
          htmlFor={`gallery-description-${photo?.id ?? "new"}`}
          className="mb-1.5 block text-sm font-medium"
        >
          Deskripsi
        </label>
        <textarea
          id={`gallery-description-${photo?.id ?? "new"}`}
          name="description"
          rows={3}
          defaultValue={photo?.description ?? ""}
          className={inputCls}
          placeholder="Deskripsi foto (opsional)"
        />
      </div>

      <div>
        <label
          htmlFor={`gallery-order-${photo?.id ?? "new"}`}
          className="mb-1.5 block text-sm font-medium"
        >
          Urutan tampilan
        </label>
        <input
          id={`gallery-order-${photo?.id ?? "new"}`}
          type="number"
          name="sortOrder"
          min={0}
          step={1}
          defaultValue={photo?.sortOrder ?? 0}
          className={inputCls}
        />
        {state.fieldErrors?.sortOrder && (
          <p className="mt-1 text-sm text-danger">
            {state.fieldErrors.sortOrder}
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={photo?.published ?? true}
          className="size-4 accent-current"
        />
        Tampilkan foto di halaman publik
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className={btnPrimary}
        >
          {pending
            ? "Menyimpan..."
            : isNew
              ? "Tambah foto"
              : "Simpan foto"}
        </button>

        {isNew && (
          <button
            type="reset"
            className={btnSecondary}
            disabled={pending}
          >
            Reset
          </button>
        )}
      </div>
    </form>
  );
}
