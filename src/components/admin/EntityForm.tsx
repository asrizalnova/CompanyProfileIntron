
"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { FormState } from "@/app/admin/(panel)/actions";
import type { Field, SettingsSection } from "@/lib/resources";
import { ImageField } from "./ImageField";
import { MarkdownField } from "./MarkdownField";
import { btnPrimary, btnSecondary, inputCls } from "./styles";
import { PdfField } from "@/components/admin/PdfField";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  sections: SettingsSection[];
  initial: Record<string, string>;
  submitLabel: string;
  cancelHref?: string;
};

export function EntityForm({
  action,
  sections,
  initial,
  submitLabel,
  cancelHref,
}: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  const errors = state.fieldErrors ?? {};
  const value = (name: string) => state.values?.[name] ?? initial[name] ?? "";

  // Pilihan jenis berkas, khusus untuk menu Unduh Berkas.
  const isDownloadResource = sections.some((section) =>
    section.fields.some((field) => field.name === "sourceType"),
  );

  const [sourceType, setSourceType] = useState(
    value("sourceType") || "pdf",
  );

  return (
    <form action={formAction} noValidate className="space-y-10">
      {state.error && (
        <div
          role="alert"
          className="border-l-4 border-danger bg-danger/5 px-4 py-3 text-danger"
        >
          <p className="font-semibold">{state.error}</p>
          {Object.values(errors).length > 0 && (
            <ul className="mt-1 list-disc pl-5 text-sm">
              {Object.values(errors).map((message, index) => (
                <li key={`${index}-${message}`}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {state.ok && state.message && (
        <p
          role="status"
          className="border-l-4 border-ok bg-ok/5 px-4 py-3 font-medium text-ok"
        >
          {state.message}
        </p>
      )}

      {sections.map((section) => (
        <fieldset key={section.title || "main"} className="min-w-0">
          {section.title && (
            <legend className="mb-1 font-display text-xl font-semibold text-batik">
              {section.title}
            </legend>
          )}

          {section.description && (
            <p className="mb-4 text-sm text-muted">{section.description}</p>
          )}

          <div
            className={`grid gap-5 md:grid-cols-2 ${
              section.title ? "mt-4" : ""
            }`}
          >
            {section.fields.map((field) => {
              // Sembunyikan kolom yang tidak sesuai dengan jenis berkas.
              if (
                isDownloadResource &&
                field.name === "fileUrl" &&
                sourceType !== "pdf"
              ) {
                return null;
              }

              if (
                isDownloadResource &&
                field.name === "externalUrl" &&
                sourceType !== "link"
              ) {
                return null;
              }

              return (
                <div
                  key={field.name}
                  className={field.half ? "" : "md:col-span-2"}
                >
                  <FieldInput
                    field={field}
                    value={value(field.name)}
                    error={errors[field.name]}
                    documentTitle={value("title")}
                    onSourceTypeChange={
                      isDownloadResource && field.name === "sourceType"
                        ? setSourceType
                        : undefined
                    }
                  />
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-3 border-t border-line bg-paper/95 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? "Menyimpan" : submitLabel}
        </button>

        {cancelHref && (
          <Link href={cancelHref} className={btnSecondary}>
            Batal
          </Link>
        )}
      </div>
    </form>
  );
}

function FieldInput({
  field,
  value,
  error,
  documentTitle,
  onSourceTypeChange,
}: {
  field: Field;
  value: string;
  error?: string;
  documentTitle?: string;
  onSourceTypeChange?: (value: string) => void;
}) {
  const id = `f-${field.name}`;

  const describedBy =
    [
      error ? `${id}-error` : null,
      field.help ? `${id}-help` : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  if (field.type === "image") {
    return (
      <ImageField
        name={field.name}
        label={field.label}
        initial={value}
        help={field.help}
        error={error}
      />
    );
  }

  if (field.type === "file") {
    return (
      <PdfField
        name={field.name}
        label={field.label}
        initial={value}
        documentTitle={documentTitle}
        help={field.help}
        error={error}
      />
    );
  }

  if (field.type === "markdown") {
    return (
      <MarkdownField
        name={field.name}
        label={field.label}
        initial={value}
        help={field.help}
        error={error}
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name={field.name}
            defaultChecked={
              value === "on" || value === "1" || value === "true"
            }
            aria-describedby={describedBy}
            className="mt-1 h-5 w-5 accent-batik"
          />

          <span>
            <span className="font-medium">{field.label}</span>

            {field.help && (
              <span
                id={`${id}-help`}
                className="block text-sm text-muted"
              >
                {field.help}
              </span>
            )}
          </span>
        </label>

        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="mt-1.5 text-sm text-danger"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  const common = {
    id,
    name: field.name,
    defaultValue: value,
    required: field.required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: inputCls,
    placeholder: field.placeholder,
  } as const;

  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {field.label}
        {field.required && <span className="text-danger"> *</span>}
      </label>

      {field.type === "select" ? (
        <select
          {...common}
          onChange={
            onSourceTypeChange
              ? (event) => onSourceTypeChange(event.target.value)
              : undefined
          }
        >
          <option value="">Pilih {field.label}</option>

          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea {...common} rows={field.rows ?? 4} />
      ) : field.type === "number" ? (
        <input {...common} type="number" inputMode="numeric" step={1} />
      ) : field.type === "date" ? (
        <input {...common} type="date" />
      ) : (
        <input
          {...common}
          type={
            field.type === "email"
              ? "email"
              : field.type === "url"
                ? "url"
                : "text"
          }
          autoComplete="off"
        />
      )}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-sm text-danger"
        >
          {error}
        </p>
      ) : (
        field.help && (
          <p id={`${id}-help`} className="mt-1.5 text-sm text-muted">
            {field.help}
          </p>
        )
      )}
    </div>
  );
}
