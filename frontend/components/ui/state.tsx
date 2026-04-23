import { AlertCircle, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoadingState({ label = "Loading workspace" }: { label?: string }) {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-line bg-white">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
        {label}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-line bg-white px-6 text-center">
      <Search className="mb-4 h-9 w-9 text-slate-400" />
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />
        <div>
          <h3 className="font-semibold">Request failed</h3>
          <p className="mt-1 text-sm">{message}</p>
          {onRetry ? (
            <Button className="mt-4" variant="secondary" onClick={onRetry}>
              Try again
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
