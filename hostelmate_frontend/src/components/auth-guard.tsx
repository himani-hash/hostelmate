"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Role = "student" | "warden";

export function AuthGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authorized" | "error">("checking");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/signin");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/current-user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (cancelled) return;

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("info");
          router.replace("/signin");
          return;
        }

        if (!res.ok) {
          setErrorMsg("Unable to verify session. Please try again.");
          setStatus("error");
          return;
        }

        const user = await res.json();
        localStorage.setItem("info", JSON.stringify(user));

        if (allowedRoles && allowedRoles.length > 0) {
          const role = (user?.role || "").toLowerCase() as Role;
          if (!allowedRoles.includes(role)) {
            router.replace(role === "warden" ? "/warden-dashboard" : "/dashboard");
            return;
          }
        }

        setStatus("authorized");
      } catch {
        if (cancelled) return;
        setErrorMsg("Cannot reach server. Please check your connection.");
        setStatus("error");
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [router, allowedRoles]);

  if (status === "checking") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Checking session...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-background">
        <p className="text-sm text-destructive">{errorMsg}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-md bg-primary text-white text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
