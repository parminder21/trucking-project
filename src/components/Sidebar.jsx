"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiChevronDown,
  FiChevronRight,
  FiChevronLeft,
  FiFileText,
  FiHome,
  FiList,
  FiTruck,
  FiUsers,
  FiMap,
  FiBox,
  FiUserCheck,
  FiDollarSign,
  FiSettings,
  FiLogOut,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";

/* -------------------------
   Navigation structure
   ------------------------- */
const NAV_STRUCTURE = [
  {
    heading: "",
    items: [{ id: "dashboard", label: "Dashboard", icon: <FiHome />, href: "/dashboard" }],
  },
  {
    heading: "Management & Controls",
    items: [
      {
        id: "invoice",
        label: "Invoice",
        icon: <FiFileText />,
        href: "/invoice/list",
        children: [
          { id: "invoice_new", label: "New Invoice", href: "/invoice/new" },
          { id: "invoice_list", label: "List Invoice", href: "/invoice/list" },
        ],
      },
      { id: "trips", label: "Trips", icon: <FiTruck />, href: "/trips" },
      { id: "suppliers", label: "Suppliers", icon: <FiUsers />, href: "/suppliers" },
      { id: "routes", label: "Routes", icon: <FiMap />, href: "/routes" },
      { id: "products", label: "Products", icon: <FiBox />, href: "/products" },
      { id: "drivers", label: "Drivers", icon: <FiUserCheck />, href: "/drivers" },
      { id: "vehicles", label: "Vehicles", icon: <FiTruck />, href: "/vehicles" },
      { id: "trailers", label: "Trailers", icon: <FiList />, href: "/trailers" },
      { id: "billto", label: "Bill To", icon: <FiDollarSign />, href: "/bill-to" },
      {
        id: "expenses",
        label: "Expenses",
        icon: <FiDollarSign />,
        href: "/expenses/list",
        children: [
          { id: "expense_category", label: "Expense Category", href: "/expenses/categories" },
          { id: "expense_list", label: "Expense", href: "/expenses/list" },
        ],
      },
    ],
  },
  {
    heading: "Others",
    items: [
      { id: "reports", label: "Reports", icon: <FiTrendingUp />, href: "/reports" },
      { id: "settings", label: "Settings", icon: <FiSettings />, href: "/settings" },
      { id: "logout", label: "Logout", icon: <FiLogOut />, href: "/auth/logout" },
    ],
  },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, currentRouteId }) {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState({
    invoice: false,
    expenses: false,
  });

  const toggleGroup = (id) =>
    setOpenGroups((p) => ({ ...p, [id]: !p[id] }));

  const ROW_HEIGHT = 44;

  const activeForItem = (item) => {
    if (item.href && (pathname === item.href || pathname.startsWith(item.href + "/"))) return true;
    if (currentRouteId === item.id) return true;
    if (item.children) {
      return item.children.some(
        (c) => pathname.startsWith(c.href) || currentRouteId === c.id
      );
    }
    return false;
  };

  function requestLogoutModal() {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-logout-modal"));
    }
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col bg-[#071228] text-slate-200 shadow-md transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-black font-bold"
              style={{ background: "linear-gradient(90deg,#FF7A1A,#FF9B4A)" }}
            >
              TS
            </div>

            {!collapsed && (
              <div>
                <div className="font-semibold">Trucking Solution</div>
                <div className="text-xs text-slate-400">Tenant Admin</div>
              </div>
            )}
          </div>

          <button
            className="p-2 rounded-md hover:bg-white/5 cursor-pointer hidden md:block"
            onClick={() => setCollapsed((s) => !s)}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <nav className="mt-2 flex-1 overflow-y-auto px-2 pb-6">
          {NAV_STRUCTURE.map((group) => (
            <div key={group.heading} className="mb-4 mt-2">
              {!collapsed && group.heading && (
                <div className="px-3 text-xs text-slate-400 uppercase font-semibold mb-2">
                  {group.heading}
                </div>
              )}

              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const active = activeForItem(item);
                  const hasChildren = !!item.children?.length;
                  const childrenCount = item.children?.length || 0;
                  const maxHeight = openGroups[item.id] ? `${childrenCount * ROW_HEIGHT}px` : "0px";
                  const isLogout = item.id === "logout";

                  return (
                    <div key={item.id} className="w-full">
                      <div
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer w-full
                          ${
                            active
                              ? "bg-orange-600/20 text-orange-300 border-l-4 border-orange-500"
                              : "text-slate-200"
                          }
                          hover:bg-white/6 hover:text-white`}
                        onClick={() => hasChildren && toggleGroup(item.id)}
                      >
                        <div className="w-8 flex items-center justify-center text-lg">
                          {item.icon}
                        </div>

                        {!collapsed ? (
                          <>
                            <div className="flex-1 text-sm font-medium">
                              {isLogout ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    requestLogoutModal();
                                  }}
                                  className="block w-full text-left"
                                >
                                  {item.label}
                                </button>
                              ) : item.href && !hasChildren ? (
                                <Link href={item.href} className="block w-full">
                                  {item.label}
                                </Link>
                              ) : (
                                <span>{item.label}</span>
                              )}
                            </div>

                            {hasChildren && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleGroup(item.id);
                                }}
                                className="flex items-center gap-2 text-xs text-slate-300 hover:text-white"
                              >
                                <span className="text-xs bg-white/6 px-2 py-0.5 rounded">
                                  +{childrenCount}
                                </span>
                                {openGroups[item.id] ? <FiChevronDown /> : <FiChevronRight />}
                              </button>
                            )}
                          </>
                        ) : null}
                      </div>

                      {hasChildren && (
                        <div
                          className="ml-11 mt-1 overflow-hidden transition-[max-height] duration-300 ease-in-out"
                          style={{ maxHeight }}
                        >
                          <div className="flex flex-col gap-1 py-1">
                            {item.children.map((sub) => {
                              const subActive = pathname.startsWith(sub.href);
                              return (
                                <Link
                                  key={sub.id}
                                  href={sub.href}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors w-full
                                    ${
                                      subActive
                                        ? "bg-orange-600/20 text-orange-300 border-l-4 border-orange-500 pl-2"
                                        : "text-slate-300 pl-2"
                                    }
                                    hover:bg-white/6 hover:text-white`}
                                >
                                  <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                                  <span className="truncate">{sub.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-6 text-xs text-slate-400">
          <div className="border-t border-white/5 pt-4">v1.0.0</div>
          {!collapsed && <div className="mt-2">Robato Systems Pty. Ltd.</div>}
        </div>
      </aside>

      {/* MOBILE SIDEBAR */}
      <div
        className={`md:hidden fixed inset-0 z-50 transform transition duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />

        <div className="relative w-72 h-screen bg-[#071228] p-4 text-slate-200 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-black font-bold"
                style={{ background: "linear-gradient(90deg,#FF7A1A,#FF9B4A)" }}
              >
                TS
              </div>
              <div>
                <div className="font-semibold">Trucking Solution</div>
                <div className="text-xs text-slate-400">Tenant Admin</div>
              </div>
            </div>

            <button onClick={() => setMobileOpen(false)} className="p-2 cursor-pointer">
              <FiX />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {NAV_STRUCTURE.map((group) => (
              <div key={group.heading} className="mb-3">
                <div className="text-xs text-slate-400 uppercase px-2">{group.heading}</div>

                {group.items.map((item) => {
                  const hasChildren = !!item.children?.length;
                  const mobileActive =
                    pathname.startsWith(item.href) ||
                    item.children?.some((c) => pathname.startsWith(c.href));

                  const isLogout = item.id === "logout";

                  return (
                    <div key={item.id}>
                      <div className="flex items-center justify-between">
                        {isLogout ? (
                          <button
                            onClick={() => {
                              setMobileOpen(false);
                              requestLogoutModal();
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded w-full transition-colors
                              ${
                                mobileActive
                                  ? "bg-orange-600/20 text-orange-300 border-l-4 border-orange-500 pl-2"
                                  : "text-slate-200"
                              }
                              hover:bg-white/6 hover:text-white text-left`}
                          >
                            <div className="w-6">{item.icon}</div>
                            <div className="text-sm font-medium">{item.label}</div>
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded w-full transition-colors
                              ${
                                mobileActive
                                  ? "bg-orange-600/20 text-orange-300 border-l-4 border-orange-500 pl-2"
                                  : "text-slate-200"
                              }
                              hover:bg-white/6 hover:text-white`}
                          >
                            <div className="w-6">{item.icon}</div>
                            <div className="text-sm font-medium">{item.label}</div>
                          </Link>
                        )}

                        {hasChildren && (
                          <button
                            onClick={() =>
                              setOpenGroups((p) => ({ ...p, [item.id]: !p[item.id] }))
                            }
                            className="p-2 text-slate-300"
                          >
                            {openGroups[item.id] ? <FiChevronDown /> : <FiChevronRight />}
                          </button>
                        )}
                      </div>

                      {hasChildren && openGroups[item.id] && (
                        <div className="ml-8 mt-1 flex flex-col gap-1">
                          {item.children.map((sub) => {
                            const subActive = pathname.startsWith(sub.href);
                            return (
                              <Link
                                key={sub.id}
                                href={sub.href}
                                onClick={() => setMobileOpen(false)}
                                className={`px-3 py-2 rounded hover:bg-white/5 text-sm ${
                                  subActive ? "text-orange-300 bg-orange-600/10" : "text-slate-300"
                                }`}
                              >
                                {sub.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
