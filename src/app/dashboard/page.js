"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FiDownload, FiClock, FiUserCheck, FiDroplet } from "react-icons/fi";

/* -------------------------
   Sample / fallback datasets
   ------------------------- */
const areaData = [
  { day: "Mon", trips: 30, revenue: 4200 },
  { day: "Tue", trips: 42, revenue: 5200 },
  { day: "Wed", trips: 36, revenue: 4800 },
  { day: "Thu", trips: 52, revenue: 6200 },
  { day: "Fri", trips: 44, revenue: 5800 },
  { day: "Sat", trips: 28, revenue: 3400 },
  { day: "Sun", trips: 18, revenue: 2200 },
];

const stackedBarData = [
  { day: "Mon", inTransit: 12, delivered: 10, delayed: 6 },
  { day: "Tue", inTransit: 16, delivered: 18, delayed: 8 },
  { day: "Wed", inTransit: 14, delivered: 12, delayed: 10 },
  { day: "Thu", inTransit: 20, delivered: 22, delayed: 10 },
  { day: "Fri", inTransit: 18, delivered: 20, delayed: 6 },
  { day: "Sat", inTransit: 10, delivered: 12, delayed: 6 },
  { day: "Sun", inTransit: 6, delivered: 8, delayed: 4 },
];

const donutData = [
  { name: "Delivered", value: 55, color: "#10B981" },
  { name: "In Transit", value: 25, color: "#FB923C" },
  { name: "Delayed", value: 12, color: "#FBBF24" },
  { name: "Cancelled", value: 8, color: "#94A3B8" },
];

const sparkData = [
  { x: 1, v: 2 },
  { x: 2, v: 3 },
  { x: 3, v: 4 },
  { x: 4, v: 3.5 },
  { x: 5, v: 5 },
  { x: 6, v: 4.2 },
  { x: 7, v: 5.1 },
];

/* sample tables */
const topVehicles = [
  { id: "TR-1001", model: "Volvo FH16", km: 124000, trips: 420, utilization: 92 },
  { id: "TR-1002", model: "Scania R450", km: 98000, trips: 390, utilization: 88 },
  { id: "TR-1003", model: "Mahindra Bolero", km: 72000, trips: 312, utilization: 76 },
  { id: "TR-1004", model: "Tata Prima", km: 133000, trips: 450, utilization: 95 },
];

const pendingInvoices = [
  { id: "INV-1009", client: "Cremica Foods", amount: 12000, due: "2025-11-18", status: "Unpaid" },
  { id: "INV-1010", client: "Heti Logistics", amount: 5600, due: "2025-11-20", status: "Partial" },
  { id: "INV-1011", client: "BluePharm", amount: 22500, due: "2025-11-22", status: "Unpaid" },
];

/* -------------------------
   Helper: fetch with fallback
   ------------------------- */
async function fetchWithFallback(url, fallback, timeout = 3000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error("bad response");
    return await res.json();
  } catch (e) {
    return fallback;
  }
}

/* -------------------------
   Small components
   ------------------------- */
