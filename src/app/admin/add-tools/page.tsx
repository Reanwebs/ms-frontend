"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AddTools() {
  const router = useRouter();
  const [form, setForm] = useState({
    toolName: "",
    quantity: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tool Added:", form);
    alert("Tool added successfully!");
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

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Tool
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Tool Name"
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-gray-300"
            value={form.toolName}
            onChange={(e) => setForm({ ...form, toolName: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring focus:ring-gray-300"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Add Tool
          </button>
        </form>
      </div>
    </div>
  );
}
