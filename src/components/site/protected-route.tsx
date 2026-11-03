"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { FullPageLoader } from "@/components/site/full-page-loader";

export function ProtectedRoute({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      const redirect = pathname ? `?redirect=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${redirect}`);
    }
  }, [isLoading, user, router, pathname]);

  if (isLoading) {
    return <FullPageLoader label={label ?? "Checking your library card…"} />;
  }

  if (!user) {
    return <FullPageLoader label="Taking you to the sign-in desk…" />;
  }

  return <>{children}</>;
}
