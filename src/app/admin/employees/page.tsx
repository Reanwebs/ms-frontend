"use client";

import { useEffect, useState } from "react";

export default function EmployeeDetailsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [editUser, setEditUser] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user/fetch`
        );

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Update User
  const updateUser = async () => {
    if (!editUser) return;

    setSaving(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user/update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editUser),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      // Update UI
      setUsers((prev) =>
        prev.map((u) => (u.id === editUser.id ? editUser : u))
      );

      setEditUser(null);
    } catch (err) {
      alert("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  // Disable User
// Enable or Disable user
const toggleUser = async (id: string, currentStatus: boolean) => {
  const action = currentStatus ? "enable" : "disable";

  if (!confirm(`Are you sure you want to ${action} this user?`)) return;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user/disable`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          toggle: action, // sending "enable" or "disable"
        }),
      }
    );

    if (!res.ok) throw new Error("Request failed");

    // Update UI instantly
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, is_disabled: !currentStatus } : u
      )
    );
  } catch {
    alert(`Failed to ${action} user`);
  }
};


  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Employee Details</h1>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : users.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="border p-4 rounded-xl bg-gray-50 text-black"
            >
              <p><strong>Name:</strong> {u.full_name}</p>
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Phone:</strong> {u.phone}</p>
              <p><strong>Base Wage:</strong> {u.base_wage}</p>
              <p><strong>Overtime %:</strong> {u.overtime_wage_percent}</p>
              <p><strong>Admin:</strong> {u.is_admin ? "Yes" : "No"}</p>

              {u.is_disabled && (
                <p className="text-red-600 font-semibold">Disabled</p>
              )}

<div className="flex gap-2 mt-3">
  {/* Edit */}
  <button
    onClick={() => setEditUser(u)}
    className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
  >
    Edit
  </button>

  {/* Disable or Enable button */}
  {!u.is_disabled ? (
    <button
      onClick={() => toggleUser(u.id, false)}
      className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700"
    >
      Disable
    </button>
  ) : (
    <button
      onClick={() => toggleUser(u.id, true)}
      className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
    >
      Enable
    </button>
  )}
</div>

            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white text-black p-6 rounded-xl w-96">
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>

            {/* Full Name */}
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              value={editUser.full_name}
              onChange={(e) =>
                setEditUser({ ...editUser, full_name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3 text-black"
            />

            {/* Email */}
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="text"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3 text-black"
            />

            {/* Phone */}
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="text"
              value={editUser.phone}
              onChange={(e) =>
                setEditUser({ ...editUser, phone: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3 text-black"
            />

            {/* Base Wage */}
            <label className="block mb-1 font-medium">Base Wage</label>
            <input
              type="number"
              value={editUser.base_wage}
              onChange={(e) =>
                setEditUser({
                  ...editUser,
                  base_wage: Number(e.target.value),
                })
              }
              className="w-full border px-3 py-2 rounded mb-3 text-black"
            />

            {/* Overtime Wage % */}
            <label className="block mb-1 font-medium">Overtime %</label>
            <input
              type="number"
              value={editUser.overtime_wage_percent}
              onChange={(e) =>
                setEditUser({
                  ...editUser,
                  overtime_wage_percent: Number(e.target.value),
                })
              }
              className="w-full border px-3 py-2 rounded mb-4 text-black"
            />

            {/* Admin Toggle */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={editUser.is_admin}
                onChange={(e) =>
                  setEditUser({ ...editUser, is_admin: e.target.checked })
                }
                className="mr-2"
              />
              <label className="font-medium">Is Admin</label>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditUser(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={updateUser}
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
