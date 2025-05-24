"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function FreeBoard() {
  const { data: posts = [], isLoading } = useSWR<Post[]>(
    "https://jsonplaceholder.typicode.com/posts",
    fetcher,
    { dedupingInterval: 60000 }
  );

  return (
    <div className="pt-[70px] pb-[60px] max-w-xl mx-auto min-h-screen bg-white">
      <Navbar />
      <h2 className="text-xl font-bold text-center py-4">Free Board</h2>
      {isLoading ? (
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
