"use client";

import Link from "next/link";
import { Activity, BarChart3, FolderKanban, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable, TableCell, TableHead } from "@/components/ui/data-table";
import { MetricCard } from "@/components/ui/metric-card";
import { analytics, demoLogs, demoTestCases } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality dashboard"
        description="A single workspace for inspecting UI surfaces, managing automated test coverage, and reviewing execution health."
        action={
          <Link className="inline-flex h-10 items-center justify-center rounded-md bg-brand-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-brand-700" href="/projects">
            Open projects
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Projects" value={analytics.totals.projects} helper="Active web properties" icon={FolderKanban} />
        <MetricCard label="Test cases" value={analytics.totals.testCases} helper="Reusable coverage assets" icon={PlayCircle} />
        <MetricCard label="Runs" value={analytics.totals.runs} helper="Execution history" icon={Activity} />
        <MetricCard label="Pass rate" value={`${analytics.totals.passRate}%`} helper="Across recent runs" icon={BarChart3} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink">Recent test cases</h2>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable>
              <table className="w-full border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    <TableHead>Name</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last run</TableHead>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {demoTestCases.map((testCase) => (
                    <tr key={testCase.id} className="hover:bg-slate-50">
                      <TableCell className="font-semibold text-ink">{testCase.name}</TableCell>
                      <TableCell className="text-slate-600">{testCase.project}</TableCell>
                      <TableCell><Badge value={testCase.status} /></TableCell>
                      <TableCell><Badge value={testCase.lastRun} /></TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataTable>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink">Latest logs</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {demoLogs.map((log) => (
              <div key={log.id} className="rounded-md border border-line p-3">
                <div className="flex items-center justify-between gap-3">
                  <Badge value={log.severity} />
                  <span className="text-xs text-slate-500">{formatDate(log.timestamp)}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-ink">{log.message}</p>
                <p className="mt-1 text-xs text-slate-500">{log.project}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
