"use client";

import { ShieldCheck, UserRound } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getStoredUser } from "@/lib/auth";

export default function SettingsPage() {
  const user = getStoredUser();

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Review account identity, role, and local API connection details." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink">Profile</h2>
          </CardHeader>
          <CardContent className="flex items-start gap-4">
            <div className="rounded-md bg-brand-50 p-3 text-brand-700">
              <UserRound className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold text-ink">{user?.name ?? "QA Engineer"}</p>
              <p className="mt-1 text-sm text-slate-500">{user?.email ?? "No email loaded"}</p>
              <div className="mt-3">
                <Badge value={user?.role ?? "user"} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink">Security</h2>
          </CardHeader>
          <CardContent className="flex items-start gap-4">
            <div className="rounded-md bg-emerald-50 p-3 text-emerald-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold text-ink">JWT session</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                API requests use a bearer token stored in the browser session utility and enforced again by the backend.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
