"use client";

import { useRouter } from "next/navigation";
import { Plus, Wrench, Home, ChevronRight,LogOut } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token"); // optional
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 flex flex-col items-center">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-black">
            Admin Dashboard :
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Top Buttons */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-md mb-8">
        <button
          onClick={() => router.push("/admin/add-employee")}
          className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl shadow-sm hover:bg-gray-100 transition"
        >
          <Plus className="w-6 h-6 text-gray-700 mb-2" />
          <span className="text-sm font-medium text-gray-700">
            Add Employee
          </span>
        </button>

        <button
          onClick={() => router.push("/admin/add-tools")}
          className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl shadow-sm hover:bg-gray-100 transition"
        >
          <Wrench className="w-6 h-6 text-gray-700 mb-2" />
          <span className="text-sm font-medium text-gray-700">Add Tools</span>
        </button>

        <button
          onClick={() => router.push("/admin/add-site")}
          className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl shadow-sm hover:bg-gray-100 transition"
        >
          <Home className="w-6 h-6 text-gray-700 mb-2" />
          <span className="text-sm font-medium text-gray-700">Add Site</span>
        </button>
      </div>

      {/* Divider */}
      <hr className="w-full max-w-md border-gray-200 mb-8" />

      {/* Menu Buttons */}
      <div className="w-full max-w-md space-y-4">
        {[
          { label: "Employees Details", path: "/admin/employees" },
          { label: "Active Tools", path: "/admin/tools" },
          { label: "View Sites", path: "/admin/sites" },
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => router.push(item.path)}
            className="w-full flex items-center justify-between border border-gray-300 rounded-xl px-4 py-3 text-gray-800 font-medium hover:bg-gray-50 transition"
          >
            {item.label}
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        ))}
      </div>
    </div>
  );
}
