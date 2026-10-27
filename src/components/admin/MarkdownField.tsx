"use client";

import { useId, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { inputCls } from "./styles";

export function MarkdownField({
  name,
  label,
  initial,
  help,
  error,
}: {
  name: string;
  label: string;
  initial: string;
  help?: string;
  error?: string;
}) {
  const [value, setValue] = useState(initial);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const id = useId();

  const tabCls = (active: boolean) =>
    `px-4 py-2 text-sm font-medium border-b-2 ${
      active ? "border-batik text-ink" : "border-transparent text-muted hover:text-ink"
    }`;

  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <div className="mt-1.5 flex gap-1 border-b border-line" role="tablist" aria-label={`Mode ${label}`}>
        <button type="button" role="tab" aria-selected={tab === "write"} className={tabCls(tab === "write")} onClick={() => setTab("write")}>
          Tulis
        </button>
        <button type="button" role="tab" aria-selected={tab === "preview"} className={tabCls(tab === "preview")} onClick={() => setTab("preview")}>
          Pratinjau
        </button>
      </div>

      {/* Textarea tetap ada di DOM agar nilainya selalu ikut terkirim. */}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={14}
        hidden={tab !== "write"}
        aria-invalid={error ? true : undefined}
        className={`${inputCls} mt-0 rounded-t-none font-mono text-sm leading-relaxed`}
      />
      {tab === "preview" && (
        <div className="min-h-[18rem] border border-t-0 border-line bg-white p-5">
          {value.trim() ? (
            <div className="prose-doc">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-muted">Belum ada isi untuk dipratinjau.</p>
          )}
        </div>
      )}

      {error ? (
        <p role="alert" className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : (
        <p className="mt-1.5 text-sm text-muted">
          {help ? `${help} ` : ""}
          Format: ## Judul bagian, **tebal**, - daftar, [teks](alamat).
        </p>
      )}
    </div>
  );
}
