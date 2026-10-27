
import type { Field } from "./resources";
import { toDateInput } from "./utils";

/** Ubah satu baris database menjadi nilai string untuk mengisi form. */
export function toInitial(
  fields: Field[],
  row: Record<string, unknown> | null,
  newDefaults: Record<string, string> = {},
): Record<string, string> {
  const out: Record<string, string> = {};

  for (const f of fields) {
    const v = row ? row[f.name] : undefined;

    if (!row) {
      out[f.name] = newDefaults[f.name] ?? "";
    } else if (f.type === "boolean") {
      out[f.name] = v ? "on" : "";
    } else if (f.type === "date") {
      out[f.name] =
        v === null || v === undefined || v === ""
          ? ""
          : toDateInput(
              v instanceof Date ||
                typeof v === "string" ||
                typeof v === "number"
                ? v
                : "",
            );
    } else {
      out[f.name] =
        v === null || v === undefined ? "" : String(v);
    }
  }

  return out;
}
