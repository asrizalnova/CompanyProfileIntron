
import { EntityForm } from "@/components/admin/EntityForm";
import { PageTitle } from "@/components/admin/PageTitle";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { toInitial } from "@/lib/initial-values";
import { settingsFields, settingsSections } from "@/lib/resources";
import { saveSettings } from "../actions";

export const metadata = {
  title: "Pengaturan situs",
};

export default async function SettingsPage() {
  await requireAdmin();

  const settings = await getSettings();

  return (
    <>
      <PageTitle
        title="Pengaturan situs"
        description="Identitas, halaman beranda, profil perusahaan, kontak, dan SEO."
      />

      <EntityForm
        action={saveSettings}
        sections={settingsSections}
        initial={toInitial(
          settingsFields,
          settings as unknown as Record<string, unknown>
        )}
        submitLabel="Simpan pengaturan"
      />
    </>
  );
}
