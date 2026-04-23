import Link from "next/link";

export function AuthPanel({
  title,
  subtitle,
  switchLabel,
  switchHref,
  switchText,
  children,
}: {
  title: string;
  subtitle: string;
  switchLabel: string;
  switchHref: string;
  switchText: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-600 text-sm font-black text-white">
              AT
            </div>
            <div>
              <p className="font-bold text-ink">AutoTest</p>
              <p className="text-xs font-medium text-slate-500">UI Inspector Platform</p>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-ink">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-6 text-sm text-slate-500">
            {switchLabel}{" "}
            <Link className="font-semibold text-brand-700 hover:text-brand-600" href={switchHref}>
              {switchText}
            </Link>
          </p>
        </div>
      </section>
      <section className="hidden border-l border-line bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100 ring-1 ring-white/15">
            UI automation workspace
          </div>
          <h2 className="mt-8 max-w-xl text-5xl font-bold leading-tight">
            Inspect interfaces, organize test coverage, and track quality signals.
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            ["86", "Runs tracked"],
            ["82.6%", "Pass rate"],
            ["25", "Elements captured"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/8 p-4">
              <p className="text-2xl font-bold">{value}</p>
              <p className="mt-1 text-sm text-slate-300">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
