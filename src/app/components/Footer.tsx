"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/app/lib/firebase";

const menuItems = [
  { id: 1, label: "HOME", path: "/" },
  { id: 2, label: "Community", path: "/community" },
  { id: 3, label: "Chat", path: "/chatlist", requireAuth: true },
  { id: 5, label: "MY", path: "/mypage", requireAuth: true },
];

const Footer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = (item: (typeof menuItems)[number]) => {
    if (item.requireAuth && !auth.currentUser) {
      router.push("/login");
    } else {
      router.push(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-xl mx-auto h-[60px] bg-[#f8f8f8] border-t-2 border-[#cecece] flex justify-around items-center select-none">
      {menuItems.map((item) => {
        const isActive =
          pathname === item.path ||
          (item.path !== "/" && pathname.startsWith(item.path));
        return (
          <button
            key={item.id}
            onClick={() => handleNav(item)}
            aria-label={item.label}
            className="flex flex-col items-center justify-center flex-1 max-w-[150px] bg-none border-none outline-none"
            type="button"
          >
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-1 ${
                isActive
                  ? "border-orange-500 bg-orange-500"
                  : "border-gray-400 bg-transparent"
              }`}
            />
            <span className="text-[10px] text-[#777] select-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default React.memo(Footer);
