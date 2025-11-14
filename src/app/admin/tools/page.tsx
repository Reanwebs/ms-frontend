"use client";

import { useEffect, useState } from "react";

export default function ActiveToolsPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editTool, setEditTool] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch tools
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/tools/fetch`
        );
        const data = await res.json();
        setTools(data);
      } catch (err) {
        console.error("Failed to fetch tools:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

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
      <h1 className="text-xl font-semibold mb-4 text-black">Tools List</h1>

      {loading ? (
        <p className="text-gray-600">Loading tools...</p>
      ) : tools.length === 0 ? (
        <p>No tools found.</p>
      ) : (
        <div className="space-y-4">
          {tools.map((t) => (
            <div key={t.id} className="border p-4 rounded-xl bg-gray-50">
              <p><strong>Name:</strong> {t.name}</p>
              <p><strong>Category:</strong> {t.category}</p>
              <p><strong>Sub Category:</strong> {t.sub_category}</p>
              <p><strong>Tool ID:</strong> {t.tool_id}</p>
              <p><strong>Available:</strong> {t.available_count}/{t.count}</p>

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
                  className="w-full border px-3 py-2 rounded text-black"
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
