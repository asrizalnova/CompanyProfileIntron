import Link from "next/link";
import type { RowDataPacket } from "mysql2";
import { PageTitle } from "@/components/admin/PageTitle";
import { btnPrimary, btnSecondary } from "@/components/admin/styles";
import { db } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { resources } from "@/lib/resources";
import { tables } from "@/lib/tables";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Ringkasan" };

type CountRow = RowDataPacket & { n: number };

type MessageRow = RowDataPacket & {
  id: number;
  name: string;
  subject: string | null;
  body: string;
  createdAt: Date;
};

type ResourceTotal = {
  key: string;
  label: string;
  total: number;
};

const GROUPS: {
  title: string;
  keys: string[];
}[] = [
  {
    title: "Konten Situs",
    keys: ["program", "artikel", "tim", "statistik", "testimoni"],
  },
  {
    title: "Mitra dan Dokumentasi",
    keys: ["mitra", "dokumentasi_partner", "tim_partner"],
  },
  {
    title: "Pendaftaran dan Berkas",
    keys: ["pendaftaran", "unduh_berkas", "berkas"],
  },
];

function getGroup(key: string): number {
  const index = GROUPS.findIndex((group) => group.keys.includes(key));
  return index === -1 ? GROUPS.length : index;
}

export default async function DashboardPage() {
  const admin = await requireAdmin();

  const resourceKeys = Object.keys(resources).filter(
    (key) => Boolean(tables[key]),
  );

  const totals: ResourceTotal[] = await Promise.all(
    resourceKeys.map(async (key) => {
      const table = tables[key];
      const [rows] = await db.execute<CountRow[]>(
        `SELECT COUNT(*) AS n FROM \`${table.name}\``,
      );
      return {
        key,
        label: resources[key].label,
        total: Number(rows[0]?.n ?? 0),
      };
    }),
  );

  totals.sort((a, b) => {
    const groupDifference = getGroup(a.key) - getGroup(b.key);
    if (groupDifference !== 0) return groupDifference;
    return a.label.localeCompare(b.label, "id");
  });

  const [unread] = await db.execute<MessageRow[]>(
    `SELECT id, name, subject, body, created_at AS createdAt
     FROM messages
     WHERE is_read = 0
     ORDER BY created_at DESC, id DESC
     LIMIT 5`,
  );

  const totalKonten = totals.reduce((sum, item) => sum + item.total, 0);

  const groupedTotals = GROUPS.map((group, index) => ({
    ...group,
    items: totals.filter((item) => getGroup(item.key) === index),
  })).filter((group) => group.items.length > 0);

  const otherItems = totals.filter(
    (item) => getGroup(item.key) === GROUPS.length,
  );

  return (
    <div className="space-y-10 pb-12">
      <PageTitle
        title={`Halo, ${admin.name}`}
        description="Ringkasan pengelolaan situs Intron Global Indonesia. Kelola konten, mitra, pendaftaran, dan informasi lainnya dari panel ini."
        actions={
          <div className="flex flex-wrap gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={btnSecondary}
            >
              Lihat situs
            </a>
            <Link href="/admin/pengaturan" className={btnPrimary}>
              Pengaturan situs
            </Link>
          </div>
        }
      />

      {/* SECTION 1: RINGKASAN ANGKA */}
      <section aria-labelledby="h-ringkasan">
        <h2 id="h-ringkasan" className="text-lg font-bold text-ink mb-4">
          Ringkasan
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Kartu Total Konten */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <p className="text-sm font-medium text-muted">Total data konten</p>
            <p className="mt-3 font-display text-4xl font-extrabold text-batik">
              {totalKonten}
            </p>
            <p className="mt-2 text-xs text-muted">
              Akumulasi data dari seluruh resource yang terhubung ke database.
            </p>
          </div>

          {/* Kartu Pesan Belum Dibaca */}
          <Link
            href="/admin/pesan"
            className="group rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-batik/30 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted">Pesan belum dibaca</p>
                <p className="mt-3 font-display text-4xl font-extrabold text-batik">
                  {unread.length}
                  {unread.length === 5 ? "+" : ""}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mist text-batik transition-colors group-hover:bg-kunyit group-hover:text-ink">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted">
              {unread.length === 0
                ? "Tidak ada pesan baru saat ini."
                : "Klik untuk melihat pesan terbaru."}
            </p>
          </Link>
        </div>
      </section>

      {/* SECTION 2: PENGELOLAAN KONTEN */}
      <section aria-labelledby="h-konten">
        <div className="mb-6">
          <h2 id="h-konten" className="text-lg font-bold text-ink">
            Pengelolaan Konten
          </h2>
          <p className="mt-1 text-sm text-muted">
            Pilih bagian yang ingin kamu kelola.
          </p>
        </div>

        <div className="space-y-8">
          {groupedTotals.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-batik-soft">
                {group.title}
              </h3>

              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={`/admin/${item.key}`}
                      className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-batik/30 hover:shadow-lg"
                    >
                      <div>
                        <span className="font-display text-3xl font-extrabold text-batik group-hover:text-batik-soft transition-colors">
                          {item.total}
                        </span>
                        <span className="mt-2 block font-bold text-ink">
                          {item.label}
                        </span>
                      </div>
                      <span className="mt-4 flex items-center text-xs font-semibold text-muted group-hover:text-batik transition-colors">
                        Kelola data <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {otherItems.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-batik-soft">
                Lainnya
              </h3>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {otherItems.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={`/admin/${item.key}`}
                      className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-batik/30 hover:shadow-lg"
                    >
                      <div>
                        <span className="font-display text-3xl font-extrabold text-batik group-hover:text-batik-soft transition-colors">
                          {item.total}
                        </span>
                        <span className="mt-2 block font-bold text-ink">
                          {item.label}
                        </span>
                      </div>
                      <span className="mt-4 flex items-center text-xs font-semibold text-muted group-hover:text-batik transition-colors">
                        Kelola data <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: PESAN BELUM DIBACA */}
      <section aria-labelledby="h-pesan">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="h-pesan" className="text-lg font-bold text-ink">
            Pesan Belum Dibaca
          </h2>
          <Link
            href="/admin/pesan"
            className="text-sm font-semibold text-batik-soft underline underline-offset-4 hover:text-ink transition-colors"
          >
            Lihat semua pesan
          </Link>
        </div>

        {unread.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center">
            <p className="text-muted">Tidak ada pesan baru saat ini.</p>
          </div>
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm divide-y divide-line/60">
            {unread.map((message) => (
              <li key={message.id}>
                <Link
                  href="/admin/pesan"
                  className="group block p-5 transition-colors hover:bg-mist/50"
                >
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="font-bold text-ink group-hover:text-batik-soft transition-colors">
                      {message.name}
                    </span>
                    <span className="text-xs font-medium text-muted">
                      {formatDateTime(message.createdAt)}
                    </span>
                  </div>
                  
                  {message.subject && (
                    <span className="text-sm font-semibold text-batik-wash block mb-1">
                      {message.subject}
                    </span>
                  )}
                  
                  <p className="text-sm text-muted line-clamp-1">
                    {message.body}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}