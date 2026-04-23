"use client";

import { useState } from "react";
import { AuthGate } from "@/components/layout/auth-gate";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGate>
      <div className="min-h-screen lg:flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0 flex-1">
          <TopNav onMenu={() => setSidebarOpen(true)} />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">{children}</main>
        </div>
      </div>
    </AuthGate>
  );
}
