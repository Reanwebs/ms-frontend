"use client";

import { useEffect, useState } from "react";

export default function ViewSitesPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [editSite, setEditSite] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch sites
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/site/fetch`
        );
        const data = await res.json();
        setSites(data);
      } catch (err) {
        console.error("Failed to fetch sites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  // Update site
  const updateSite = async () => {
    if (!editSite) return;
    setSaving(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/site/update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editSite),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      setSites((prev) =>
        prev.map((s) => (s.id === editSite.id ? editSite : s))
      );

      setEditSite(null);
    } catch (err) {
      alert("Failed to update site");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 text-black">
      <h1 className="text-xl font-semibold mb-4 text-black">View Sites</h1>

      {loading ? (
        <p className="text-gray-600">Loading sites...</p>
      ) : sites.length === 0 ? (
        <p>No sites found.</p>
      ) : (
        <div className="space-y-4">
          {sites.map((s) => (
            <div key={s.id} className="border p-4 rounded-xl bg-gray-50">
              <p><strong>Name:</strong> {s.name}</p>
              <p><strong>District:</strong> {s.district}</p>
              <p><strong>State:</strong> {s.state}</p>
              <p><strong>Lat:</strong> {s.latitude}</p>
              <p><strong>Long:</strong> {s.longitude}</p>
              <p><strong>Start Date:</strong> {s.start_date}</p>
              <p><strong>Deadline:</strong> {s.deadline}</p>

              <button
                onClick={() => setEditSite(s)}
                className="mt-3 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editSite && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white text-black p-6 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Site</h2>

            {/* Fields */}
            {[
              "name",
              "district",
              "state",
              "longitude",
              "latitude",
              "start_date",
              "deadline",
            ].map((field) => (
              <div key={field} className="mb-3">
                <label className="block mb-1 font-medium">
                  {field.replace("_", " ").toUpperCase()}
                </label>
                <input
                  type="text"
                  value={editSite[field]}
                  onChange={(e) =>
                    setEditSite({
                      ...editSite,
                      [field]:
                        field === "longitude" ||
                        field === "latitude"
                          ? parseFloat(e.target.value)
                          : field === "start_date" ||
                            field === "deadline"
                          ? parseInt(e.target.value)
                          : e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded text-black"
                />
              </div>
            ))}

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setEditSite(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={updateSite}
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
