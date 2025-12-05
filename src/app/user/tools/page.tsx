"use client";

import { useEffect, useState } from "react";
import { Wrench, CheckCircle, ArrowLeftCircle } from "lucide-react";

type Tool = {
  id: number;
  name: string;
  category?: string;
  sub_category?: string;
  count?: number;
  available_count?: number;
  used_count?: number;
  status?: "available" | "borrowed"; // fallback
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

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

      if (!res.ok) throw new Error("Failed to fetch tools");

      const data = await res.json();
      setTools(data.data || data.tools || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Re-fetch when filters/page change
  useEffect(() => {
    fetchTools();
  }, [page, search, categoryFilter, subCategoryFilter]);

  // Extract category/sub-category options
  const categories = Array.from(new Set(tools.map((t) => t.category).filter(Boolean)));
  const subCategories = Array.from(
    new Set(
      tools
        .filter((t) => (categoryFilter ? t.category === categoryFilter : true))
        .map((t) => t.sub_category)
        .filter(Boolean)
    )
  );

  // Local UI toggle action
  const handleAction = (id: number) => {
    setTools((prev) =>
      prev.map((tool) =>
        tool.id === id
          ? { ...tool, used_count: tool.used_count ? 0 : 1 }
          : tool
      )
    );
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading tools...</div>;
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
      <h1 className="text-xl font-semibold text-black text-center">Active Tools</h1>

      {/* SEARCH + FILTERS */}
      <div className="space-y-3">

        {/* Search */}
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

        {/* Category */}
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

        {/* Sub Category */}
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
          // FIXED: correct logic for borrowed/available
          const isBorrowed = (tool.used_count ?? 0) > 0;
          const status = isBorrowed ? "borrowed" : "available";

          return (
            <div
              key={tool.id}
              className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-md"
            >
              <div className="flex items-center gap-3">
                <Wrench
                  size={22}
                  className={status === "available" ? "text-green-500" : "text-yellow-500"}
                />
                <div>
                  <p className="text-gray-800 font-medium">{tool.name}</p>
                  <p className="text-xs text-gray-500">{tool.category}</p>
                  <p className="text-xs text-gray-500">{tool.sub_category}</p>
                  <p className="text-xs text-gray-500">
                    {status === "available" ? "Available" : "Borrowed"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleAction(tool.id)}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  status === "available"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
              >
                {status === "available" ? (
                  <>
                    <CheckCircle size={16} /> Request
                  </>
                ) : (
                  <>
                    <ArrowLeftCircle size={16} /> Return
                  </>
                )}
              </button>
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
