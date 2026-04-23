import { Clock, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, TableCell, TableHead } from "@/components/ui/data-table";
import { demoTestCases } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

const runs = [
  { id: "run-401", testCase: demoTestCases[1].name, project: "Northstar App", status: "passed", duration: "2.96s", browser: "firefox", environment: "local", started: "2026-04-23T05:00:00Z" },
  { id: "run-402", testCase: demoTestCases[2].name, project: "Docs Portal", status: "failed", duration: "3.15s", browser: "chromium", environment: "local", started: "2026-04-23T07:00:00Z" },
  { id: "run-403", testCase: demoTestCases[0].name, project: "Acme Marketing Site", status: "failed", duration: "2.21s", browser: "chromium", environment: "staging", started: "2026-04-22T09:00:00Z" },
];

export default function TestRunsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Test runs"
        description="Track execution history by project, test case, browser, environment, duration, and result."
        action={<Button><PlayCircle className="h-4 w-4" />Create run</Button>}
      />
      <Card>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-600">All projects</div>
          <div className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-600">All statuses</div>
          <div className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-600">All browsers</div>
          <div className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-600">
            <Clock className="h-4 w-4" />
            Last 7 days
          </div>
        </CardContent>
      </Card>
      <DataTable>
        <table className="w-full border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <TableHead>Run</TableHead>
              <TableHead>Test case</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead>Started</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {runs.map((run) => (
              <tr key={run.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs text-slate-500">{run.id}</TableCell>
                <TableCell className="font-semibold text-ink">{run.testCase}</TableCell>
                <TableCell className="text-slate-600">{run.project}</TableCell>
                <TableCell><Badge value={run.status} /></TableCell>
                <TableCell className="text-slate-700">{run.duration}</TableCell>
                <TableCell className="text-slate-700">{run.browser}</TableCell>
                <TableCell className="text-slate-700">{run.environment}</TableCell>
                <TableCell className="text-slate-500">{formatDate(run.started)}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}
