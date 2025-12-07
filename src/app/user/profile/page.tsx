"use client";

import { User, MapPin, LogOut, Clock, Wrench, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type BorrowedTool = {
  id: string;
  requested_at: number;
  requested_site_id: string;
};

type UserType = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  site: string;

  work_today: number;
  work_week: number;
  work_month: number;

  work_today_hm: string;
  work_week_hm: string;
  work_month_hm: string;

  wage_today: number;
  wage_week: number;
  wage_month: number;

  borrowed_tools: BorrowedTool[];
};

type Attendance = {
  clockin: number;
  clockout: number;
  total_time: number;
  site_id: string;
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

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/fetch?email=${email}`)
      .then(res => res.json())
      .then(data => {
        setUser({
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          role: data.role,

          site: data.current_site || "N/A",

          work_today: data.work_today,
          work_week: data.work_week,
          work_month: data.work_month,

          work_today_hm: data.work_today_hm,
          work_week_hm: data.work_week_hm,
          work_month_hm: data.work_month_hm,

          wage_today: data.wage_today,
          wage_week: data.wage_week,
          wage_month: data.wage_month,

          borrowed_tools: data.borrowed_tools || [],
        });

        return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/attendance/fetch?id=${data.id}`);
      })
      .then(res => res.json())
      .then(att => setAttendanceList(att))
      .catch(err => setError(err.message))
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
      <h1 className="text-xl font-semibold text-center text-black">Employee Profile</h1>

      {/* Profile */}
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

        <div className="border-t border-gray-200 my-3"></div>

        <div className="flex items-center gap-2 text-gray-700">
          <MapPin size={18} className="text-blue-500" />
          <span className="text-sm">Current Site: {user.site}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <span className="text-sm font-medium">Email:</span>
          <span className="text-sm">{user.email}</span>
        </div>
      </div>

      {/* Work + Wage Summary */}
      <div className="bg-white shadow rounded-2xl p-4 space-y-3">
        <h2 className="text-lg font-semibold text-black">Work & Earnings</h2>

        <div className="flex justify-between text-sm text-black">
          <span>Today:</span>
          <span>{user.work_today_hm} — ₹{user.wage_today.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm text-black">
          <span>This Week:</span>
          <span>{user.work_week_hm} — ₹{user.wage_week.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm text-black">
          <span>This Month:</span>
          <span>{user.work_month_hm} — ₹{user.wage_month.toFixed(2)}</span>
        </div>
      </div>

      {/* Borrowed Tools */}
      <div>
        <h2 className="text-lg font-semibold text-black mb-3">Borrowed Tools</h2>

        {user.borrowed_tools.length === 0 ? (
          <p className="text-gray-500 text-sm">No borrowed tools</p>
        ) : (
          <div className="bg-white shadow rounded-2xl p-4 space-y-2">
            {user.borrowed_tools.map((t, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b last:border-b-0 text-sm">
                <div className="flex items-center gap-2">
                  <Wrench size={16} className="text-gray-600" />
                  <div>
                    <p className="font-medium">{t.id}</p>
                    <p className="text-gray-500 text-xs">
                      Borrowed: {new Date(t.requested_at * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attendance */}
      <div>
        <h2 className="text-lg font-semibold text-black mb-3">Attendance</h2>
        {attendanceList.length === 0 ? (
          <p className="text-center text-gray-500">No attendance found</p>
        ) : (
          <div className="bg-white shadow rounded-2xl p-4 space-y-3">
            {attendanceList.map((att, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <div className="text-sm text-gray-700">
                    Clock In: {new Date(att.clockin * 1000).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-700">
                    Clock Out: {att.clockout ? new Date(att.clockout * 1000).toLocaleString() : "-"}
                  </div>
                </div>
                <div className="text-xs text-gray-500">{att.total_time} sec</div>
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
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}
