"use client";

import { useEffect, useState } from "react";

export default function ActiveToolsPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editTool, setEditTool] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch tools with pagination + filters
  const fetchTools = async () => {
    setLoading(true);

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) params.append("name", search);
    if (categoryFilter) params.append("category", categoryFilter);
    if (subCategoryFilter) params.append("sub_category", subCategoryFilter);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/tools/fetch?` +
          params.toString()
      );

      const json = await res.json();

      setTools(json.data || []);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch tools:", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when filters or page changes
  useEffect(() => {
    fetchTools();
  }, [page, search, categoryFilter, subCategoryFilter]);

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

  // Generate subcategory list based on selected category
  const subCategories = Array.from(
    new Set(
      tools
        .filter((t) => (categoryFilter ? t.category === categoryFilter : true))
        .map((t) => t.sub_category)
    )
  );

  // Update tool
  const updateTool = async () => {
    if (!editTool) return;
    setSaving(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/tools/update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editTool),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      // Update frontend instantly
      setTools((prev) =>
        prev.map((t) => (t.id === editTool.id ? editTool : t))
      );

      setEditTool(null);
    } catch (err) {
      alert("Failed to update tool");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-xl font-semibold mb-4">Tools List</h1>

      {/* 🔍 SEARCH & FILTER SECTION */}
      <div className="flex flex-wrap gap-4 mb-6">

  {/* Search Bar */}
  <input
    type="text"
    placeholder="Search tool by name..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border border-gray-400 px-3 py-2 rounded w-64 bg-white text-black"
  />

  {/* Category Filter */}
  <select
    className="border border-gray-400 px-3 py-2 rounded bg-white text-black"
    value={categoryFilter}
    onChange={(e) => {
      setCategoryFilter(e.target.value);
      setSubCategoryFilter("");
    }}
  >
    <option value="">All Categories</option>
    {categories.map((cat, i) => (
      <option key={i} value={cat}>
        {cat}
      </option>
    ))}
  </select>

  {/* Sub Category Filter */}
  <select
    className="border border-gray-400 px-3 py-2 rounded bg-white text-black"
    value={subCategoryFilter}
    onChange={(e) => setSubCategoryFilter(e.target.value)}
  >
    <option value="">All Sub Categories</option>
    {subCategories.map((sub, i) => (
      <option key={i} value={sub}>
        {sub}
      </option>
    ))}
  </select>

</div>

      {loading ? (
        <p>Loading tools...</p>
      ) : tools.length === 0 ? (
        <p>No tools found.</p>
      ) : (
        <div className="space-y-4">
          {tools.map((t) => (
            <div key={t.id} className="border p-4 rounded-xl bg-gray-50">
              <p>
                <strong>Name:</strong> {t.name}
              </p>
              <p>
                <strong>Category:</strong> {t.category}
              </p>
              <p>
                <strong>Sub Category:</strong> {t.sub_category}
              </p>
              <p>
                <strong>Tool ID:</strong> {t.tool_id}
              </p>
              <p>
                <strong>Available:</strong> {t.available_count}/{t.count}
              </p>

              <button
                onClick={() => setEditTool(t)}
                className="mt-3 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

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

      {/* EDIT MODAL */}
      {editTool && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white text-black p-6 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Tool</h2>

            {[
              "name",
              "category",
              "sub_category",
              "tool_id",
              "count",
              "available_count",
              "used_count",
            ].map((field) => (
              <div key={field} className="mb-3">
                <label className="block mb-1 font-medium">
                  {field.replace("_", " ").toUpperCase()}
                </label>

                <input
                  type={
                    ["count", "available_count", "used_count"].includes(field)
                      ? "number"
                      : "text"
                  }
                  value={editTool[field]}
                  onChange={(e) =>
                    setEditTool({
                      ...editTool,
                      [field]:
                        ["count", "available_count", "used_count"].includes(
                          field
                        )
                          ? parseFloat(e.target.value)
                          : e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditTool(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={updateTool}
                disabled={saving}
                className={`px-4 py-2 rounded-lg text-white ${
                  saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
