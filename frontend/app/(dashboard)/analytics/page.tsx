import { AlertTriangle, BarChart3, FolderKanban, ListChecks, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { analytics } from "@/lib/demo-data";

export default function AnalyticsPage() {
  const maxFailure = Math.max(...analytics.failuresByProject.map((item) => item.failures));

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Review execution health, failure concentration, and recurring quality risks across projects." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Projects" value={analytics.totals.projects} helper="Owned workspaces" icon={FolderKanban} />
        <MetricCard label="Test cases" value={analytics.totals.testCases} helper="Tracked flows" icon={ListChecks} />
        <MetricCard label="Runs" value={analytics.totals.runs} helper="Total executions" icon={PlayCircle} />
        <MetricCard label="Pass rate" value={`${analytics.totals.passRate}%`} helper="Recent reliability" icon={BarChart3} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink">Failures by project</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.failuresByProject.map((item) => (
              <div key={item.project}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{item.project}</span>
                  <span className="text-slate-500">{item.failures}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-brand-600" style={{ width: `${(item.failures / maxFailure) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink">Common failure reasons</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.commonFailures.map((item) => (
              <div key={item.reason} className="flex items-center justify-between rounded-md border border-line p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-red-50 p-2 text-red-700">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <p className="font-semibold text-ink">{item.reason}</p>
                </div>
                <span className="text-sm font-semibold text-slate-500">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
