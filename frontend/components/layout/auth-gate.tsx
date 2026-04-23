"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/ui/state";
import { getToken } from "@/lib/auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="p-6"><LoadingState label="Opening secure workspace" /></div>;
  }

  return children;
}
