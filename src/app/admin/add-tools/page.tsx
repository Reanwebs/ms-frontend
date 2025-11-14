"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AddTools() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    category: "",
    sub_category: "",
    tool_id: "",
    count: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/tools/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          count: parseFloat(form.count),
        }),
      }
    );

    if (!res.ok) return alert("Failed to add tool");

    alert("Tool added!");
    router.push("/admin/tools");
  };

  const fields = ["name", "category", "sub_category", "tool_id", "count"];

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <button onClick={() => router.back()} className="flex items-center mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>

        <h1 className="text-2xl font-semibold text-black mb-6">Add Tool</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <input
              key={field}
              type={field === "count" ? "number" : "text"}
              placeholder={field.replace("_", " ").toUpperCase()}
              className="w-full border rounded-xl p-3 text-black"
              value={(form as any)[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
            />
          ))}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            Add Tool
          </button>
        </form>
      </div>
    </div>
  );
}
