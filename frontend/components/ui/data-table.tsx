import { type ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function DataTable({ children }: { children: ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </Card>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</th>;
}

export function TableCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-4 py-4 text-sm ${className}`}>{children}</td>;
}
