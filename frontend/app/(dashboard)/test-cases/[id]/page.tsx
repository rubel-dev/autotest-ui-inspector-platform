"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/state";
import { demoLogs, demoTestCases } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

const steps = [
  { order: 1, action: "navigate", target: "https://acme.test/pricing", expected: "Pricing page loads successfully" },
  { order: 2, action: "click", target: "button[data-plan='pro']", expected: "Signup route is opened" },
  { order: 3, action: "assert_visible", target: "form[data-testid='signup']", expected: "Signup form is visible" },
];

export default function TestCaseDetailPage() {
  const params = useParams<{ id: string }>();
  const testCase = demoTestCases.find((item) => item.id === params.id);
  if (!testCase) {
    return <EmptyState title="Test case not found" description="The selected test case is not available in this workspace." />;
  }

  return (
    <div className="space-y-6">
      <Link href="/test-cases" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" /> Back to test cases
      </Link>
      <PageHeader
        title={testCase.name}
        description={`${testCase.project} • ${testCase.steps} configured steps`}
        action={<Button><PlayCircle className="h-4 w-4" />Run test</Button>}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-ink">Steps</h2>
              <div className="flex gap-2">
                <Badge value={testCase.priority} />
                <Badge value={testCase.status} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {steps.slice(0, testCase.steps).map((step) => (
              <div key={step.order} className="grid gap-4 rounded-md border border-line p-4 md:grid-cols-[56px_140px_1fr]">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-sm font-bold text-brand-700">{step.order}</div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Action</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{step.action}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{step.target}</p>
                  <p className="mt-1 text-sm text-slate-500">{step.expected}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink">Recent run logs</h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoLogs.slice(0, 3).map((log) => (
              <div key={log.id} className="rounded-md border border-line p-3">
                <div className="flex items-center justify-between">
                  <Badge value={log.status} />
                  <span className="text-xs text-slate-500">{formatDate(log.timestamp)}</span>
                </div>
                <p className="mt-2 text-sm text-ink">{log.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
