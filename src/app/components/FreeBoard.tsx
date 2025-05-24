"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import { FixedSizeList as List } from "react-window";

const PAGE_SIZE = 20;
const VIRTUALIZE_THRESHOLD = 100; // 100개 이상일 때만 가상화

const fetchPosts = async ({ pageParam = 0 }) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_start=${pageParam}&_limit=${PAGE_SIZE}`
  );
  return res.json();
};

export default function FreeBoard() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["freeboard-posts"],
      queryFn: fetchPosts,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === PAGE_SIZE) {
          return allPages.length * PAGE_SIZE;
        }
        return undefined;
      },
      initialPageParam: 0,
    });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasNextPage || isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, fetchNextPage, isLoading]);

  const posts = data?.pages.flat() ?? [];
  const useVirtualization = posts.length > VIRTUALIZE_THRESHOLD;

  // react-window row renderer
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const post = posts[index];
    if (!post) return null;
    return (
      <div
        key={post.id}
        style={style}
        className="border p-4 rounded shadow hover:bg-gray-50"
      >
        <h3 className="text-lg font-semibold">{post.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{post.body}</p>
      </div>
    );
  };

  return (
    <div className="pt-[70px] pb-[60px] max-w-xl mx-auto min-h-screen bg-white">
      <Navbar />
      <h2 className="text-xl font-bold text-center py-4">Free Board</h2>
      {isLoading ? (
        <p className="text-center py-10">불러오는 중...</p>
      ) : (
        <div className="p-4">
          {useVirtualization ? (
            <List
              height={600}
              itemCount={posts.length}
              itemSize={100}
              width={"100%"}
              style={{ maxWidth: "100%" }}
            >
              {Row}
            </List>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="border p-4 rounded shadow hover:bg-gray-50"
              >
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{post.body}</p>
              </div>
            ))
          )}
          {hasNextPage && (
            <div ref={loadMoreRef} className="text-center py-4 text-gray-400">
              {isFetchingNextPage ? "불러오는 중..." : "더 불러오기..."}
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}
