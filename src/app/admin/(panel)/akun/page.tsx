import { AccountForm } from "@/components/admin/AccountForm";
import { PageTitle } from "@/components/admin/PageTitle";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Akun" };

export default async function AccountPage() {
  const admin = await requireAdmin();
  return (
    <>
      <PageTitle title="Akun" description="Ubah nama, email, atau password untuk masuk ke panel admin." />
      <AccountForm name={admin.name} email={admin.email} />
    </>
  );
}
