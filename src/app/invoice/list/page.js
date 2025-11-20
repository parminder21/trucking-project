"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiCopy,
  FiFileText,
  FiSearch,
  FiMoreHorizontal,
  FiDownload,
  FiPrinter,
  FiTrash2,
  FiEye,
  FiPlus,
  FiChevronDown,
} from "react-icons/fi";

/**
 * Invoice List page (app/invoice/list/page.jsx)
 *
 * - Header replaced with PremiumHeader (orange theme)
 * - Bug fixed: PremiumHeader now uses its own `total` state (was using undefined totalGenerated)
 * - Rest of page unchanged
 */

// uploaded image path kept (not used) — your environment will map this path to a URL if needed
const bannerUrl = "/mnt/data/c7a6869a-7520-4cdf-86fa-9d87e2ed012c.png";

const DUMMY = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  inv: `INV20251100${(41 - i).toString().padStart(3, "0")}`,
  date: "2025-11-16",
  supplier: `Midway Concrete (Vic) Pty Ltd\n6-12 Plummer Rd, Laverton North, Vic 3026`,
  product: i % 2 === 0 ? "Sand, 14ML ROCK, 20ML ROCK, CRUSHED ROCK" : "MANSAND",
  pickup: i % 3 === 0 ? "HANSON BM" : "Hanson Wollert",
  drop: i % 2 === 0 ? "MIDWAY LAVERTON" : "MIDWAY LARA",
  totalPrice: (Math.random() * 9000 + 300).toFixed(2),
  truck: i % 2 === 0 ? "XW47RQ" : "XW77MK", // TRUCK REGO NUMBER
  loads: Math.floor(Math.random() * 25) + 1,
}));

