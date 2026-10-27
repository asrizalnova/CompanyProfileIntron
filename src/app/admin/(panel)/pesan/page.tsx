import type { RowDataPacket } from "mysql2";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { PageTitle } from "@/components/admin/PageTitle";
import { btnSmall } from "@/components/admin/styles";
import { db } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";
import { deleteMessage, markMessage } from "../actions";

export const metadata = { title: "Pesan masuk" };

type MessageRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  body: string;
  isRead: number | boolean;
  createdAt: number;
};

export default async function MessagesPage() {
  await requireAdmin();

  const [rows] = await db.execute<MessageRow[]>(
    `SELECT
       id,
       name,
       email,
       phone,
       subject,
       body,
       is_read AS isRead,
       created_at AS createdAt
     FROM messages
     ORDER BY created_at DESC, id DESC`,
  );

  return (
    <>
      <PageTitle
        title="Pesan masuk"
        description="Pesan dari formulir di halaman Kontak."
      />

      {rows.length === 0 ? (
        <p className="border border-dashed border-line bg-white p-10 text-center text-muted">
          Belum ada pesan. Pesan dari formulir kontak akan muncul di sini.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((m) => {
            const isRead = Boolean(m.isRead);

            return (
              <li key={m.id} className="border border-line bg-white">
                <details open={!isRead} className="group">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-5 py-4 hover:bg-mist">
                    {!isRead && (
                      <span className="rounded-full bg-kunyit px-2 py-0.5 text-xs font-bold text-ink">
                        Baru
                      </span>
                    )}

                    <span className={isRead ? "font-medium" : "font-bold"}>
                      {m.name}
                    </span>

                    <span className="text-muted">
                      {m.subject || "(tanpa subjek)"}
                    </span>

                    <span className="ml-auto text-sm text-muted">
                      {formatDateTime(m.createdAt)}
                    </span>
                  </summary>

                  <div className="border-t border-line px-5 py-5">
                    <dl className="grid gap-x-8 gap-y-1 text-[0.95rem] sm:grid-cols-[auto_1fr]">
                      <dt className="text-muted">Email</dt>
                      <dd>
                        <a
                          href={`mailto:${m.email}`}
                          className="text-batik-soft underline underline-offset-4"
                        >
                          {m.email}
                        </a>
                      </dd>

                      {m.phone && (
                        <>
                          <dt className="text-muted">Telepon</dt>
                          <dd>{m.phone}</dd>
                        </>
                      )}
                    </dl>

                    <p className="mt-4 max-w-2xl whitespace-pre-wrap leading-relaxed">
                      {m.body}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent(
                          `Re: ${m.subject || "Pesan dari website"}`,
                        )}`}
                        className={btnSmall}
                      >
                        Balas lewat email
                      </a>

                      {/* Tandai sudah/belum dibaca: aksi langsung, tanpa konfirmasi */}
                      <form action={markMessage.bind(null, m.id, !isRead)}>
                        <button type="submit" className={btnSmall}>
                          {isRead ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                        </button>
                      </form>

                      <ConfirmForm
                        action={deleteMessage.bind(null, m.id)}
                        confirmText={`Hapus pesan dari ${m.name}? Tindakan ini tidak bisa dibatalkan.`}
                      >
                        Hapus
                      </ConfirmForm>
                    </div>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}