"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Home, User } from "lucide-react";

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        <Link href="/user/tools" className={`flex flex-col items-center ${pathname.includes("tools") ? "text-black" : "text-gray-400"}`}>
          <Briefcase size={20} />
          <span className="text-xs">Tools</span>
        </Link>

        <Link href="/user/home" className={`flex flex-col items-center ${pathname.includes("home") ? "text-black" : "text-gray-400"}`}>
          <Home size={20} />
          <span className="text-xs">Home</span>
        </Link>

        <Link href="/user/profile" className={`flex flex-col items-center ${pathname.includes("profile") ? "text-black" : "text-gray-400"}`}>
          <User size={20} />
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
