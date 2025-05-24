// src/components/Header.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 w-full h-[130px] bg-white border-b z-50 flex items-center justify-between px-4 shadow-sm">
      <h1 className="text-xl font-bold text-orange-500">{title}</h1>
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-500 border px-3 py-1 rounded hover:bg-gray-100"
      >
        뒤로가기
      </button>
    </header>
  );
};

export default React.memo(Header);
