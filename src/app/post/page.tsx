"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function PostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("Login is required.");
      router.push("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("Please enter both the title and the content.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "posts"), {
        title,
        content,
        type,
        author_uid: auth.currentUser.uid,
        author_email: auth.currentUser.email, // ✅ 추가
        author_nickname: auth.currentUser.displayName || "익명",
        created_at: serverTimestamp(),
      });

      alert("Your post has been successfully uploaded!");
      router.push("/community");
    } catch (error) {
      console.error("Post upload failed:", error);
      alert("An error occurred while uploading the post.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="pt-[70px] pb-[60px] max-w-xl mx-auto min-h-screen bg-white">
      <Navbar />

      <main className="p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="category"
              className="font-bold text-gray-700 block mb-2"
            >
              Category
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            >
              <option value="">Choose a category</option>
              <option value="school">school community</option>
              <option value="free">free community</option>
              <option value="club">club community</option>
              <option value="market">market community</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="title"
              className="font-bold text-gray-700 block mb-2"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="input title"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="font-bold text-gray-700 block mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="input content"
              className="w-full h-80 p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-[45%] bg-gray-300 text-gray-700 font-bold py-2 rounded hover:bg-gray-400"
            >
              Cancle
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-[45%] bg-yellow-400 text-white font-bold py-2 rounded hover:bg-yellow-500"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
