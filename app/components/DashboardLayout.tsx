"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar";
import { AppSidebar } from "@/app/components/AppSidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { ADMIN_ROLES } from "@/utils/auth";

type DashboardLayoutProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

const DEFAULT_ALLOWED_ROLES = [ADMIN_ROLES.SUPER_ADMIN];

export default function DashboardLayout({
  children,
  allowedRoles = DEFAULT_ALLOWED_ROLES,
}: DashboardLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-14 border-b flex items-center px-4 bg-card">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-lg font-semibold">Admin Panel</h1>
            </header>
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
