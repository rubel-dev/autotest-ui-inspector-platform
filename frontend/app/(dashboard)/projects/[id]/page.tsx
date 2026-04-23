"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, FileSearch, ListChecks, MousePointerClick, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { ErrorState, LoadingState } from "@/components/ui/state";
import { api } from "@/lib/api";
import { demoLogs, demoTestCases } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import type { ProjectListItem } from "@/types/api";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProject() {
    setLoading(true);
    setError("");
    try {
      setProject(await api.getProject(params.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load project.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProject();
  }, [params.id]);

  if (loading) return <LoadingState label="Loading project" />;
  if (error) return <ErrorState message={error} onRetry={loadProject} />;
  if (!project) return null;

  return (
    <div className="space-y-6">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>
      <PageHeader title={project.name} description={project.description ?? project.base_url} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Pages" value={project.page_count} helper="Inspected URLs" icon={FileSearch} />
        <MetricCard label="Elements" value={project.element_count} helper="Selectors stored" icon={MousePointerClick} />
        <MetricCard label="Test cases" value={project.test_case_count} helper="Coverage assets" icon={ListChecks} />
        <MetricCard label="Runs" value={project.run_count} helper="Execution history" icon={PlayCircle} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink">Related test cases</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoTestCases.slice(0, 3).map((testCase) => (
              <Link key={testCase.id} href={`/test-cases/${testCase.id}`} className="block rounded-md border border-line p-4 hover:bg-slate-50">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{testCase.name}</p>
                  <Badge value={testCase.lastRun} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{testCase.steps} steps • {testCase.priority} priority</p>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink">Recent activity</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoLogs.map((log) => (
              <div key={log.id} className="rounded-md border border-line p-4">
                <div className="flex items-center justify-between gap-3">
                  <Badge value={log.severity} />
                  <span className="text-xs text-slate-500">{formatDate(log.timestamp)}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-ink">{log.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
