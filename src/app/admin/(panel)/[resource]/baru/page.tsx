import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EntityForm } from "@/components/admin/EntityForm";
import { PageTitle } from "@/components/admin/PageTitle";
import { requireAdmin } from "@/lib/auth";
import { toInitial } from "@/lib/initial-values";
import { resources } from "@/lib/resources";
import { saveResource } from "../../actions";

type Props = { params: Promise<{ resource: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resource } = await params;
  const config = resources[resource];
  return { title: config ? `Tambah ${config.singular}` : "Tambah" };
}

export default async function NewResourcePage({ params }: Props) {
  const { resource } = await params;
  const config = resources[resource];
  if (!config) notFound();
  await requireAdmin();

  const initial = toInitial(config.fields, null, { published: resource === "artikel" ? "" : "on" });

  return (
    <>
      <p className="mb-4 text-sm">
        <Link href={`/admin/${resource}`} className="text-batik-soft underline underline-offset-4">
          {config.label}
        </Link>
      </p>
      <PageTitle title={`Tambah ${config.singular}`} />
      <EntityForm
        action={saveResource.bind(null, resource, null)}
        sections={[{ title: "", fields: config.fields }]}
        initial={initial}
        submitLabel={`Simpan ${config.singular}`}
        cancelHref={`/admin/${resource}`}
      />
    </>
  );
}