function KPI({ title, value, diff, sub, children }) {
  return (
    <div className="bg-gradient-to-b from-[#071829] to-[#041627] p-4 rounded-2xl flex flex-col gap-3 shadow-lg border border-white/6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-slate-400">{title}</div>
          <div className="text-2xl font-bold text-white truncate">{value}</div>
          {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
        </div>
        <div className={`text-sm font-semibold ${diff?.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>
          {diff}
        </div>
      </div>
      {children && <div className="h-8">{children}</div>}
    </div>
  );
}

function Sparkline({ data, color = "#ff8a2b" }) {
  return (
    <ResponsiveContainer width="100%" height={28}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <Area dataKey="v" stroke={color} strokeWidth={2} fill="url(#spark)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* -------------------------
   Main Page Component
   ------------------------- */
export default function DashboardPage() {
  const pathname = usePathname() || "/dashboard";
  const [notifications, setNotifications] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const notifFallback = [
      { id: 1, text: "New trip created by R. Singh", time: "2m" },
      { id: 2, text: "Invoice #1002 paid", time: "1h" },
      { id: 3, text: "Vehicle TR-1004 due for service", time: "3h" },
    ];
    const qaFallback = [
      { id: "view_trips", label: "View all trips" },
      { id: "create_trip", label: "Create trip" },
    ];

    fetchWithFallback("/api/notifications", notifFallback).then((data) => setNotifications(data));
    fetchWithFallback("/api/quick-actions", qaFallback).then((data) => setQuickActions(data));
  }, []);

  async function performQuickAction(actionId) {
    setLoadingAction(true);
    try {
      const res = await fetch(`/api/quick-actions/${actionId}`, { method: "POST" });
      if (!res.ok) await new Promise((r) => setTimeout(r, 600));
      else await res.json();
    } catch (e) {
      await new Promise((r) => setTimeout(r, 600));
    } finally {
      setLoadingAction(false);
    }
  }

  const totalRevenue = areaData.reduce((s, i) => s + (i.revenue || 0), 0);
  const totalTrips = areaData.reduce((s, i) => s + (i.trips || 0), 0);
  const avgDeliveryTime = 28; // mock
  const utilizationPct = Math.round((topVehicles.reduce((s, v) => s + v.utilization, 0) / topVehicles.length) || 0);

  // Additional KPI values (mock)
  const bestDriver = "R. Singh";
  const driverTrips = 142;
  const fuelEfficiency = 5.6; // km/L

  return (
    <div className="min-h-screen bg-[#04131e] text-slate-200">
      <div className="pl-0 md:pl-0 lg:pl-0 transition-all duration-300">
        <main className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Overview</h1>
              <div className="text-sm text-slate-400 mt-1">A snapshot of your fleet & operations</div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-[#0B1620] px-3 py-2 rounded-md hover:bg-white/5 transition cursor-pointer">
                <FiDownload /> <span className="text-sm">Export</span>
              </button>
              <div className="text-xs text-slate-400">Updated: <span className="text-slate-200 font-semibold">Just now</span></div>
            </div>
          </div>

          {/* KPIs */}
          {/* changed grid breakpoints so 6 cards in single row on large screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <KPI title="Active Trips" value={totalTrips} diff="+6%" sub="Last 7 days">
              <Sparkline data={sparkData} color="#ff8a2b" />
            </KPI>

            <KPI title="Revenue (7d)" value={`₹${totalRevenue.toLocaleString()}`} diff="+12%" sub="Estimated">
              <Sparkline data={areaData.map((d) => ({ v: d.revenue / 1000 }))} color="#10B981" />
            </KPI>

            <KPI title="Avg Delivery (mins)" value={`${avgDeliveryTime}m`} diff="-2%" sub="Lower is better">
              <div className="flex items-center gap-2">
                <FiClock className="text-slate-300" />
                <div className="text-xs text-slate-400">Target 30m</div>
              </div>
            </KPI>

            <KPI title="Fleet Utilization" value={`${utilizationPct}%`} diff="+3%" sub="Avg across fleet">
              <div className="w-full h-3 bg-white/4 rounded-full overflow-hidden">
                <div className="h-3 rounded-full" style={{ width: `${utilizationPct}%`, background: "linear-gradient(90deg,#FF7A1A,#FF9B4A)" }} />
              </div>
            </KPI>

            <KPI title="Top Driver" value={bestDriver} diff="+15 Trips" sub={`${driverTrips} Trips`}>
              <div className="flex items-center gap-2 text-orange-400 text-sm">
                <FiUserCheck /> <span>Best Performer</span>
              </div>
            </KPI>

            <KPI title="Fuel Efficiency" value={`${fuelEfficiency} km/L`} diff="+0.4" sub="Fleet average">
              <div className="flex items-center gap-2 text-slate-300">
                <FiDroplet /> <span className="text-xs text-slate-400">Improving</span>
              </div>
            </KPI>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[#071829] rounded-2xl p-4 shadow-lg border border-white/6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-slate-400">Trips & Revenue</div>
                    <div className="text-lg font-semibold text-white">Last 7 days</div>
                  </div>
                  <div className="text-xs text-slate-400">Daily breakdown</div>
                </div>

                <div style={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData} margin={{ top: 6, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#FF8A2B" stopOpacity={0.36} />
                          <stop offset="100%" stopColor="#FF8A2B" stopOpacity={0.03} />
                        </linearGradient>
                        <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={0.28} />
                          <stop offset="100%" stopColor="#10B981" stopOpacity={0.03} />
                        </linearGradient>
                      </defs>

                      <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="#8b99a6" />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} stroke="#8b99a6" />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} stroke="#8b99a6" />
                      <Tooltip contentStyle={{ background: "#071829", border: "none" }} />

                      <Area yAxisId="left" dataKey="trips" stroke="#ff8a2b" strokeWidth={2} fill="url(#g1)" />
                      <Area yAxisId="right" dataKey="revenue" stroke="#10B981" strokeWidth={2} fill="url(#g2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#071829] rounded-2xl p-4 shadow-lg border border-white/6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-slate-400">Delivery Status (stacked)</div>
                    <div className="text-lg font-semibold text-white">This week</div>
                  </div>
                  <div className="text-xs text-slate-400">By day</div>
                </div>

                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stackedBarData}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="#8b99a6" />
                      <YAxis axisLine={false} tickLine={false} stroke="#8b99a6" />
                      <Tooltip contentStyle={{ background: "#071829", border: "none" }} />
                      <Bar dataKey="delivered" stackId="a" fill="#10B981" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="inTransit" stackId="a" fill="#FB923C" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="delayed" stackId="a" fill="#FBBF24" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#071829] rounded-2xl p-4 shadow-lg border border-white/6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-slate-400">Trip Status</div>
                    <div className="text-lg font-semibold text-white">Distribution</div>
                  </div>

                  <div className="text-xs text-slate-400">Overview</div>
                </div>

                <div className="flex items-center gap-4">
                  <div style={{ width: 140, height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie dataKey="value" data={donutData} innerRadius={44} outerRadius={60} paddingAngle={2}>
                          {donutData.map((d) => (
                            <Cell key={d.name} fill={d.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="text-sm text-slate-200">
                    {donutData.map((d) => (
                      <div key={d.name} className="flex items-center gap-2 mb-2">
                        <span style={{ width: 12, height: 12, background: d.color }} className="rounded-sm inline-block" />
                        <div>
                          <div className="text-slate-200">{d.name}</div>
                          <div className="text-xs text-slate-400">{d.value}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#071829] rounded-2xl p-4 shadow-lg border border-white/6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-slate-400">Recent Activity</div>
                    <div className="text-lg font-semibold text-white">Timeline</div>
                  </div>
                  <div className="text-xs text-slate-400">Live feed</div>
                </div>

                <div className="space-y-3">
                  {notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className="flex items-start gap-3 p-2 rounded hover:bg-white/2 transition cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5b7] to-[#06b6d4] flex items-center justify-center text-white font-semibold">
                        {String(n.text || "N").trim().slice(0, 1)}
                      </div>
                      <div className="flex-1">
                        <div className="text-slate-200">{n.text}</div>
                        <div className="text-xs text-slate-400 mt-1">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tables row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#071829] rounded-2xl p-4 shadow-lg border border-white/6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-slate-400">Top Vehicles</div>
                  <div className="text-lg font-semibold text-white">Most used in last 30 days</div>
                </div>

                <div className="text-xs text-slate-400">Updated recently</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-slate-400 uppercase">
                    <tr>
                      <th className="text-left py-2">Vehicle</th>
                      <th className="text-left py-2">Model</th>
                      <th className="text-left py-2">KM</th>
                      <th className="text-left py-2">Trips</th>
                      <th className="text-left py-2">Utilization</th>
                    </tr>
                  </thead>

                  <tbody>
                    {topVehicles.map((v) => (
                      <tr key={v.id} className="border-t border-white/5">
                        <td className="py-3 font-medium">{v.id}</td>
                        <td className="py-3">{v.model}</td>
                        <td className="py-3">{v.km.toLocaleString()}</td>
                        <td className="py-3">{v.trips}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-slate-400 w-10">{v.utilization}%</div>
                            <div className="flex-1 h-2 bg-white/4 rounded-full overflow-hidden">
                              <div style={{ width: `${v.utilization}%`, background: "linear-gradient(90deg,#FF7A1A,#FF9B4A)" }} className="h-2 rounded-full" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#071829] rounded-2xl p-4 shadow-lg border border-white/6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-slate-400">Pending Invoices</div>
                  <div className="text-lg font-semibold text-white">Awaiting payment</div>
                </div>

                <div className="text-xs text-slate-400">Total: {pendingInvoices.length}</div>
              </div>

              <div className="space-y-3">
                {pendingInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between gap-3 p-3 rounded hover:bg-white/2 transition">
                    <div>
                      <div className="text-sm text-slate-200 font-medium">{inv.id} — {inv.client}</div>
                      <div className="text-xs text-slate-400 mt-1">Due: <span className="text-slate-200 font-semibold">{inv.due}</span></div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`text-sm px-3 py-1 rounded-full ${inv.status === "Unpaid" ? "bg-rose-500/20 text-rose-300" : inv.status === "Partial" ? "bg-yellow-500/20 text-yellow-300" : "bg-emerald-500/20 text-emerald-300"}`}>
                        {inv.status}
                      </div>
                      <div className="text-sm font-semibold">₹{inv.amount.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right">
                <button className="px-3 py-2 rounded-md bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow hover:scale-[1.02] transition cursor-pointer">
                  View all invoices
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-slate-400">Showing mock data — connect real APIs for live metrics.</div>

            <div className="flex items-center gap-3">
              <button onClick={() => performQuickAction("create_trip")} disabled={loadingAction} className="px-3 py-2 rounded-md bg-[#0b1a26] hover:bg-white/5 transition cursor-pointer">
                Create Trip
              </button>
              <button onClick={() => performQuickAction("create_invoice")} disabled={loadingAction} className="px-3 py-2 rounded-md bg-[#0b1a26] hover:bg-white/5 transition cursor-pointer">
                Create Invoice
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
