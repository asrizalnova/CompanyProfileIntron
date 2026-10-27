export function PageTitle({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-ink">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-muted">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Notice({ kind = "ok", children }: { kind?: "ok" | "error"; children: React.ReactNode }) {
  return (
    <p
      role={kind === "error" ? "alert" : "status"}
      className={`mb-6 border-l-4 px-4 py-3 font-medium ${
        kind === "ok" ? "border-ok bg-ok/5 text-ok" : "border-danger bg-danger/5 text-danger"
      }`}
    >
      {children}
    </p>
  );
}
