import { cn } from "@/lib/utils";

const statusClasses: Record<string, string> = {
  passed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  error: "bg-red-50 text-red-700 ring-red-200",
  draft: "bg-amber-50 text-amber-700 ring-amber-200",
  high: "bg-orange-50 text-orange-700 ring-orange-200",
  critical: "bg-red-50 text-red-700 ring-red-200",
  medium: "bg-sky-50 text-sky-700 ring-sky-200",
  low: "bg-slate-50 text-slate-700 ring-slate-200",
  info: "bg-cyan-50 text-cyan-700 ring-cyan-200",
};

export function Badge({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1",
        statusClasses[value] ?? "bg-slate-50 text-slate-700 ring-slate-200",
        className,
      )}
    >
      {value}
    </span>
  );
}
