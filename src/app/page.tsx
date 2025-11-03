"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "user" | null>(null);

  const handleContinue = () => {
    if (role === "admin") {
      router.push("/admin/login");
    } else if (role === "user") {
      router.push("/user/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      {/* Illustration */}
      <div className="w-64 h-64 mb-6 relative">
        <Image
          src="/login-illustration.png"
          alt="Login illustration"
          fill
          className="object-contain"
        />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800">Welcome Back</h1>
      <p className="text-gray-500 mt-1 text-center">
        Please select your role! <br />
        <span className="text-sm">To Continue..</span>
      </p>

      {/* Role Buttons */}
      <div className="w-full max-w-sm mt-8 space-y-3">
        <button
          onClick={() => setRole("admin")}
          className={`w-full border rounded-xl py-3 text-gray-800 font-medium transition ${
            role === "admin"
              ? "bg-blue-100 border-blue-500"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          Admin
        </button>

        <button
          onClick={() => setRole("user")}
          className={`w-full border rounded-xl py-3 text-gray-800 font-medium transition ${
            role === "user"
              ? "bg-blue-100 border-blue-500"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          User
        </button>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={!role}
        className={`w-full max-w-sm mt-8 py-3 rounded-xl font-semibold transition ${
          role
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
