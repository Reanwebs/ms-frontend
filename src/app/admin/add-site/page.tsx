"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AddSite() {
  const router = useRouter();
  const [form, setForm] = useState({
    siteName: "",
    location: "",
    manager: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Site Added:", form);
    alert("Site added successfully!");
    router.push("/admin/dashboard");
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

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Add Site</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Site Name"
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-gray-300"
            value={form.siteName}
            onChange={(e) => setForm({ ...form, siteName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-gray-300"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Site Manager"
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-gray-300"
            value={form.manager}
            onChange={(e) => setForm({ ...form, manager: e.target.value })}
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Add Site
          </button>
        </form>
      </div>
    </div>
  );
}
