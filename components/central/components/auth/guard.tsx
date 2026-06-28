"use client";

import { useAuth } from "@/lib/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function Guard({
  children,
  permissions,
}: {
  children: React.ReactNode;
  permissions?: string | string[];
}) {
  const { user, isLoading, hasPermission, isSuperAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/central/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    // You can render a loading spinner here
    return null;
  }

  if (permissions) {
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
    const canAccess = isSuperAdmin || requiredPermissions.every(hasPermission);

    if (!canAccess) {
      // You can render a "not authorized" page here
      return null;
    }
  }

  return <>{children}</>;
}