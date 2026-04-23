import { Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, TableCell, TableHead } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { demoLogs } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Execution logs" description="Search step-level execution output, failure reasons, statuses, and project context." />
      <Card>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <div className="flex items-center gap-2 rounded-md border border-line px-3">
            <Search className="h-4 w-4 text-slate-400" />
            <Input className="border-0 px-0 focus:ring-0" placeholder="Search logs and failure reasons" />
          </div>
          <div className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-600">All severities</div>
          <div className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-600">All statuses</div>
        </CardContent>
      </Card>
      <DataTable>
        <table className="w-full border-collapse">
          <thead className="bg-slate-50">
            <tr>
              <TableHead>Timestamp</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Test case</TableHead>
              <TableHead>Message</TableHead>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {demoLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <TableCell className="text-slate-500">{formatDate(log.timestamp)}</TableCell>
                <TableCell><Badge value={log.severity} /></TableCell>
                <TableCell><Badge value={log.status} /></TableCell>
                <TableCell className="font-medium text-ink">{log.project}</TableCell>
                <TableCell className="text-slate-600">{log.testCase}</TableCell>
                <TableCell className="max-w-xl whitespace-normal text-slate-700">{log.message}</TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}
