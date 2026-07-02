"use client";

import { useAuth } from "@/lib/providers/central/auth-provider";
import { apiClient } from "@/lib/services/central/api-client";
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
    if (!apiClient.getToken()) {
      router.replace("/central/login");
      return;
    }

    if (!isLoading && !user) {
      router.replace("/central/login");
    }
  }, [user, isLoading, router]);

  if (!apiClient.getToken() || isLoading || !user) {
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