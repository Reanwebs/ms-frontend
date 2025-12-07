"use client";

import { useEffect, useState } from "react";
import { Wrench, CheckCircle, ArrowLeftCircle } from "lucide-react";

type Tool = {
  id: string;
  name: string;
  category?: string;
  sub_category?: string;
  count?: number;
  available_count?: number;
  used_count?: number;
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // assume true until API shows 401

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

  // HARD CODED CATEGORIES
  const masterCategories = [
    "ihfe",
    "CPVC",
    "PPR",
    "Electrical DB",
    "Wires",
    "PVC",
    "Switches & Plates",
    "UG Cable & Accessories",
    "Sanitary",
    "Metal & Pipe",
    "UPVC pipe & fittings",
    "Lighting",
  ];

  const categories = masterCategories;

  // Fetch tools
  async function fetchTools() {
    setLoading(true);

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append("name", search);
    if (categoryFilter) params.append("category", categoryFilter);
    if (subCategoryFilter) params.append("sub_category", subCategoryFilter);

    try {
      const res = await fetch(`${API_BASE}/user/tools/fetch?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.status === 401) {
        setIsLoggedIn(false);
      }

      if (!res.ok) throw new Error("Failed to fetch tools");

      const data = await res.json();

      const list =
        Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.tools)
          ? data.tools
          : Array.isArray(data)
          ? data
          : [];

      setTools(list);
      setTotalPages(data?.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTools();
  }, [page, search, categoryFilter, subCategoryFilter]);

  // Extract subcategories dynamically
  const subCategories = Array.from(
    new Set(
      tools
        .filter((t) => (categoryFilter ? t.category === categoryFilter : true))
        .map((t) => t.sub_category)
        .filter(Boolean)
    )
  );

  // REQUEST A TOOL
  async function requestTool(tool: Tool) {
    if (!isLoggedIn) {
      alert("Please sign in to request tools.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/user/tools/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tool_id: tool.id }),
      });

      if (res.status === 401) {
        setIsLoggedIn(false);
        alert("Please sign in to request tools.");
        return;
      }

      if (!res.ok) throw new Error("Request failed");

      fetchTools();
    } catch (e) {
      alert("Error requesting tool");
    }
  }

  // RETURN TOOL
  async function returnTool(tool: Tool) {
    try {
      const res = await fetch(`${API_BASE}/user/tools/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tool_id: tool.id }),
      });

      if (!res.ok) throw new Error("Return failed");

      fetchTools();
    } catch (e) {
      alert("Error returning tool");
    }
  }

  // LOADING STATE
  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading tools...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load tools: {error}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 space-y-6 pb-24">
      <h1 className="text-xl font-semibold text-black text-center">
        Active Tools
      </h1>

      {/* SEARCH + FILTER */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Search tools..."
          className="w-full border px-3 py-2 rounded bg-white text-black"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* CATEGORY */}
        <select
          className="w-full border px-3 py-2 rounded bg-white text-black"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setSubCategoryFilter("");
            setPage(1);
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* SUBCATEGORY */}
        <select
          className="w-full border px-3 py-2 rounded bg-white text-black"
          value={subCategoryFilter}
          onChange={(e) => {
            setSubCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Sub Categories</option>
          {subCategories.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* TOOL LIST */}
      <div className="space-y-4">
        {tools.map((tool) => {
          const isBorrowed = (tool.used_count ?? 0) > 0;
          const canRequest = tool.available_count! > 0;

          return (
            <div
              key={tool.id}
              className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-md"
            >
              <div className="flex items-center gap-3">
                <Wrench
                  size={22}
                  className={
                    isBorrowed ? "text-yellow-500" : "text-green-500"
                  }
                />
                <div>
                  <p className="text-gray-800 font-medium">{tool.name}</p>
                  <p className="text-xs text-gray-500">{tool.category}</p>
                  <p className="text-xs text-gray-500">{tool.sub_category}</p>
                  <p className="text-xs text-gray-500">
                    {isBorrowed ? "Borrowed" : "Available"}
                  </p>
                </div>
              </div>

              {/* BUTTON LOGIC */}
              {isBorrowed ? (
                <button
                  onClick={() => returnTool(tool)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-yellow-500 text-white"
                >
                  <ArrowLeftCircle size={16} /> Return
                </button>
              ) : canRequest ? (
                <button
                  onClick={() => requestTool(tool)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-green-500 text-white"
                >
                  <CheckCircle size={16} /> Request
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-300 text-gray-500"
                >
                  Out of Stock
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          >
            Previous
          </button>

          <span className="px-3 py-2 bg-gray-100 rounded">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
