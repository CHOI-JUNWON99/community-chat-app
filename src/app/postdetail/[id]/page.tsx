"use client";

import { useParams, useRouter } from "next/navigation";
import { createChatRoom } from "@/app/lib/chat";
//import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Post {
  id: string;
  author_email: string;
  author_nickname: string;
  author_uid: string;
  title: string;
  content: string;
  likes_count: number;
  comments_count: number;
  type: string;
  created_at: Timestamp;
}

const fetchPost = async (postId: string | undefined) => {
  if (!postId) return null;
  const docRef = doc(db, "posts", postId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()
    ? ({ id: docSnap.id, ...docSnap.data() } as Post)
    : null;
};

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const postId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
    enabled: !!postId,
    staleTime: 1000 * 60,
  });

  const queryClient = useQueryClient();

  const handleLike = async () => {
    if (!postId) return;
    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        likes_count: increment(1),
      });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!post) return;
    const chatId = await createChatRoom(post.author_uid, post.author_email);
    if (chatId) {
      router.push(`/chat/${chatId}`);
    } else {
      router.push("/login");
    }
  };

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center mt-10">Cannot Find Post</div>;
  }

  return (
    <div className="pt-[70px] pb-[60px] max-w-xl mx-auto min-h-screen bg-white">
      <Navbar />

      <main className="p-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-yellow-500">{post.title}</h1>
          <div className="text-sm text-gray-500 mt-2">
            {post.author_nickname} ({post.author_email})
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {post.created_at?.toDate
              ? post.created_at.toDate().toLocaleString()
              : ""}
          </div>
        </div>

        <div className="border p-4 rounded-md text-gray-700 leading-relaxed">
          {post.content}
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handleLike}
            className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded font-bold"
          >
            ❤️ Like {post.likes_count}
          </button>
          <button
            onClick={handleSendMessage}
            className="bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded font-bold"
          >
            ✉️ Send Message
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
