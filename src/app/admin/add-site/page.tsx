"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
const MapPicker = dynamic(() => import("@/app/components/MapPicker"), {
  ssr: false,
});

export default function AddSite() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    district: "",
    state: "",
    longitude: "",
    latitude: "",
    start_date: "",
    deadline: "",
  });

  const handleMapSelect = ({ lat, lng }: any) => {
    setForm({
      ...form,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/site/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          longitude: parseFloat(form.longitude),
          latitude: parseFloat(form.latitude),
          start_date: parseInt(form.start_date),
          deadline: parseInt(form.deadline),
        }),
      }
    );

    if (!res.ok) {
      alert("Failed to add site");
      return;
    }

    alert("Site added successfully!");
    router.push("/admin/sites");
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center text-black">
      <div className="w-full max-w-lg">
        <button onClick={() => router.back()} className="flex items-center mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>

        <h1 className="text-2xl font-bold mb-6">Add Site</h1>

        {/* MAP PICKER */}
        <label className="font-semibold mb-2 block">Select Location</label>
        <MapPicker
          lat={form.latitude ? parseFloat(form.latitude) : null}
          lng={form.longitude ? parseFloat(form.longitude) : null}
          onSelect={handleMapSelect}
        />

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {["name", "district", "state", "start_date", "deadline"].map(
            (field) => (
              <input
                key={field}
                type="text"
                placeholder={field.replace("_", " ").toUpperCase()}
                className="w-full border p-3 rounded-xl"
                value={(form as any)[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                required
              />
            )
          )}

          {/* Latitude & Longitude (readonly) */}
          <input
            type="text"
            className="w-full border p-3 rounded-xl bg-gray-100"
            value={form.latitude}
            placeholder="LATITUDE (auto from map)"
            readOnly
            required
          />

          <input
            type="text"
            className="w-full border p-3 rounded-xl bg-gray-100"
            value={form.longitude}
            placeholder="LONGITUDE (auto from map)"
            readOnly
            required
          />

          <button type="submit" className="w-full bg-black text-white p-3 rounded-xl">
            Add Site
          </button>
        </form>
      </div>
    </div>
  );
}
