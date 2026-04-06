"use client";

import { useRole } from "@/components/RoleProvider";
import Navbar from "@/components/Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { role } = useRole();
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20 w-full max-w-7xl mx-auto px-6 py-8">{children}</main>
      <footer className="border-t border-moss-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-moss-800 tracking-tight">eHotels</span>
          <span className="text-xs text-moss-400">
            {role === "employee" ? "Employee Portal" : "Customer Portal"} &middot; CSI2132
          </span>
        </div>
      </footer>
    </div>
  );
}
