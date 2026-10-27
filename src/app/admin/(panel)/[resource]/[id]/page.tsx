
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { RowDataPacket } from "mysql2";
import { mapDatabaseRow } from "@/lib/data";
import type {
  GalleryPhoto,
  PartnerDocumentation,
  PartnerMember,
  ProgramActivity,
} from "@/lib/data";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { EntityForm } from "@/components/admin/EntityForm";
import { GalleryPhotosEditor } from "@/components/admin/GalleryPhotosEditor";
import { PageTitle } from "@/components/admin/PageTitle";
import { ProgramActivitiesEditor } from "@/components/admin/ProgramActivitiesEditor";
import { btnSecondary } from "@/components/admin/styles";
import { db } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { toInitial } from "@/lib/initial-values";
import { resources } from "@/lib/resources";
import { tables } from "@/lib/tables";
import {
  deleteResource,
  saveResource,
} from "../../actions";
import { PartnerContentEditor } from "@/components/admin/PartnerContentEditor";

type Props = {
  params: Promise<{ resource: string; id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { resource } = await params;
  const config = resources[resource];

  return {
    title: config ? `Ubah ${config.singular}` : "Ubah",
  };
}

export default async function EditResourcePage({ params }: Props) {
  const { resource, id: rawId } = await params;
  const config = resources[resource];
  const id = Number(rawId);

  if (
    !config ||
    !tables[resource] ||
    !Number.isInteger(id) ||
    id < 1
  ) {
    notFound();
  }

  await requireAdmin();

  const table = tables[resource];

  const [result] = await db.execute<RowDataPacket[]>(
    `SELECT * FROM \`${table.name}\` WHERE id = ? LIMIT 1`,
    [id],
  );

  const row = result[0]
    ? mapDatabaseRow<Record<string, unknown>>(result[0])
    : undefined;

  if (!row) notFound();

  const title = String(row[config.titleField] ?? "");
  const href = config.publicHref?.(row);

  // Data aktivitas program
  let activities: ProgramActivity[] = [];

  if (resource === "program") {
    const [activityRows] = await db.execute<RowDataPacket[]>(
      `SELECT *
       FROM program_activities
       WHERE program_id = ?
       ORDER BY sort_order ASC, id ASC`,
      [id],
    );

    activities = activityRows.map((activity) =>
      mapDatabaseRow<ProgramActivity>(activity),
    );
  }

  // Data anggota dan dokumentasi mitra
  let partnerMembers: PartnerMember[] = [];
  let partnerDocumentations: PartnerDocumentation[] = [];

  if (resource === "mitra") {
    const [memberResult, documentationResult] = await Promise.all([
      db.execute<RowDataPacket[]>(
        `SELECT *
         FROM partner_members
         WHERE partner_id = ?
         ORDER BY sort_order ASC, id ASC`,
        [id],
      ),
      db.execute<RowDataPacket[]>(
        `SELECT *
         FROM partner_documentations
         WHERE partner_id = ?
         ORDER BY sort_order ASC, id ASC`,
        [id],
      ),
    ]);

    partnerMembers = memberResult[0].map((item) =>
      mapDatabaseRow<PartnerMember>(item),
    );

    partnerDocumentations = documentationResult[0].map((item) =>
      mapDatabaseRow<PartnerDocumentation>(item),
    );
  }

  // Data foto galeri, termasuk foto yang belum dipublikasikan
  let galleryPhotos: GalleryPhoto[] = [];

  if (resource === "galeri") {
    const [photoRows] = await db.execute<RowDataPacket[]>(
      `SELECT *
       FROM gallery_photos
       WHERE album_id = ?
       ORDER BY sort_order ASC, id ASC`,
      [id],
    );

    galleryPhotos = photoRows.map((photo) =>
      mapDatabaseRow<GalleryPhoto>(photo),
    );
  }

  return (
    <>
      <p className="mb-4 text-sm">
        <Link
          href={`/admin/${resource}`}
          className="text-batik-soft underline underline-offset-4"
        >
          {config.label}
        </Link>
      </p>

      <PageTitle
        title={`Ubah ${config.singular}`}
        description={title}
        actions={
          <div className="flex flex-wrap gap-2">
            {href && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={btnSecondary}
              >
                Lihat di situs
              </a>
            )}

            <ConfirmForm
              action={deleteResource.bind(null, resource, id)}
              confirmText={`Hapus "${title}"? Tindakan ini tidak bisa dibatalkan.`}
            >
              Hapus {config.singular}
            </ConfirmForm>
          </div>
        }
      />

      <EntityForm
        action={saveResource.bind(null, resource, id)}
        sections={[{ title: "", fields: config.fields }]}
        initial={toInitial(config.fields, row)}
        submitLabel="Simpan perubahan"
        cancelHref={`/admin/${resource}`}
      />

      {resource === "program" && (
        <ProgramActivitiesEditor
          programId={id}
          activities={activities}
        />
      )}

      {resource === "mitra" && (
        <PartnerContentEditor
          partnerId={id}
          members={partnerMembers}
          documentations={partnerDocumentations}
        />
      )}

      {resource === "galeri" && (
        <GalleryPhotosEditor
          albumId={id}
          photos={galleryPhotos}
        />
      )}
    </>
  );
}