function downloadFile(filename, content, mime = "text/csv") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------ PremiumHeader (ORANGE THEME) ------------------ */
/* Small, premium header which manages its own `total` state (fixed) */
function PremiumHeader({ initialTotal = 338 }) {
  const [total, setTotal] = useState(initialTotal);
  const [animate, setAnimate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // animate on increment
  function bumpCount(by = 1) {
    setTotal((t) => {
      const next = t + by;
      setAnimate(true);
      setTimeout(() => setAnimate(false), 360);
      return next;
    });
  }

  function handleCreateInvoice() {
    bumpCount(1);
    setMenuOpen(false);
    // wire real route here if needed
  }
  function handleBulkImport() {
    bumpCount(5);
    setMenuOpen(false);
    // wire real bulk import here if needed
  }

  // close menu when clicking outside
  useEffect(() => {
    function onDoc(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      {/* Left side title */}
      <div>
        <h3 className="text-sm text-orange-500 font-medium">List of Generated</h3>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight -mt-1">Invoices</h2>
        <p className="mt-1 text-xs text-slate-500">Overview of recently generated invoices</p>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-end w-full md:w-auto gap-4">
        {/* TOTAL BOX – Orange premium */}
        <div
          className="
            flex items-center gap-4 px-5 py-3 rounded-2xl 
            bg-gradient-to-br from-orange-100 to-orange-200
            border border-orange-300 shadow-md
          "
        >
          <div className="flex flex-col justify-center">
            <div className="text-xs text-orange-400 font-semibold">Total Generated</div>

            <div
              className="
                text-3xl font-extrabold text-orange-500 tracking-wide 
                transition-transform duration-300
              "
            >
              {total}
            </div>
          </div>

          {/* Spark Icon */}
          <div
            className="
              w-10 h-10 rounded-xl flex items-center justify-center 
              bg-gradient-to-br from-orange-500 to-orange-600 
              shadow text-white
            "
          >
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="1.6">
              <path d="M12 5v14" strokeLinecap="round" />
              <path d="M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Generate Button */}
        <button
          className="
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
            bg-gradient-to-r from-orange-500 to-orange-700
            text-white shadow-lg
            hover:scale-[1.03] active:scale-95 transition-transform
          "
          title="Generate Invoice"
        >
          <FiPlus className="text-white w-4 h-4" />
          Generate New Invoice
        </button>
      </div>
    </div>
  );
}

/* ------------------ Main page ------------------ */
export default function InvoiceListPage() {
  const [rows] = useState(DUMMY);
  const [search, setSearch] = useState("");
  const [menuOpenFor, setMenuOpenFor] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const tableRef = useRef();

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        String(r.inv).toLowerCase().includes(q) ||
        String(r.supplier).toLowerCase().includes(q) ||
        String(r.product).toLowerCase().includes(q) ||
        String(r.truck).toLowerCase().includes(q)
    );
  }, [rows, search]);

  function handleCopy() {
    navigator.clipboard
      .writeText(JSON.stringify(filtered, null, 2))
      .then(() => alert("Copied JSON to clipboard"))
      .catch(() => alert("Copy failed"));
  }

  function handleCsvDownload(ext = "csv") {
    const cols = [
      "#",
      "INV NUM",
      "DATE",
      "SUPPLIER",
      "PRODUCT",
      "PICKUP",
      "DROP",
      "TOTAL PRICE",
      "TRUCK REGO NUMBER",
      "NO OF LOADS",
    ];

    const rowsCsv = filtered.map((r, idx) =>
      [
        idx + 1,
        r.inv,
        r.date,
        `"${String(r.supplier).replace(/\n/g, " | ")}"`,
        `"${r.product}"`,
        r.pickup,
        r.drop,
        r.totalPrice,
        r.truck, // Already truck rego number
        r.loads,
      ].join(",")
    );

    const csv = [cols.join(","), ...rowsCsv].join("\n");
    const filename = `invoices_export_${Date.now()}.${ext}`;
    const mime = ext === "csv" ? "text/csv" : "application/vnd.ms-excel";

    downloadFile(filename, csv, mime);
  }

  function handlePrint() {
    const node = tableRef.current;
    if (!node) return window.print();
    const html = `
      <html>
        <head><title>Print - Invoices</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 20px; }
            table { width:100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 6px 8px; font-size:12px; }
            th { background:#0f766e; color:white; }
          </style>
        </head>
        <body>
          <h3>Invoices</h3>
          ${node.outerHTML}
        </body>
      </html>
    `;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  }

  function onView(inv) {
    alert(`View invoice: ${inv.inv}`);
    setMenuOpenFor(null);
  }
  function onCancel(inv) {
    if (!confirm(`Cancel invoice ${inv.inv}?`)) return;
    alert(`Cancelled ${inv.inv}`);
    setMenuOpenFor(null);
  }

  const totalGenerated = 338; // legacy value (PremiumHeader manages its own total)

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      {/* Premium header (replaces previous header block) */}
      <PremiumHeader initialTotal={totalGenerated} />

      {/* actions + search row */}
      <div className="bg-white rounded-md p-3 mb-3 shadow-sm">
        <div
          className="flex items-center gap-2 w-full overflow-x-auto no-scrollbar"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Buttons group */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Copy */}
            <button
              onClick={handleCopy}
              className="
                inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold
                bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm
                transition-transform duration-200 hover:-translate-y-0.5 active:scale-95
                hover:bg-emerald-600 hover:text-white
              "
            >
              <FiCopy className="w-4 h-4" /> Copy
            </button>

            {/* CSV */}
            <button
              onClick={() => handleCsvDownload("csv")}
              className="
                inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold
                bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm
                transition-transform duration-200 hover:-translate-y-0.5 active:scale-95
                hover:bg-emerald-600 hover:text-white
              "
            >
              <FiDownload className="w-4 h-4" /> CSV
            </button>

            {/* Excel */}
            <button
              onClick={() => handleCsvDownload("xls")}
              className="
                inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold
                bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm
                transition-transform duration-200 hover:-translate-y-0.5 active:scale-95
                hover:bg-emerald-600 hover:text-white
              "
            >
              <FiDownload className="w-4 h-4" /> Excel
            </button>

            {/* PDF */}
            <button
              onClick={() => handleCsvDownload("pdf")}
              className="
                inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold
                bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm
                transition-transform duration-200 hover:-translate-y-0.5 active:scale-95
                hover:bg-emerald-600 hover:text-white
              "
            >
              <FiFileText className="w-4 h-4" /> PDF
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="
                inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold
                bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm
                transition-transform duration-200 hover:-translate-y-0.5 active:scale-95
                hover:bg-emerald-600 hover:text-white
              "
            >
              <FiPrinter className="w-4 h-4" /> Print
            </button>
          </div>

          {/* search box */}
          <div className="flex items-center ml-auto flex-shrink-0">
            <div
              className="
                flex items-center px-3 py-1 rounded-lg border border-orange-200
                bg-gradient-to-br from-white to-orange-50/30
                transition-all duration-300
                focus-within:shadow-[0_0_8px_rgba(250,97,0,0.35)]
                focus-within:border-orange-400
              "
            >
              <FiSearch className="text-orange-500 mr-2 w-4 h-4" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoices..."
                className="outline-none text-sm w-56 md:w-64 bg-transparent placeholder:text-orange-400 placeholder:opacity-80 text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-fixed" ref={tableRef}>
          <colgroup><col className="w-12"/><col className="w-36"/><col className="w-28"/><col className="w-[420px]"/><col className="hidden lg:table-cell w-56"/><col className="hidden xl:table-cell w-40"/><col className="hidden xl:table-cell w-40"/><col className="w-32"/><col className="hidden lg:table-cell w-32"/><col className="w-28"/></colgroup>

          <thead>
            <tr className="bg-emerald-700 text-white text-sm">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">INV NUM</th>
              <th className="p-3 text-left">DATE</th>
              <th className="p-3 text-left">SUPPLIER</th>
              <th className="p-3 text-left hidden lg:table-cell">PRODUCT</th>
              <th className="p-3 text-left hidden xl:table-cell">PICKUP</th>
              <th className="p-3 text-left hidden xl:table-cell">DROP</th>
              <th className="p-3 text-right">TOTAL PRICE</th>
              <th className="p-3 text-left hidden lg:table-cell">TRUCK REGO NUMBER</th>
              <th className="p-3 text-center">NO OF LOADS</th>
              <th className="p-3 text-center">ACTION</th>
            </tr>
          </thead>

          <tbody className="text-sm text-slate-700">
            {filtered.map((r, idx) => (
              <tr key={r.inv} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="p-3 text-xs text-slate-600">{idx + 1}</td>
                <td className="p-3 font-medium text-emerald-800">{r.inv}</td>
                <td className="p-3 text-slate-600">{r.date}</td>

                <td className="p-3 whitespace-pre-line text-slate-700 text-sm">
                  <div className="font-medium">{r.supplier.split("\n")[0]}</div>
                  <div className="text-xs text-slate-500 mt-1">{r.supplier.split("\n")[1]}</div>
                </td>

                <td className="p-3 hidden lg:table-cell text-sm text-slate-600">{r.product}</td>
                <td className="p-3 hidden xl:table-cell text-slate-600">{r.pickup}</td>
                <td className="p-3 hidden xl:table-cell text-slate-600">{r.drop}</td>

                <td className="p-3 text-right font-medium text-slate-800">₹{r.totalPrice}</td>

                <td className="p-3 hidden lg:table-cell text-slate-600">{r.truck}</td>
                <td className="p-3 text-center text-slate-700">{r.loads}</td>

                <td className="p-3 text-center relative">
                  <div className="inline-block relative">
                    <button
                      onClick={() => setMenuOpenFor((s) => (s === r.inv ? null : r.inv))}
                      className="p-1 rounded border hover:bg-slate-100 text-slate-600"
                      aria-label="actions"
                    >
                      <FiMoreHorizontal />
                    </button>

                    {menuOpenFor === r.inv && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow z-50 text-sm">
                        <button
                          onClick={() => onView(r)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <FiEye /> View
                        </button>
                        <button
                          onClick={() => onCancel(r)}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-rose-600"
                        >
                          <FiTrash2 /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="p-6 text-center text-slate-500">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* footer / pagination */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-slate-600">Showing {filtered.length} result(s)</div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <div className="px-3 py-1 border rounded text-sm">Page {page}</div>
          <button className="px-3 py-1 border rounded text-sm" onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
