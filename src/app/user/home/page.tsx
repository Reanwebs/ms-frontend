"use client";

import { useState } from "react";
import { Clock, MapPin } from "lucide-react";

export default function HomePage() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [status, setStatus] = useState("You are currently checked out.");

  const handleCheckInOut = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
      setStatus("You have checked out.");
    } else {
      setIsCheckedIn(true);
      setStatus("You have checked in.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-semibold text-black">Employee Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">{status}</p>
      </div>

      {/* Check-in / Check-out Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleCheckInOut}
          className={`px-8 py-3 rounded-2xl text-white text-lg font-medium shadow-md transition-all duration-200 ${
            isCheckedIn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isCheckedIn ? "Check Out" : "Check In"}
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4 mt-10">
        <div className="bg-white shadow rounded-2xl p-4 flex flex-col items-center justify-center">
          <Clock size={24} className="text-gray-600" />
          <p className="text-gray-800 mt-2 text-sm font-medium">Shift Time</p>
          <span className="text-gray-500 text-xs mt-1">9:00 AM - 6:00 PM</span>
        </div>

        <div className="bg-white shadow rounded-2xl p-4 flex flex-col items-center justify-center">
          <MapPin size={24} className="text-gray-600" />
          <p className="text-gray-800 mt-2 text-sm font-medium">Current Site</p>
          <span className="text-gray-500 text-xs mt-1">Site A, Kochi</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-black mb-3">Recent Activity</h2>
        <div className="bg-white rounded-2xl shadow p-4 space-y-2">
          <p className="text-sm text-gray-700">✅ Checked in at 9:03 AM</p>
          <p className="text-sm text-gray-700">🧰 Tool requested: Hammer</p>
          <p className="text-sm text-gray-700">🏁 Checked out at 6:05 PM</p>
        </div>
      </div>
    </div>
  );
}
