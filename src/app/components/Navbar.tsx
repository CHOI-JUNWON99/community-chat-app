"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Hide back button on main page
  const hideBackButton = pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-xl mx-auto h-[70px] bg-[#F9F9F9] border-b border-[#777] flex items-center justify-center select-none">
      <div className="w-full max-w-xl flex items-center justify-between px-5 relative">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className={`bg-none border-none text-[20px] cursor-pointer text-black  p-0 flex items-center transition-opacity duration-200 ${
            hideBackButton ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          aria-hidden={hideBackButton}
          tabIndex={hideBackButton ? -1 : 0}
        >
          {"<"} <span className="ml-1 hidden sm:inline">Back</span>
        </button>
        {/* Title */}
        <h1
          className="absolute left-1/2 transform -translate-x-1/2 text-[20px] font-bold text-black text-center cursor-pointer select-none m-0"
          onClick={() => router.push("/")}
        >
          USTB
        </h1>
        {/* Spacer for right side */}
        <div className="w-[60px]" />
      </div>
    </header>
  );
};

export default React.memo(Navbar);
