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
 * Fully Responsive Invoice List page with proper pagination
 */

const bannerUrl = "/mnt/data/c7a6869a-7520-4cdf-86fa-9d87e2ed012c.png";

const DUMMY = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  inv: `INV20251100${(41 - i).toString().padStart(3, "0")}`,
  date: "2025-11-16",
  supplier: `Midway Concrete (Vic) Pty Ltd\n6-12 Plummer Rd, Laverton North, Vic 3026`,
  product: i % 2 === 0 
    ? "Sand, 14ML ROCK, 20ML ROCK, CRUSHED ROCK" 
    : "MANSAND",
  pickup: i % 3 === 0 ? "HANSON BM" : "Hanson Wollert",
  drop: i % 2 === 0 ? "MIDWAY LAVERTON" : "MIDWAY LARA",
  totalPrice: (Math.random() * 9000 + 300).toFixed(2),
  truck: i % 2 === 0 ? "XW47RQ" : "XW77MK",
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

/* ------------------ PremiumHeader (ORANGE THEME - FULLY RESPONSIVE) ------------------ */
function PremiumHeader({ initialTotal = 338 }) {
  const [total, setTotal] = useState(initialTotal);
  const [animate, setAnimate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
  }
  function handleBulkImport() {
    bumpCount(5);
    setMenuOpen(false);
  }

  useEffect(() => {
    function onDoc(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="flex flex-col gap-4 mb-4 sm:mb-6">
      {/* Title Section */}
      <div className="text-center sm:text-left">
        <h3 className="text-xs sm:text-sm text-orange-500 font-medium">List of Generated</h3>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight -mt-1">
          Invoices
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Overview of recently generated invoices
        </p>
      </div>

      {/* Stats and Action Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        {/* Total Stats Card */}
        <div
          className="
            flex items-center justify-between sm:justify-start gap-3 sm:gap-4 
            px-4 sm:px-5 py-3 rounded-2xl 
            bg-gradient-to-br from-orange-100 to-orange-200
            border border-orange-300 shadow-md
            flex-1 sm:flex-initial
          "
        >
          <div className="flex flex-col justify-center">
            <div className="text-xs sm:text-sm text-orange-400 font-semibold">
              Total Generated
            </div>
            <div
              className="
                text-2xl sm:text-3xl font-extrabold text-orange-500 tracking-wide 
                transition-transform duration-300
              "
            >
              {total}
            </div>
          </div>

          <div
            className="
              w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center 
              bg-gradient-to-br from-orange-500 to-orange-600 
              shadow text-white flex-shrink-0
            "
          >
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="1.6">
              <path d="M12 5v14" strokeLinecap="round" />
              <path d="M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Generate Button */}
        <button
          className="
            inline-flex items-center justify-center gap-2 
            px-4 sm:px-5 py-3 rounded-full 
            text-sm sm:text-base font-semibold
            bg-gradient-to-r from-orange-500 to-orange-700
            text-white shadow-lg
            hover:scale-[1.03] active:scale-95 
            transition-transform
            w-full sm:w-auto
            min-h-[44px]
          "
          title="Generate Invoice"
          onClick={handleCreateInvoice}
        >
          <FiPlus className="text-white w-4 h-4 sm:w-5 sm:h-5" />
          <span className="whitespace-nowrap">Generate New Invoice</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------ Mobile Card View Component ------------------ */
function InvoiceCard({ invoice, index, onView, onCancel }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-slate-500">#{index}</div>
          <div className="text-lg font-bold text-emerald-800">{invoice.inv}</div>
          <div className="text-xs text-slate-600 mt-1">{invoice.date}</div>
        </div>
        
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg border hover:bg-slate-50 text-slate-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="actions"
          >
            <FiMoreHorizontal size={20} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50 text-sm">
              <button
                onClick={() => {
                  onView(invoice);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 rounded-t-lg"
              >
                <FiEye size={16} /> View
              </button>
              <button
                onClick={() => {
                  onCancel(invoice);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-rose-50 flex items-center gap-3 text-rose-600 rounded-b-lg"
              >
                <FiTrash2 size={16} /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Supplier Info */}
      <div className="mb-3 pb-3 border-b border-slate-100">
        <div className="text-xs text-slate-500 mb-1">SUPPLIER</div>
        <div className="text-sm font-medium text-slate-700">
          {invoice.supplier.split("\n")[0]}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {invoice.supplier.split("\n")[1]}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-xs text-slate-500 mb-1">PRODUCT</div>
          <div className="text-sm text-slate-700 line-clamp-2">{invoice.product}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">TRUCK REGO</div>
          <div className="text-sm font-medium text-slate-700">{invoice.truck}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">PICKUP</div>
          <div className="text-sm text-slate-700">{invoice.pickup}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">DROP</div>
          <div className="text-sm text-slate-700">{invoice.drop}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div>
          <div className="text-xs text-slate-500">NO OF LOADS</div>
          <div className="text-lg font-semibold text-slate-800">{invoice.loads}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">TOTAL PRICE</div>
          <div className="text-xl font-bold text-emerald-700">₹{invoice.totalPrice}</div>
        </div>
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
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const perPage = 10;
  const tableRef = useRef();
  const menuRef = useRef();

  // Filter based on search
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

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  
  // Reset to page 1 if current page exceeds total pages
  const currentPage = page > totalPages && totalPages > 0 ? 1 : page;
  
  const startIdx = (currentPage - 1) * perPage;
  const endIdx = startIdx + perPage;
  const paginatedData = filtered.slice(startIdx, endIdx);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenFor(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Auto-detect view mode based on screen size
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setViewMode("cards");
      } else {
        setViewMode("table");
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        r.truck,
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

  const totalGenerated = 338;

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6 bg-gray-50">
      <PremiumHeader initialTotal={totalGenerated} />

      {/* Actions + Search Row - Fully Responsive */}
      <div className="bg-white rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          <button
            onClick={handleCopy}
            className="
              inline-flex items-center justify-center gap-2 
              px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg 
              text-xs sm:text-sm font-semibold
              bg-emerald-50 text-emerald-700 
              border border-emerald-200 shadow-sm
              transition-all duration-200 
              hover:-translate-y-0.5 active:scale-95
              hover:bg-emerald-600 hover:text-white
              flex-1 sm:flex-initial
              min-h-[44px]
            "
          >
            <FiCopy className="w-4 h-4" /> 
            <span className="hidden xs:inline">Copy</span>
          </button>

          <button
            onClick={() => handleCsvDownload('csv')}
            className="
              inline-flex items-center justify-center gap-2 
              px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg 
              text-xs sm:text-sm font-semibold
              bg-emerald-50 text-emerald-700 
              border border-emerald-200 shadow-sm
              transition-all duration-200 
              hover:-translate-y-0.5 active:scale-95
              hover:bg-emerald-600 hover:text-white
              flex-1 sm:flex-initial
              min-h-[44px]
            "
          >
            <FiDownload className="w-4 h-4" /> 
            <span className="hidden xs:inline">CSV</span>
          </button>

          <button
            onClick={() => handleCsvDownload('xls')}
            className="
              inline-flex items-center justify-center gap-2 
              px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg 
              text-xs sm:text-sm font-semibold
              bg-emerald-50 text-emerald-700 
              border border-emerald-200 shadow-sm
              transition-all duration-200 
              hover:-translate-y-0.5 active:scale-95
              hover:bg-emerald-600 hover:text-white
              flex-1 sm:flex-initial
              min-h-[44px]
            "
          >
            <FiDownload className="w-4 h-4" /> 
            <span className="hidden xs:inline">Excel</span>
          </button>

          <button
            onClick={() => handleCsvDownload('pdf')}
            className="
              inline-flex items-center justify-center gap-2 
              px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg 
              text-xs sm:text-sm font-semibold
              bg-emerald-50 text-emerald-700 
              border border-emerald-200 shadow-sm
              transition-all duration-200 
              hover:-translate-y-0.5 active:scale-95
              hover:bg-emerald-600 hover:text-white
              flex-1 sm:flex-initial
              min-h-[44px]
            "
          >
            <FiFileText className="w-4 h-4" /> 
            <span className="hidden xs:inline">PDF</span>
          </button>

          <button
            onClick={handlePrint}
            className="
              inline-flex items-center justify-center gap-2 
              px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg 
              text-xs sm:text-sm font-semibold
              bg-emerald-50 text-emerald-700 
              border border-emerald-200 shadow-sm
              transition-all duration-200 
              hover:-translate-y-0.5 active:scale-95
              hover:bg-emerald-600 hover:text-white
              flex-1 sm:flex-initial
              min-h-[44px]
            "
          >
            <FiPrinter className="w-4 h-4" /> 
            <span className="hidden xs:inline">Print</span>
          </button>
        </div>

        {/* Search Bar - Full Width on Mobile */}
        <div
          className="
            flex items-center px-3 sm:px-4 py-2.5 sm:py-3 
            rounded-lg border border-orange-200
            bg-gradient-to-br from-white to-orange-50/30
            transition-all duration-300
            focus-within:shadow-[0_0_8px_rgba(250,97,0,0.35)]
            focus-within:border-orange-400
            w-full
          "
        >
          <FiSearch className="text-orange-500 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search invoices..."
            className="
              outline-none text-sm sm:text-base w-full bg-transparent
              placeholder:text-orange-400 placeholder:opacity-80
              text-slate-800
            "
          />
        </div>
      </div>

      {/* Card View for Mobile, Table for Desktop */}
      {viewMode === "cards" ? (
        // Mobile Card View
        <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4">
          {paginatedData.map((r, idx) => (
            <InvoiceCard
              key={r.inv}
              invoice={r}
              index={startIdx + idx + 1}
              onView={onView}
              onCancel={onCancel}
            />
          ))}

          {paginatedData.length === 0 && (
            <div className="bg-white rounded-lg p-8 text-center text-slate-500 shadow-sm">
              No invoices found.
            </div>
          )}
        </div>
      ) : (
        // Desktop Table View
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto" ref={tableRef}>
              <thead>
                <tr className="bg-emerald-700 text-white text-xs sm:text-sm">
                  <th className="p-2 sm:p-3 text-left whitespace-nowrap">#</th>
                  <th className="p-2 sm:p-3 text-left whitespace-nowrap">INV NUM</th>
                  <th className="p-2 sm:p-3 text-left whitespace-nowrap">DATE</th>
                  <th className="p-2 sm:p-3 text-left whitespace-nowrap">SUPPLIER</th>
                  <th className="p-2 sm:p-3 text-left whitespace-nowrap hidden lg:table-cell">PRODUCT</th>
                  <th className="p-2 sm:p-3 text-left whitespace-nowrap hidden xl:table-cell">PICKUP</th>
                  <th className="p-2 sm:p-3 text-left whitespace-nowrap hidden xl:table-cell">DROP</th>
                  <th className="p-2 sm:p-3 text-right whitespace-nowrap">TOTAL PRICE</th>
                  <th className="p-2 sm:p-3 text-left whitespace-nowrap hidden lg:table-cell">TRUCK REGO</th>
                  <th className="p-2 sm:p-3 text-center whitespace-nowrap">LOADS</th>
                  <th className="p-2 sm:p-3 text-center whitespace-nowrap">ACTION</th>
                </tr>
              </thead>

              <tbody className="text-xs sm:text-sm text-slate-700">
                {paginatedData.map((r, idx) => (
                  <tr key={r.inv} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-2 sm:p-3 text-slate-600">{startIdx + idx + 1}</td>
                    <td className="p-2 sm:p-3 font-medium text-emerald-800 whitespace-nowrap">{r.inv}</td>
                    <td className="p-2 sm:p-3 text-slate-600 whitespace-nowrap">{r.date}</td>

                    <td className="p-2 sm:p-3 text-slate-700">
                      <div className="font-medium max-w-xs">{r.supplier.split("\n")[0]}</div>
                      <div className="text-xs text-slate-500 mt-1 max-w-xs">{r.supplier.split("\n")[1]}</div>
                    </td>

                    <td className="p-2 sm:p-3 hidden lg:table-cell text-slate-600 max-w-xs">
                      <div className="line-clamp-2">{r.product}</div>
                    </td>
                    <td className="p-2 sm:p-3 hidden xl:table-cell text-slate-600 whitespace-nowrap">{r.pickup}</td>
                    <td className="p-2 sm:p-3 hidden xl:table-cell text-slate-600 whitespace-nowrap">{r.drop}</td>

                    <td className="p-2 sm:p-3 text-right font-medium text-slate-800 whitespace-nowrap">
                      ₹{r.totalPrice}
                    </td>

                    <td className="p-2 sm:p-3 hidden lg:table-cell text-slate-600 whitespace-nowrap">{r.truck}</td>
                    <td className="p-2 sm:p-3 text-center text-slate-700">{r.loads}</td>

                    <td className="p-2 sm:p-3 text-center relative">
                      <div className="inline-block relative" ref={menuOpenFor === r.inv ? menuRef : null}>
                        <button
                          onClick={() => setMenuOpenFor((s) => (s === r.inv ? null : r.inv))}
                          className="p-2 rounded-lg border hover:bg-slate-100 text-slate-600 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                          aria-label="actions"
                        >
                          <FiMoreHorizontal size={18} />
                        </button>

                        {menuOpenFor === r.inv && (
                          <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white border rounded-lg shadow-lg z-50 text-sm">
                            <button
                              onClick={() => onView(r)}
                              className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-slate-50 flex items-center gap-2 sm:gap-3 rounded-t-lg"
                            >
                              <FiEye size={16} /> View
                            </button>
                            <button
                              onClick={() => onCancel(r)}
                              className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-rose-50 flex items-center gap-2 sm:gap-3 text-rose-600 rounded-b-lg"
                            >
                              <FiTrash2 size={16} /> Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={11} className="p-6 text-center text-slate-500">
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fully Responsive Pagination */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
        {/* Results Info */}
        <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left mb-3 sm:mb-4">
          Showing <span className="font-semibold text-emerald-700">{startIdx + 1}</span> to{" "}
          <span className="font-semibold text-emerald-700">{Math.min(endIdx, filtered.length)}</span> of{" "}
          <span className="font-semibold text-emerald-700">{filtered.length}</span> results
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* First & Previous - Hidden on very small screens */}
          <button
            className="
              hidden xs:inline-flex
              px-2 sm:px-3 py-2 border rounded-lg 
              text-xs sm:text-sm font-medium 
              transition-colors 
              disabled:opacity-40 disabled:cursor-not-allowed 
              hover:bg-emerald-50 hover:border-emerald-300
              text-slate-700
              min-h-[44px]
            "
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
          >
            First
          </button>

          <button
            className="
              px-2 sm:px-3 py-2 border rounded-lg 
              text-xs sm:text-sm font-medium 
              transition-colors 
              disabled:opacity-40 disabled:cursor-not-allowed 
              hover:bg-emerald-50 hover:border-emerald-300
              text-slate-700
              min-h-[44px]
            "
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {/* Page Numbers - Responsive */}
          <div className="flex items-center gap-1 sm:gap-2">
            {Array.from({ length: Math.min(totalPages <= 5 ? totalPages : 3, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 2) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 1) {
                pageNum = totalPages - 2 + i;
              } else {
                pageNum = currentPage - 1 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`
                    px-2.5 sm:px-3 py-2 border rounded-lg 
                    text-xs sm:text-sm font-medium 
                    transition-all
                    min-h-[44px] min-w-[44px]
                    ${
                      currentPage === pageNum
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                        : "hover:bg-emerald-50 hover:border-emerald-300 text-slate-700"
                    }
                  `}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="
              px-2 sm:px-3 py-2 border rounded-lg 
              text-xs sm:text-sm font-medium 
              transition-colors 
              disabled:opacity-40 disabled:cursor-not-allowed 
              hover:bg-emerald-50 hover:border-emerald-300
              text-slate-700
              min-h-[44px]
            "
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>

          {/* Last - Hidden on very small screens */}
          <button
            className="
              hidden xs:inline-flex
              px-2 sm:px-3 py-2 border rounded-lg 
              text-xs sm:text-sm font-medium 
              transition-colors 
              disabled:opacity-40 disabled:cursor-not-allowed 
              hover:bg-emerald-50 hover:border-emerald-300
              text-slate-700
              min-h-[44px]
            "
            onClick={() => setPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}