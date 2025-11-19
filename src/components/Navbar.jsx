"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiPlus,
  FiX,
  FiChevronLeft,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

/* Premium Navbar (Topbar) - exported as default */
export default function Navbar({
  onOpenMobile,
  notifications = [],
  unreadCount = 0,
  collapsed,
  setCollapsed,
}) {
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifMobileOpen, setNotifMobileOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // logout modal state
  const [logoutOpen, setLogoutOpen] = useState(false);
  const confirmBtnRef = useRef(null);

  const notifRef = useRef(null);
  const quickRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 768);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  
  // listen for external requests to open the logout modal (e.g. from Sidebar)
  useEffect(() => {
    function handleOpenLogoutEvent() {
      openLogoutModal();
    }
    if (typeof window !== "undefined") {
      window.addEventListener("open-logout-modal", handleOpenLogoutEvent);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("open-logout-modal", handleOpenLogoutEvent);
      }
    };
  }, []); // run once


  const QUICK_ACTIONS = [
    { id: "create_trip", label: "Create Trip", href: "/dashboard/trips/new" },
    { id: "create_invoice", label: "Create Invoice", href: "/dashboard/invoice/new" },
    { id: "view_trips", label: "View Trips", href: "/dashboard/trips" },
  ];

  // outside click & escape handlers
  useEffect(() => {
    function onDocClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target)) setQuickOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setNotifMobileOpen(false);
        setQuickOpen(false);
        setProfileOpen(false);
        setSearchOpen(false);
        setMobileSearchOpen(false);
        // close logout modal on escape
        if (logoutOpen) setLogoutOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [logoutOpen]);

  const [localUnread, setLocalUnread] = useState(
    unreadCount || notifications?.length || 0
  );
  useEffect(() => setLocalUnread(unreadCount || notifications?.length || 0), [
    unreadCount,
    notifications,
  ]);

  function openNotif() {
    if (isMobile) {
      setNotifMobileOpen((s) => !s);
      setNotifOpen(false);
      if (localUnread > 0) setLocalUnread(0);
      return;
    }
    setNotifOpen((s) => !s);
    setQuickOpen(false);
    setProfileOpen(false);
    if (localUnread > 0) setLocalUnread(0);
  }

  function toggleQuick() {
    setQuickOpen((s) => !s);
    setNotifOpen(false);
    setProfileOpen(false);
  }
  function toggleProfile() {
    setProfileOpen((s) => !s);
    setNotifOpen(false);
    setQuickOpen(false);
  }

  // Logout modal helpers
  function openLogoutModal() {
    setProfileOpen(false); // close profile dropdown
    setLogoutOpen(true);
    // focus confirm button next tick
    setTimeout(() => confirmBtnRef.current?.focus(), 50);
  }
  function closeLogoutModal() {
    setLogoutOpen(false);
  }
  function confirmLogout() {
    // navigate to logout route (server will handle clearing session / cookie)
    // If you use client-side sign-out, replace this with the appropriate call.
    router.push("/auth/logout");
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#071829]/70 to-transparent backdrop-blur-sm border-b border-white/6">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              onClick={onOpenMobile}
              className="md:hidden p-2 rounded-lg text-slate-200 hover:bg-white/5 transition cursor-pointer"
              aria-label="Open menu"
              title="Open menu"
            >
              <FiMenu size={18} />
            </button>

            {/* Premium circular toggle */}
            <button
              onClick={() => setCollapsed((s) => !s)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#FF7A1A] to-[#FF9B4A] shadow-lg hover:scale-[1.03] transition-transform cursor-pointer"
            >
              <FiChevronLeft
                className="text-white transition-transform duration-300"
                style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)" }}
                size={18}
              />
            </button>

            {/* Title */}
            <div className="text-slate-100 font-semibold hidden sm:inline-block">Overview</div>

            {/* Desktop animated search */}
            <div ref={searchRef} className="hidden md:flex items-center ml-4">
              <div
                className={`flex items-center bg-white/6 rounded-full px-2 py-1 transition-all duration-300 ${
                  searchOpen ? "ring-2 ring-orange-500/30 backdrop-blur-sm scale-100" : "scale-100"
                }`}
              >
                <button
                  onClick={() => {
                    setSearchOpen(true);
                    setMobileSearchOpen(false);
                    setTimeout(() => {
                      const el = document.getElementById("topbar-search-input");
                      if (el) el.focus();
                    }, 40);
                  }}
                  className="p-2 rounded-full hover:bg-white/8 transition mr-2 cursor-pointer"
                  aria-label="Open search"
                >
                  <FiSearch className="text-slate-200" />
                </button>

                <input
                  id="topbar-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search trips, drivers, invoices..."
                  className={`bg-transparent placeholder:text-slate-400 text-sm focus:outline-none transition-all duration-300 ${
                    searchOpen ? "w-64 opacity-100" : "w-0 opacity-0 pl-0"
                  }`}
                  onFocus={() => setSearchOpen(true)}
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Compact stats (hide on small) */}
            <div className="hidden lg:flex items-center gap-4 text-slate-300">
              <div className="text-center">
                <div className="text-xs">Active Trips</div>
                <div className="text-lg font-bold text-orange-400">124</div>
              </div>
              <div className="text-center">
                <div className="text-xs">Delivered</div>
                <div className="text-lg font-bold text-emerald-400">89</div>
              </div>
            </div>

            {/* Mobile search icon */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="p-2 rounded-md hover:bg-white/5 transition cursor-pointer"
                aria-label="Open search"
              >
                <FiSearch size={18} className="text-slate-200" />
              </button>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={openNotif}
                className="relative p-2 rounded-md bg-[#0f1724] hover:bg-white/5 transition flex items-center justify-center cursor-pointer"
                aria-haspopup="true"
                aria-expanded={notifOpen || notifMobileOpen}
                aria-label="Notifications"
                title="Notifications"
              >
                <FiBell className="text-slate-200" />
                {localUnread > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-amber-400 text-black rounded-full px-1.5 py-0.5 font-semibold">
                    {localUnread}
                  </span>
                )}
              </button>

              {/* Desktop dropdown */}
              <div
                className={`hidden md:block absolute right-0 mt-2 w-[340px] max-h-[420px] bg-[#071829] border border-white/6 rounded-lg shadow-2xl overflow-hidden transform transition-all duration-250 origin-top-right z-50 ${
                  notifOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
                style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
              >
                <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between">
                  <div className="font-semibold text-sm">Notifications</div>
                  <button
                    onClick={() => {
                      setLocalUnread(0);
                      setNotifOpen(false);
                    }}
                    className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="p-2 max-h-[340px] overflow-auto">
                  {notifications && notifications.length ? (
                    notifications.map((n) => (
                      <div key={n.id} className="flex items-start gap-3 px-3 py-2 rounded hover:bg-white/2 transition cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5b7] to-[#06b6d4] flex items-center justify-center text-white text-sm font-semibold">
                          {String((n.text || "N").trim()).slice(0, 1)}
                        </div>
                        <div className="flex-1 text-sm">
                          <div className="text-slate-200">{n.text}</div>
                          <div className="text-xs text-slate-400 mt-1">{n.time || "just now"}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 text-sm px-3 py-4">No notifications</div>
                  )}
                </div>

                <div className="p-3 border-t border-white/6">
                  <Link href="/dashboard/notifications" className="block text-center text-sm text-orange-300 hover:underline cursor-pointer">
                    View all notifications
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick actions + */}
            <div className="relative" ref={quickRef}>
              <button
                onClick={toggleQuick}
                className="p-2 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 shadow-md text-white hover:scale-[1.03] transition cursor-pointer"
                aria-haspopup="true"
                aria-expanded={quickOpen}
                aria-label="Quick actions"
                title="Quick actions"
              >
                <FiPlus />
              </button>

              <div
                className={`absolute right-0 mt-2 w-52 bg-[#071829] border border-white/6 rounded-lg shadow-2xl overflow-hidden transform transition-all duration-200 origin-top-right z-50 ${
                  quickOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="p-2">
                  {QUICK_ACTIONS.map((a) => (
                    <Link key={a.id} href={a.href} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 transition text-sm cursor-pointer">
                      <span className="w-8 h-8 rounded-md bg-white/6 flex items-center justify-center text-xs text-white">+</span>
                      <div className="flex-1">
                        <div className="text-slate-200">{a.label}</div>
                        <div className="text-xs text-slate-400">Quick shortcut</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-white/5 transition cursor-pointer"
                aria-haspopup="true"
                aria-expanded={profileOpen}
                title="Profile"
              >
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm text-white">A</div>
                <div className="hidden md:flex flex-col text-sm">
                  <span className="font-medium text-slate-100">Admin</span>
                  <span className="text-xs text-slate-400">Tenant Admin</span>
                </div>
              </button>

              <div
                className={`absolute right-0 mt-2 w-44 bg-[#071829] border border-white/6 rounded-lg shadow-2xl overflow-hidden transform transition-all duration-200 origin-top-right z-50 ${
                  profileOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="p-2">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-md cursor-pointer transition"
                  >
                    <FiUser className="text-blue-400 text-base" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-md cursor-pointer transition"
                  >
                    <FiSettings className="text-emerald-400 text-base" />
                    <span>Settings</span>
                  </Link>

                  <div className="border-t border-white/10 my-2" />

                  {/* <-- IMPORTANT: button opens the logout confirmation modal --> */}
                  <button
                    type="button"
                    onClick={openLogoutModal}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-white/5 rounded-md cursor-pointer transition"
                  >
                    <FiLogOut className="text-rose-400 text-base" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile notifications modal (compact) */}
      <div
        className={`md:hidden fixed inset-0 z-50 flex items-start pt-20 justify-center transition-all duration-200 ${
          notifMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setNotifMobileOpen(false)} />
        <div className="relative w-full px-4">
          <div className="mx-auto max-w-md bg-[#071829] rounded-lg p-3 shadow-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-slate-100">Notifications</div>
              <button
                onClick={() => {
                  setLocalUnread(0);
                  setNotifMobileOpen(false);
                }}
                className="text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                Mark all read
              </button>
            </div>

            <div className="max-h-80 overflow-auto">
              {notifications && notifications.length ? (
                notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 px-2 py-2 rounded hover:bg-white/2 transition cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5b7] to-[#06b6d4] flex items-center justify-center text-white text-sm font-semibold">
                      {String((n.text || "N").trim()).slice(0, 1)}
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="text-slate-200">{n.text}</div>
                      <div className="text-xs text-slate-400 mt-1">{n.time || "just now"}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-sm px-3 py-4">No notifications</div>
              )}
            </div>

            <div className="mt-3 flex justify-end">
              <Link href="/dashboard/notifications" className="text-sm text-orange-300 hover:underline cursor-pointer">
                View all
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile full-screen search overlay */}
      <div
        className={`md:hidden fixed inset-0 z-50 flex items-start pt-20 justify-center transition-all duration-200 ${
          mobileSearchOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSearchOpen(false)} />
        <div className="relative w-full px-4">
          <div className="bg-[#071829] rounded-lg p-3 shadow-xl mx-auto max-w-md">
            <div className="flex items-center gap-2">
              <FiSearch className="text-slate-300" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trips, drivers, invoices..."
                className="bg-transparent flex-1 text-sm placeholder:text-slate-400 focus:outline-none"
                autoFocus
              />
              <button onClick={() => setMobileSearchOpen(false)} className="p-2 cursor-pointer">
                <FiX className="text-slate-300" />
              </button>
            </div>
            <div className="mt-3 text-sm text-slate-400">Try: "Invoice 1002", "Trip R. Singh"</div>
          </div>
        </div>
      </div>

      {/* -------------------------
          Logout confirmation modal
          ------------------------- */}
      <div
        className={`fixed inset-0 z-60 flex items-center justify-center transition-opacity ${
          logoutOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!logoutOpen}
        onClick={(e) => {
          // close when clicking overlay (but not when clicking modal)
          if (e.target === e.currentTarget) closeLogoutModal();
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
          className={`relative w-full max-w-sm mx-auto bg-[#071829] border border-white/6 rounded-lg p-4 z-50 shadow-2xl transform transition-transform ${
            logoutOpen ? "translate-y-0 scale-100" : "translate-y-2 scale-95"
          }`}
        >
          <h3 id="logout-modal-title" className="text-lg font-semibold text-slate-100 mb-2">
            Confirm logout
          </h3>
          <p className="text-sm text-slate-400 mb-4">Are you sure you want to logout? You will be signed out of the dashboard.</p>

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={closeLogoutModal}
              className="px-3 py-2 rounded-md bg-white/6 hover:bg-white/8 text-sm text-slate-200 transition"
            >
              Cancel
            </button>
            <button
              ref={confirmBtnRef}
              onClick={confirmLogout}
              className="px-3 py-2 rounded-md bg-rose-500 hover:bg-rose-600 text-sm text-white transition"
            >
              Yes, logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
