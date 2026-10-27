
"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProgramActivity } from "@/lib/data";
import {
  saveProgramActivity,
  deleteProgramActivity,
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
  programId: number;
  activities: ProgramActivity[];
};

export function ProgramActivitiesEditor({
  programId,
  activities,
}: Props) {
  return (
    <section className="mt-12 border-t border-line pt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Kegiatan Program</h2>
        <p className="mt-2 text-sm text-muted">
          Kelola bidang pekerjaan atau kegiatan yang ditampilkan
          pada halaman detail program.
        </p>
      </div>

      <ActivityForm
        key={`new-${programId}`}
        programId={programId}
        activity={null}
      />

      <div className="mt-8 space-y-5">
        {activities.length === 0 ? (
          <p className="rounded-sm border border-dashed border-line p-5 text-sm text-muted">
            Belum ada kegiatan. Tambahkan kegiatan melalui formulir di atas.
          </p>
        ) : (
          activities.map((activity) => (
            <ActivityForm
              key={activity.id}
              programId={programId}
              activity={activity}
            />
          ))
        )}
      </div>
    </section>
  );
}

function ActivityForm({
  programId,
  activity,
}: {
  programId: number;
  activity: ProgramActivity | null;
}) {
  const router = useRouter();
  const isNew = activity === null;
  const [editing, setEditing] = useState(isNew);
  const [formKey, setFormKey] = useState(0);

  const action = saveProgramActivity.bind(
    null,
    programId,
    activity?.id ?? null,
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
  }, [state.ok, state.message, isNew, router]);

  if (!isNew && !editing && activity) {
    return (
      <article className="rounded-sm border border-line p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {activity.imageUrl ? (
            <img
              src={activity.imageUrl}
              alt={activity.title}
              className="h-24 w-36 rounded-sm border border-line object-cover"
            />
          ) : (
            <div className="flex h-24 w-36 items-center justify-center rounded-sm border border-dashed border-line text-sm text-muted">
              Tanpa gambar
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold">{activity.title}</h3>
            <p className="mt-1 text-sm text-muted">
              Urutan: {activity.sortOrder} ·{" "}
              {activity.published
                ? "Tampil di situs"
                : "Disembunyikan"}
            </p>
            <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm text-muted">
              {activity.description || "Belum ada deskripsi."}
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
              action={deleteProgramActivity.bind(
                null,
                programId,
                activity.id,
              )}
              confirmText={`Hapus kegiatan "${activity.title}"? Tindakan ini tidak bisa dibatalkan.`}
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
          {isNew ? "Tambah Kegiatan" : `Edit: ${activity?.title}`}
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
          htmlFor={`activity-title-${activity?.id ?? "new"}`}
          className="mb-1.5 block text-sm font-medium"
        >
          Nama kegiatan *
        </label>
        <input
          id={`activity-title-${activity?.id ?? "new"}`}
          name="title"
          required
          maxLength={160}
          defaultValue={activity?.title ?? ""}
          className={inputCls}
          placeholder="Contoh: Pengelasan"
        />
        {state.fieldErrors?.title && (
          <p className="mt-1 text-sm text-danger">
            {state.fieldErrors.title}
          </p>
        )}
      </div>

      <ImageField
        key={`image-${activity?.id ?? "new"}-${formKey}`}
        name="imageUrl"
        label="Gambar kegiatan"
        initial={activity?.imageUrl ?? ""}
        help="PNG, JPG, WebP, atau GIF; maksimal 5 MB."
        error={state.fieldErrors?.imageUrl}
      />

      <div>
        <label
          htmlFor={`activity-description-${activity?.id ?? "new"}`}
          className="mb-1.5 block text-sm font-medium"
        >
          Deskripsi
        </label>
        <textarea
          id={`activity-description-${activity?.id ?? "new"}`}
          name="description"
          rows={4}
          defaultValue={activity?.description ?? ""}
          className={inputCls}
          placeholder="Jelaskan kegiatan atau bidang pekerjaan ini."
        />
      </div>

      <div>
        <label
          htmlFor={`activity-order-${activity?.id ?? "new"}`}
          className="mb-1.5 block text-sm font-medium"
        >
          Urutan tampilan
        </label>
        <input
          id={`activity-order-${activity?.id ?? "new"}`}
          type="number"
          name="sortOrder"
          min={0}
          step={1}
          defaultValue={activity?.sortOrder ?? 0}
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
          defaultChecked={activity?.published ?? true}
          className="size-4 accent-current"
        />
        Tampilkan kegiatan di halaman publik
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
              ? "Tambah kegiatan"
              : "Simpan kegiatan"}
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
