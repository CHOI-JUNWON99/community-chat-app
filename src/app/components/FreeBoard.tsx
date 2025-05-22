"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function FreeBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.slice(0, 20)); // 상위 20개만 표시
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-[70px] pb-[60px] max-w-xl mx-auto min-h-screen bg-white">
      <Navbar />
      <h2 className="text-xl font-bold text-center py-4">Free Board</h2>
      {loading ? (
        <p className="text-center py-10">불러오는 중...</p>
      ) : (
        <div className="p-4 space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border p-4 rounded shadow hover:bg-gray-50"
            >
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{post.body}</p>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}
