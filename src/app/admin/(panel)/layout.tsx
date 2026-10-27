import type { Metadata } from "next";
import type { RowDataPacket } from "mysql2";
import { Sidebar } from "@/components/admin/Sidebar";
import { db } from "@/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Panel admin", template: "%s | Panel admin" },
  robots: { index: false, follow: false },
};

type CountRow = RowDataPacket & { n: number };

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  const [rows] = await db.execute<CountRow[]>(
    "SELECT COUNT(*) AS n FROM messages WHERE is_read = 0",
  );

  const unread = Number(rows[0]?.n ?? 0);

  return (
    // Di mobile: layout normal (bisa discroll ke bawah).
    // Di desktop (md): dikunci setinggi layar dan overflow disembunyikan.
    <div className="min-h-screen bg-paper md:flex md:h-screen md:overflow-hidden">
      
      <Sidebar adminName={admin.name} unread={unread} />

      {/* Area Konten Utama */}
      <main
        id="konten-admin"
        className="min-w-0 flex-1 px-4 py-8 md:h-screen md:overflow-y-auto md:px-8 md:py-10"
      >
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
      
    </div>
  );
}