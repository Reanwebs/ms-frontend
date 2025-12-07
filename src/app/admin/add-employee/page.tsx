"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type EmployeeForm = {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  base_wage: string;
  overtime_wage_percent: string;
  created_by: string;
  is_admin: boolean;
};

export default function AddEmployee() {
  const router = useRouter();

  const [form, setForm] = useState<EmployeeForm>({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    base_wage: "",
    overtime_wage_percent: "",
    created_by: "",
    is_admin: false,
  });

  // Type-safe change handler
  const handleChange = <K extends keyof EmployeeForm>(
    key: K,
    value: EmployeeForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      base_wage: parseFloat(form.base_wage || "0"),
      overtime_wage_percent: parseFloat(form.overtime_wage_percent || "0"),
      created_by: form.created_by,
      is_admin: form.is_admin,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      alert("User added successfully!");
      router.push("/admin/dashboard");
    } else {
      alert("Failed to add user");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-700 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add User</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-xl p-3 text-black"
            value={form.full_name}
            onChange={(e) => handleChange("full_name", e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-xl p-3 text-black"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl p-3 text-black"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Phone"
            className="w-full border rounded-xl p-3 text-black"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          <input
            type="number"
            placeholder="Base Wage"
            className="w-full border rounded-xl p-3 text-black"
            value={form.base_wage}
            onChange={(e) => handleChange("base_wage", e.target.value)}
          />

          <input
            type="number"
            placeholder="Overtime Wage %"
            className="w-full border rounded-xl p-3 text-black"
            value={form.overtime_wage_percent}
            onChange={(e) =>
              handleChange("overtime_wage_percent", e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Created By"
            className="w-full border rounded-xl p-3 text-black"
            value={form.created_by}
            onChange={(e) => handleChange("created_by", e.target.value)}
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.is_admin}
              onChange={(e) => handleChange("is_admin", e.target.checked)}
            />
            <span className="text-black">Is Admin</span>
          </label>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  );
}
