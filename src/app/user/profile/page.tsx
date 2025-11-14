"use client";

import { User, MapPin, LogOut, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Attendance = {
  clockin: number;
  clockout: number;
  total_time: number;
  site_id: string;
};

type UserType = {
  id: string;
  full_name: string;
  role: string;
  site: string;
  email: string;
};

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setError("User not found. Please login again.");
      setLoading(false);
      return;
    }

    // Fetch user profile first
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/fetch?email=${email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user profile");
        return res.json();
      })
      .then((data) => {
        setUser({
          id: data.id,
          full_name: data.full_name,
          role: "Electrician", // or get role from API if exists
          site: "Site A", // optional: map from data if user has site
          email: data.email,
        });

        // Now fetch attendance using user.id
        return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/attendance/fetch?id=${data.id}`);
      })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch attendance");
        return res.json();
      })
      .then((attData) => setAttendanceList(attData))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!user) return null;

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
            <p className="font-semibold text-lg text-gray-900">{user.full_name}</p>
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
          <span className="text-sm">{user.email}</span>
        </div>
      </div>

      {/* Attendance List */}
      <div>
        <h2 className="text-lg font-semibold text-black mb-3">Attendance</h2>
        {attendanceList.length === 0 ? (
          <p className="text-center text-gray-500">No attendance records found.</p>
        ) : (
          <div className="bg-white shadow rounded-2xl p-4 space-y-3">
            {attendanceList.map((att, idx) => (
              <div key={idx} className="flex justify-between items-center border-b last:border-b-0 border-gray-200 py-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-600" />
                  <div className="text-sm text-gray-700">
                    <div>Clock In: {new Date(att.clockin * 1000).toLocaleString()}</div>
                    <div>Clock Out: {att.clockout ? new Date(att.clockout * 1000).toLocaleString() : "-"}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {att.total_time ? `${att.total_time} sec` : "-"}
                </div>
              </div>
            ))}
          </div>
        )}
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
