import type { ReactNode } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";
import { ADMIN_ROLES } from "@/utils/auth";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardLayout allowedRoles={[ADMIN_ROLES.SUPER_ADMIN]}>
      {children}
    </DashboardLayout>
  );
}

