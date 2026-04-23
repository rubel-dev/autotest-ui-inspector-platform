"use client";

import { Menu, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearSession, getStoredUser } from "@/lib/auth";

export function TopNav({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const user = getStoredUser();

  function logout() {
    clearSession();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-white/92 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onMenu} aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden h-10 min-w-80 items-center gap-2 rounded-md border border-line bg-slate-50 px-3 text-sm text-slate-500 md:flex">
          <Search className="h-4 w-4" />
          <span>Search projects, test cases, logs</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-ink">{user?.name ?? "QA Engineer"}</p>
          <p className="text-xs text-slate-500">{user?.email ?? "local workspace"}</p>
        </div>
        <Button variant="secondary" onClick={logout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
