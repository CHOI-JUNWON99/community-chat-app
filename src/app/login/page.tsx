"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("✅ login success:", result.user);
      router.push("/");
    } catch (error) {
      console.error("❌ login failed:", error);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-[300px] p-8 border border-gray-300 rounded-2xl bg-white shadow-md text-center">
        <div className="mb-6">
          <img
            src="/placeholder.jpg"
            alt="logo"
            className="w-36 h-auto mx-auto"
          />
        </div>
        <h1 className="text-3xl font-bold text-blue-500 mb-8">LOGIN</h1>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-12 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
        >
          {loading ? "Login in progress..." : "Login with Google"}
        </button>
      </div>
    </div>
  );
}
