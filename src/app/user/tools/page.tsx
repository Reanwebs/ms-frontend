"use client";

import { useState } from "react";
import { Wrench, CheckCircle, ArrowLeftCircle } from "lucide-react";

export default function ToolsPage() {
  const [tools, setTools] = useState([
    { id: 1, name: "Hammer", status: "available" },
    { id: 2, name: "Drill Machine", status: "borrowed" },
    { id: 3, name: "Screwdriver Set", status: "available" },
    { id: 4, name: "Measuring Tape", status: "available" },
  ]);

  const handleAction = (id: number) => {
    setTools((prev) =>
      prev.map((tool) =>
        tool.id === id
          ? {
              ...tool,
              status: tool.status === "available" ? "borrowed" : "available",
            }
          : tool
      )
    );
  };

  return (
    <div className="max-w-md mx-auto mt-8 space-y-6">
      <h1 className="text-xl font-semibold text-black text-center">
        Active Tools
      </h1>

      <div className="space-y-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-md"
          >
            <div className="flex items-center gap-3">
              <Wrench
                size={22}
                className={`${
                  tool.status === "available"
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}
              />
              <div>
                <p className="text-gray-800 font-medium">{tool.name}</p>
                <p className="text-xs text-gray-500">
                  {tool.status === "available"
                    ? "Available"
                    : "Currently borrowed"}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAction(tool.id)}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition ${
                tool.status === "available"
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
            >
              {tool.status === "available" ? (
                <>
                  <CheckCircle size={16} /> Request
                </>
              ) : (
                <>
                  <ArrowLeftCircle size={16} /> Return
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
