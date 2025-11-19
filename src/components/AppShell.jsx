"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

/**
 * AppShell
 * Renders global Navbar + Sidebar once and passes state to them.
 * Use this in root layout to avoid duplicate rendering across pages.
 */
export default function AppShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#04131e] text-slate-200">
      {/* Sidebar (desktop + mobile drawer) */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Content area: padding accounts for sidebar width */}
      <div className={`${collapsed ? "md:pl-20" : "md:pl-64"} transition-all duration-300 ${mobileOpen ? "pointer-events-none" : ""}`}>
        <Navbar
          onOpenMobile={() => setMobileOpen(true)}
          notifications={[]} // if you want to pass initial notifications, do it here
          unreadCount={0}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Page content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
