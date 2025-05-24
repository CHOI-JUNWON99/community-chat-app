"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";

const Navbar = lazy(() => import("@/app/components/Navbar"));
const Footer = lazy(() => import("@/app/components/Footer"));

interface UserProfile {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export default function MyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setProfile({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="pt-[70px] pb-[60px] min-h-screen max-w-xl mx-auto bg-white shadow-md flex flex-col">
      <Suspense fallback={<div>Loading Navbar...</div>}>
        <Navbar />
      </Suspense>

      {/* 프로필 섹션 */}
      <section className="p-5 border-b border-gray-200 flex items-center justify-between relative mt-8">
        <div className="flex items-center gap-4">
          <div
            className="w-[70px] h-[70px] bg-gray-300 rounded-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                profile?.photoURL || "/placeholder.jpg"
              })`,
            }}
          />
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-700">
              {profile?.displayName || "닉네임 없음"}
            </h2>
            <p className="text-sm text-gray-400">
              {profile?.email || "이메일 없음"}
            </p>
          </div>
        </div>
        <div className="absolute top-5 right-5 flex gap-3">
          <button
            className="text-gray-500 text-lg"
            onClick={() => router.push("/message")}
          >
            ✉️
          </button>
        </div>
      </section>

      {/* 자기소개 */}
      <section className="p-5 border-b border-gray-200">
        <h3 className="text-gray-700 font-bold mb-2">Self-Introduction</h3>
        <p className="text-gray-600">Please enter your self-introduction</p>
      </section>

      {/* 내가 좋아요한 게시물 */}
      <section className="p-5 border-b border-gray-200">
        <h3 className="text-gray-700 font-bold mb-2">Posts I Liked</h3>
        <div className="flex flex-col gap-3">
          <div className="border-b border-gray-100 pb-2">
            <p className="text-xs text-gray-500">school</p>
            <p className="text-sm font-bold text-gray-700">
              How do I register for classes at school?
            </p>
          </div>
          <div className="border-b border-gray-100 pb-2">
            <p className="text-xs text-gray-500">school</p>
            <p className="text-sm font-bold text-gray-700">
              How to join the student council
            </p>
          </div>
        </div>
      </section>

      {/* 친구목록록*/}
      <section className="p-5 border-b border-gray-200">
        <h3 className="text-gray-700 font-bold mb-2">Friends List</h3>
        <div className="flex flex-col gap-3">
          <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">Andrew</p>
            <button
              className="text-gray-500 text-lg"
              onClick={() => router.push("/message")}
            >
              ✉️
            </button>
          </div>
          <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">Agata</p>
            <button
              className="text-gray-500 text-lg"
              onClick={() => router.push("/message")}
            >
              ✉️
            </button>
          </div>
          <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">Atajan</p>
            <button
              className="text-gray-500 text-lg"
              onClick={() => router.push("/message")}
            >
              ✉️
            </button>
          </div>
          <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">Helena</p>
            <button
              className="text-gray-500 text-lg"
              onClick={() => router.push("/message")}
            >
              ✉️
            </button>
          </div>
          <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-700">Jason</p>
            <button
              className="text-gray-500 text-lg"
              onClick={() => router.push("/message")}
            >
              ✉️
            </button>
          </div>
        </div>
      </section>

      {/* 로그아웃 / 회원탈퇴 */}
      <div className="flex flex-col items-center mt-8 mb-20">
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700 mb-3 text-sm"
        >
          LOGOUT
        </button>
        <button
          onClick={() => router.push("/withdraw")}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          MEMBERSHIP WITHDRAWAL
        </button>
      </div>

      <Suspense fallback={<div>Loading Footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}
