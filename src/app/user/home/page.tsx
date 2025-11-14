"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";

type User = {
  full_name: string;
  email: string;
  phone: string;
  base_wage: number;
  is_admin: boolean;
  id: string;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [status, setStatus] = useState("You are currently checked out.");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setError("User not found. Please login again.");
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/fetch?email=${email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckInOut = async () => {
    if (!user) return;
  
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
  
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/attendance`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: user.id,
              lat,
              lng,
            }),
          }
        );
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
  
        alert(data.message);
        setIsCheckedIn(data.attendance.clockout === 0 ? true : false);
        setStatus(
          data.attendance.clockout === 0
            ? "You have checked in."
            : "You have checked out."
        );
      } catch (err: any) {
        alert(err.message);
      }
    });
  };
  

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto mt-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-semibold text-black">
          Welcome, {user?.full_name}
        </h1>
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
          <p className="text-gray-800 mt-2 text-sm font-medium">Email</p>
          <span className="text-gray-500 text-xs mt-1">{user?.email}</span>
        </div>
      </div>
    </div>
  );
}
