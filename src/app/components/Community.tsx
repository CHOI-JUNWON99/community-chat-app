"use client";

import { useState, useCallback, useMemo, useTransition } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "@/app/lib/firebase";
import Navbar from "@/app/components/Navbar";
import Button from "@/app/components/Button";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useQuery } from "@tanstack/react-query";
import { FixedSizeList as List } from "react-window";

interface Post {
  id: string;
  title: string;
  author_nickname: string;
  likes_count: number;
  comments_count: number;
  created_at: Timestamp;
  author_email: string;
}

const fetchPosts = async () => {
  const snapshot = await getDocs(collection(db, "posts"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
};

const VIRTUALIZE_THRESHOLD = 100;

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [, startTransition] = useTransition();

  const { data: postsData = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60, // 1분간 fresh
  });

  const handleSearchChange = useCallback((query: string) => {
    startTransition(() => {
      setSearchQuery(query);
    });
  }, []);

  const handleWrite = () => router.push("/post");

  const filteredPosts = useMemo(
    () =>
      postsData.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [postsData, searchQuery]
  );

  const useVirtualization = filteredPosts.length > VIRTUALIZE_THRESHOLD;

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const post = filteredPosts[index];
    if (!post) return null;
    return (
      <div
        key={post.id}
        style={style}
        className="flex gap-4 border-b py-3 cursor-pointer hover:bg-gray-50"
      >
        <Link href={`/postdetail/${post.id}`} className="flex gap-4 w-full">
          <div className="w-[70px] h-[70px] rounded bg-cover bg-center bg-gray-300 overflow-hidden flex items-center justify-center">
            <img
              src="/placeholder.jpg"
              alt="post"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 relative">
            <h4 className="text-md font-bold mb-1">
              {post.title.length > 35
                ? `${post.title.slice(0, 35)}...`
                : post.title}
            </h4>
            <div className="text-sm font-semibold text-gray-600 flex gap-2"></div>
            <div className="flex text-sm text-gray-500 mt-1 gap-3">
              <span>❤️ {post.likes_count}</span>
              <span>💬 {post.comments_count}</span>
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-right text-xs text-gray-500">
              {/* <span>{post.author_email}</span> */}
              <div>
                {post.created_at?.toDate
                  ? post.created_at.toDate().toLocaleString()
                  : ""}
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="pt-[70px] pb-[60px] max-w-xl mx-auto min-h-screen bg-white">
      <Navbar />
      <div className="sticky top-0 z-50 w-full bg-gray-100 p-2 flex items-center gap-2 border-b border-gray-200">
        <input
          type="text"
          className="flex-1 px-2 py-1 border rounded-md text-sm"
          placeholder="Search"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <Button onClick={handleWrite} className="bg-orange-400 text-white">
          Write
        </Button>
      </div>

      <div className="my-6">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div className="flex gap-4 items-center py-2" key={`skeleton-${i}`}>
              <Skeleton width={70} height={70} />
              <div className="flex-1">
                <Skeleton height={20} width={200} />
                <Skeleton height={15} width={150} className="mt-2" />
              </div>
              <Skeleton width={80} height={15} />
            </div>
          ))
        ) : filteredPosts.length > 0 ? (
          useVirtualization ? (
            <List
              height={600}
              itemCount={filteredPosts.length}
              itemSize={100}
              width={"100%"}
              style={{ maxWidth: "100%" }}
            >
              {Row}
            </List>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="flex gap-4 border-b py-3 cursor-pointer hover:bg-gray-50"
              >
                <Link
                  href={`/postdetail/${post.id}`}
                  className="flex gap-4 w-full"
                >
                  <div className="w-[70px] h-[70px] rounded bg-cover bg-center bg-gray-300 overflow-hidden flex items-center justify-center">
                    <img
                      src="/placeholder.jpg"
                      alt="post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <h4 className="text-md font-bold mb-1">
                      {post.title.length > 35
                        ? `${post.title.slice(0, 35)}...`
                        : post.title}
                    </h4>
                    <div className="text-sm font-semibold text-gray-600 flex gap-2"></div>
                    <div className="flex text-sm text-gray-500 mt-1 gap-3">
                      <span>❤️ {post.likes_count}</span>
                      <span>💬 {post.comments_count}</span>
                    </div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-right text-xs text-gray-500">
                      {/* <span>{post.author_email}</span> */}
                      <div>
                        {post.created_at?.toDate
                          ? post.created_at.toDate().toLocaleString()
                          : ""}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )
        ) : (
          <p className="text-center text-red-500">게시물이 없습니다.</p>
        )}
      </div>

      <Footer />
    </div>
  );
}
