"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface ChatRoom {
  id: string;
  user1_uid: string;
  user1_email: string;
  user2_uid: string;
  user2_email: string;
  user_uids: [string, string];
  user1_exited?: boolean;
  user2_exited?: boolean;
  last_message: string;
  last_message_at: Timestamp;
}

export default function ChatList() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login");
      return;
    }

    const userUid = auth.currentUser.uid;

    const q = query(
      collection(db, "chats"),
      where("user_uids", "array-contains", userUid),
      orderBy("last_message_at", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatRoom[];
      setChatRooms(chats);
    });

    return () => unsubscribe();
  }, []);

  const goToChatRoom = useCallback(
    (chatId: string) => {
      router.push(`/chat/${chatId}`);
    },
    [router]
  );

  const renderedChatRooms = useMemo(
    () =>
      chatRooms.length > 0 ? (
        chatRooms.map((room) => {
          const opponentEmail =
            auth.currentUser?.uid === room.user1_uid
              ? room.user2_email
              : room.user1_email;

          return (
            <div
              key={room.id}
              onClick={() => goToChatRoom(room.id)}
              className="border-b py-4 cursor-pointer hover:bg-gray-50"
            >
              <div className="font-bold text-gray-700">{opponentEmail}</div>
              <div className="text-sm text-gray-500 mt-1">
                {room.last_message
                  ? room.last_message.length > 30
                    ? room.last_message.slice(0, 30) + "..."
                    : room.last_message
                  : "There is no message"}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {room.last_message_at?.toDate
                  ? room.last_message_at.toDate().toLocaleString()
                  : ""}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-400 mt-20">No Chat Room</div>
      ),
    [chatRooms, goToChatRoom]
  );

  return (
    <div className="pt-[70px] pb-[60px] max-w-xl mx-auto min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-5">
        <h1 className="text-xl font-bold mb-6 text-yellow-500">Chat List</h1>
        {renderedChatRooms}
      </main>

      <Footer />
    </div>
  );
}
