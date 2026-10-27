/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { mapDatabaseRow } from "@/lib/data";
import {
  IconDown,
  IconEdit,
  IconTrash,
  IconUp,
} from "@/components/admin/ActionIcon";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { Notice, PageTitle } from "@/components/admin/PageTitle";
import { btnIcon, btnPrimary } from "@/components/admin/styles";
import { db } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { resources, type Column } from "@/lib/resources";
import { tables } from "@/lib/tables";
import { formatDate } from "@/lib/utils";
import { deleteResource, moveResource } from "../actions";


type Props = {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ ok?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resource } = await params;
  return { title: resources[resource]?.label ?? "Konten" };
}

const NOTICES: Record<string, string> = {
  ditambahkan: "Berhasil ditambahkan dan sudah tampil di situs.",
  diperbarui: "Perubahan tersimpan dan sudah tampil di situs.",
  dihapus: "Berhasil dihapus.",
};

function renderCell(col: Column, value: unknown) {
  if (col.kind === "boolean") {
    return value ? <span className="font-medium text-ok">Ya</span> : <span className="text-muted">Tidak</span>;
  }
  if (col.kind === "image") {
    return value ? (
      <img src={String(value)} alt="" className="h-10 w-14 rounded-sm border border-line object-cover" />
    ) : (
      <span className="text-muted">-</span>
    );
  }
  if (col.kind === "date") {
    return value instanceof Date ? formatDate(value) : <span className="text-muted">Draf</span>;
  }
  const text = value === null || value === undefined || value === "" ? "-" : String(value);
  return <span className="line-clamp-2">{text}</span>;
}

export default async function ResourceListPage({ params, searchParams }: Props) {
  const { resource } = await params;
  const config = resources[resource];
  if (!config) notFound();
  await requireAdmin();
  const { ok } = await searchParams;

  const table = tables[resource];

  const orderBy = config.orderable ? "sort_order ASC, id ASC" : "id DESC";

  const [result] = await db.query<RowDataPacket[]>(
    `SELECT * FROM \`${table.name}\` ORDER BY ${orderBy}`
  );

  const rows = result.map((row) =>
    mapDatabaseRow<Record<string, unknown>>(row)
  );

  return (
    <>
      <PageTitle
        title={config.label}
        description={config.description}
        actions={
          <Link href={`/admin/${resource}/baru`} className={btnPrimary}>
            Tambah {config.singular}
          </Link>
        }
      />
      {ok && NOTICES[ok] && <Notice>{NOTICES[ok]}</Notice>}

      {rows.length === 0 ? (
        <div className="border border-dashed border-line bg-white p-10 text-center">
          <p className="text-muted">{config.emptyText}</p>
          <Link href={`/admin/${resource}/baru`} className={`${btnPrimary} mt-5`}>
            Tambah {config.singular}
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[40rem] text-left text-[0.95rem]">
            <thead className="border-b border-line bg-mist text-sm">
              <tr>
                {config.columns.map((c) => (
                  <th key={c.name} scope="col" className="px-4 py-3 font-semibold">
                    {c.label}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row, index) => {
                const id = row.id as number;
                const title = String(row[config.titleField] ?? "");
                const href = config.publicHref?.(row);
                return (
                  <tr key={id} className="align-middle">
                    {config.columns.map((c) => (
                      <td key={c.name} className="max-w-[18rem] px-4 py-3">
                        {c.name === config.titleField ? (
                          <Link
                            href={`/admin/${resource}/${id}`}
                            className="font-semibold text-batik-soft underline-offset-4 hover:underline"
                          >
                            {renderCell(c, row[c.name])}
                          </Link>
                        ) : (
                          renderCell(c, row[c.name])
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
  {config.orderable && (
    <>
      <form action={moveResource.bind(null, resource, id, "up")}>
        <button
          type="submit"
          disabled={index === 0}
          aria-label={`Naikkan ${title}`}
          title={`Naikkan ${title}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition-colors hover:bg-blue-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-200 disabled:hover:text-slate-700"
        >
          <IconUp />
        </button>
      </form>
      <form action={moveResource.bind(null, resource, id, "down")}>
        <button
          type="submit"
          disabled={index === rows.length - 1}
          aria-label={`Turunkan ${title}`}
          title={`Turunkan ${title}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition-colors hover:bg-blue-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-200 disabled:hover:text-slate-700"
        >
          <IconDown />
        </button>
      </form>
    </>
  )}

  <Link
    href={`/admin/${resource}/${id}`}
    aria-label={`Ubah ${title}`}
    title={`Ubah ${title}`}
    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 transition-colors hover:bg-amber-400 hover:text-black"
  >
    <IconEdit />
  </Link>

  <ConfirmForm
    action={deleteResource.bind(null, resource, id)}
    confirmText={`"${title}" akan dihapus permanen dari daftar dan tidak bisa dikembalikan.`}
    title={`Hapus ${config.singular.toLowerCase()}?`}
    confirmLabel="Ya, hapus"
    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700 transition-colors hover:bg-red-600 hover:text-white"
  >
    <IconTrash />
    <span className="sr-only">Hapus {title}</span>
  </ConfirmForm>

  {href && (
    <a href={href} target="_blank" rel="noopener noreferrer" className="sr-only focus:not-sr-only">
      Lihat di situs
    </a>
  )}
</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}