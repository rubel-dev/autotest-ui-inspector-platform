import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, TableCell, TableHead } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { demoTestCases } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

export default function TestCasesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Test cases" description="Organize reusable UI automation flows by project, priority, status, and recent execution health." />
      <Card>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
          <div className="flex items-center gap-2 rounded-md border border-line px-3">
            <Search className="h-4 w-4 text-slate-400" />
            <Input className="border-0 px-0 focus:ring-0" placeholder="Search test cases" />
          </div>
          <div className="flex items-center gap-2 rounded-md border border-line bg-white px-3 text-sm font-medium text-slate-600">
            <Filter className="h-4 w-4" />
            All projects
          </div>
          <div className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-600">All statuses</div>
        </CardContent>
      </Card>
      <DataTable>
        <table className="w-full border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <TableHead>Name</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Last run</TableHead>
              <TableHead>Updated</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {demoTestCases.map((testCase) => (
              <tr key={testCase.id} className="hover:bg-slate-50">
                <TableCell>
                  <Link href={`/test-cases/${testCase.id}`} className="font-semibold text-ink hover:text-brand-700">
                    {testCase.name}
                  </Link>
                </TableCell>
                <TableCell className="text-slate-600">{testCase.project}</TableCell>
                <TableCell><Badge value={testCase.priority} /></TableCell>
                <TableCell><Badge value={testCase.status} /></TableCell>
                <TableCell className="text-slate-700">{testCase.steps}</TableCell>
                <TableCell><Badge value={testCase.lastRun} /></TableCell>
                <TableCell className="text-slate-500">{formatDate(testCase.updatedAt)}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}
