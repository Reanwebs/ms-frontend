"use client";

import { User, MapPin, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const router = useRouter();

  const user = {
    name: "John Doe",
    role: "Electrician",
    site: "Site A - Downtown Project",
    id: "EMP-102",
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-8">
      <h1 className="text-xl font-semibold text-center text-black">
        Employee Profile
      </h1>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="text-blue-600" size={28} />
          </div>
          <div>
            <p className="font-semibold text-lg text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-600">{user.role}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <div className="flex items-center gap-2 text-gray-700">
          <MapPin size={18} className="text-blue-500" />
          <span className="text-sm">{user.site}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <span className="text-sm font-medium">Employee ID:</span>
          <span className="text-sm">{user.id}</span>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-red-600 border border-red-400 hover:bg-red-50 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
