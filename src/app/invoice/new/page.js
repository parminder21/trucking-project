"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiPlus,
  FiTrash,
  FiCalendar,
  FiSave,
  FiChevronLeft,
  FiSearch,
  FiFileText,
} from "react-icons/fi";

/* SAFE ID GENERATOR — avoids Date.now / Math.random in render */
function generateId() {
  return `${crypto.randomUUID()}`;
}

/* MEMOIZED CURRENT DATE (once only) */
const todayDateString = new Date().toISOString().slice(0, 10);

function CompactField({ label, children, required = false }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs sm:text-sm md:text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function TripsTable() {
  const dummyTrips = [
    {
      id: "TRIP-001",
      docket: "DCK-1001",
      material: "Cement",
      netWeight: "12,500",
      unit: "kg",
      start: "2025-11-18 08:15",
      end: "2025-11-18 12:40",
    },
    {
      id: "TRIP-002",
      docket: "DCK-1002",
      material: "Steel Rods",
      netWeight: "8,200",
      unit: "kg",
      start: "2025-11-18 09:00",
      end: "2025-11-18 13:05",
    },
    {
      id: "TRIP-003",
      docket: "DCK-1003",
      material: "Sand",
      netWeight: "15,000",
      unit: "kg",
      start: "2025-11-17 22:30",
      end: "2025-11-18 02:10",
    },
  ];

  const [checkedMap, setCheckedMap] = useState(() =>
    dummyTrips.reduce((acc, t) => ({ ...acc, [t.id]: false }), {})
  );

  const checkedCount = Object.values(checkedMap).filter(Boolean).length;
  const allChecked =
    Object.values(checkedMap).length > 0 &&
    checkedCount === dummyTrips.length;

  function toggleOne(id) {
    setCheckedMap((s) => ({ ...s, [id]: !s[id] }));
  }

  function toggleAll() {
    const next = {};
    const shouldCheck = checkedCount !== dummyTrips.length;
    dummyTrips.forEach((t) => {
      next[t.id] = shouldCheck;
    });
    setCheckedMap(next);
  }

  return (
    <div className="relative space-y-3">
      <div className="rounded-2xl overflow-hidden border border-white/10">
        <div
          className="flex flex-wrap sm:flex-nowrap items-center bg-emerald-900 text-white
                  text-[11px] sm:text-xs md:text-sm lg:text-sm xl:text-base
                  select-none"
        >
          <div className="px-2 py-2 w-10 sm:w-12 flex items-center justify-center">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 accent-white/90 cursor-pointer"
              onChange={toggleAll}
              checked={allChecked}
            />
          </div>

          <div className="px-3 py-2 w-32 sm:w-36 md:w-40 font-semibold text-white/95">
            TRIP NUMBER
          </div>

          <div className="px-3 py-2 w-36 font-semibold hidden sm:block text-white/90">
            DOCKET NUMBER
          </div>
          <div className="px-3 py-2 w-32 font-semibold hidden md:block text-white/90">
            MATERIAL
          </div>
          <div className="px-3 py-2 w-24 font-semibold hidden lg:block text-white/90">
            NET WT
          </div>
          <div className="px-3 py-2 w-20 font-semibold hidden lg:block text-white/90">
            UNIT
          </div>
          <div className="px-3 py-2 w-40 font-semibold hidden xl:block text-white/90">
            START DATE/TIME
          </div>
          <div className="px-3 py-2 w-40 font-semibold hidden xl:block text-white/90">
            END DATE/TIME
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {dummyTrips.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-white/10 overflow-hidden bg-white shadow-sm"
          >
            {/* Desktop */}
            <div className="hidden sm:flex items-center px-2 md:px-3 py-2 text-sm">
              <div className="w-10 sm:w-12 flex items-center justify-center">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 accent-emerald-600 cursor-pointer"
                  checked={!!checkedMap[t.id]}
                  onChange={() => toggleOne(t.id)}
                />
              </div>

              <div className="px-3 w-32 sm:w-36 md:w-40 font-medium text-slate-800">
                {t.id}
              </div>

              <div className="w-36 px-3 text-slate-600">{t.docket}</div>
              <div className="w-32 px-3 text-slate-600 hidden md:block">
                {t.material}
              </div>
              <div className="w-24 px-3 text-slate-600 hidden lg:block">
                {t.netWeight}
              </div>
              <div className="w-20 px-3 text-slate-600 hidden lg:block">
                {t.unit}
              </div>
              <div className="w-40 px-3 text-slate-600 hidden xl:block">
                {t.start}
              </div>
              <div className="w-40 px-3 text-slate-600 hidden xl:block">
                {t.end}
              </div>
            </div>

            {/* Mobile */}
            <div className="sm:hidden px-3 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-emerald-600 cursor-pointer"
                    checked={!!checkedMap[t.id]}
                    onChange={() => toggleOne(t.id)}
                  />
                  <div className="font-medium text-sm text-slate-800">
                    {t.id}
                  </div>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <span className="text-[11px] text-slate-400">Docket</span>
                  <div className="font-medium text-sm">{t.docket}</div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400">Material</span>
                  <div className="font-medium text-sm">{t.material}</div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400">Net WT</span>
                  <div className="font-medium text-sm">{t.netWeight}</div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400">Unit</span>
                  <div className="font-medium text-sm">{t.unit}</div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400">Start</span>
                  <div className="font-medium text-sm">{t.start}</div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400">End</span>
                  <div className="font-medium text-sm">{t.end}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Proceed button */}
      <div
        className={`fixed right-6 bottom-6 z-40 transition-all duration-300 ${
          checkedCount > 0
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-95 pointer-events-none"
        }`}
      >
        <button
          type="button"
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700 active:scale-95 transition"
        >
          <span className="text-sm">Proceed for invoice</span>
          <span className="inline-flex items-center justify-center bg-white/20 px-2 py-1 rounded-full text-xs">
            {checkedCount}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function NewInvoicePage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const [customerName, setCustomerName] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(todayDateString);
  const [notes, setNotes] = useState("");
  const [taxPercent, setTaxPercent] = useState(18);
  const [loading, setLoading] = useState(false);

  const [items, setItems] = useState([
    { id: generateId(), description: "", qty: 1, rate: 0 },
  ]);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc, it) =>
          acc + (Number(it.qty) || 0) * (Number(it.rate) || 0),
        0
      ),
    [items]
  );

  const taxAmount = useMemo(
    () => (subtotal * (Number(taxPercent) || 0)) / 100,
    [subtotal, taxPercent]
  );

  const grandTotal = useMemo(
    () => subtotal + taxAmount,
    [subtotal, taxAmount]
  );

  function addItem() {
    setItems((p) => [
      ...p,
      { id: generateId(), description: "", qty: 1, rate: 0 },
    ]);
  }

  function updateItem(id, patch) {
    setItems((p) =>
      p.map((it) => (it.id === id ? { ...it, ...patch } : it))
    );
  }

  function removeItem(id) {
    setItems((p) => p.filter((it) => it.id !== id));
  }

  return (
    <div
      className="px-3 sm:px-6 lg:px-8 mx-auto space-y-6"
      style={{
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto",
      }}
    >
      {/* Filter Header */}
      <div
        className={`rounded-2xl overflow-hidden transition-all duration-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
        style={{ boxShadow: "0 12px 30px rgba(16,24,40,0.06)" }}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-white via-white to-white px-5 py-4 sm:py-5 backdrop-blur-sm">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
              Filter Trips
            </h2>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">
              Refine your trip search using filters
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="px-3 py-1.5 rounded-lg text-white font-semibold bg-emerald-500 hover:bg-emerald-600 shadow-sm transition text-sm">
              <span className="inline-flex items-center gap-2 text-sm">
                <FiFileText className="w-4 h-4" /> Registered Trip
              </span>
            </button>

            <button className="px-3 py-1.5 rounded-lg text-white font-semibold bg-emerald-500 hover:bg-emerald-600 shadow-sm transition text-sm">
              <span className="inline-flex items-center gap-2 text-sm">
                <FiFileText className="w-4 h-4" /> Registered Invoice
              </span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white px-4 sm:px-5 py-3 border-t">
          <div className="grid grid-cols-12 gap-2 md:gap-3 items-end">
            <div className="col-span-12 md:col-span-3">
              <CompactField label="Drop Address" required>
                <select className="appearance-none w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white text-slate-700 focus:ring-2 focus:ring-blue-100">
                  <option value="">Select Drop Address</option>
                  <option value="A">Address A</option>
                  <option value="B">Address B</option>
                </select>
              </CompactField>
            </div>

            <div className="col-span-6 md:col-span-1">
              <CompactField label="Driver" required>
                <select className="appearance-none w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  <option>All</option>
                  <option>Driver 1</option>
                </select>
              </CompactField>
            </div>

            <div className="col-span-6 md:col-span-1">
              <CompactField label="Vehicle" required>
                <select className="appearance-none w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  <option>All</option>
                  <option>Truck A</option>
                </select>
              </CompactField>
            </div>

            <div className="col-span-6 md:col-span-2">
              <CompactField label="From Date" required>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    defaultValue={todayDateString}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <FiCalendar className="text-slate-500 w-4 h-4" />
                </div>
              </CompactField>
            </div>

            <div className="col-span-6 md:col-span-2">
              <CompactField label="To Date" required>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    defaultValue={todayDateString}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                  <FiCalendar className="text-slate-500 w-4 h-4" />
                </div>
              </CompactField>
            </div>

            <div className="col-span-6 md:col-span-1">
              <CompactField label="Bill To" required>
                <select className="appearance-none w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  <option value="">Select</option>
                  <option value="ClientA">Client A</option>
                  <option value="ClientB">Client B</option>
                </select>
              </CompactField>
            </div>

            <div className="col-span-6 md:col-span-1">
              <CompactField label="Fuel Levy" required>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </CompactField>
            </div>

            <div className="col-span-12 md:col-span-1 flex justify-end">
              <button
                type="button"
                className="px-3 py-2 rounded-lg text-white flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-md transition"
              >
                <FiSearch className="w-4 h-4" /> <span>Trips</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <TripsTable />
    </div>
  );
}
