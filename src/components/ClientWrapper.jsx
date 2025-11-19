// src/components/ClientWrapper.jsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AppShell from "@/components/AppShell";

/**
 * ClientWrapper:
 * - Runs on the client so we can call usePathname()
 * - Decides whether to wrap children with AppShell (Navbar+Sidebar)
 *   or render children alone (for /login, /register, etc.)
 */

export default function ClientWrapper({ children }) {
  const pathname = usePathname() || "/";

  // Routes where we DON'T want the global chrome (Navbar + Sidebar)
  // Add any auth pages or landing pages here.
  const HIDE_LAYOUT_ROUTES = ["/login", "/register", "/forgot-password", "/auth/logout"];

  // If the pathname starts with any of the hide routes, do not wrap with AppShell
  const shouldHideLayout = HIDE_LAYOUT_ROUTES.some((r) => {
    // exact match or prefix match (for possible subroutes)
    return pathname === r || pathname.startsWith(r + "/");
  });

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  // Otherwise render AppShell (which includes Sidebar + Navbar + content wrapper)
  return <AppShell>{children}</AppShell>;
}
