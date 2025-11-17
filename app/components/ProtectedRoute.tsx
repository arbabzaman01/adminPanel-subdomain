"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isLoggedIn } from "@/utils/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectPath = "/admin",
}: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const verifyAccess = () => {
      const allowed = isLoggedIn(allowedRoles);

      if (!allowed) {
        setIsAuthorized(false);
        router.replace(redirectPath);
        setHasCheckedAuth(true);
        return;
      }

      setIsAuthorized(true);
      setHasCheckedAuth(true);
    };

    verifyAccess();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "adminAuthToken") {
        verifyAccess();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [allowedRoles, redirectPath, router, pathname]);

  if (!hasCheckedAuth || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

