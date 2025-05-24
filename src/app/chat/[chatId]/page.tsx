"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { FixedSizeList as List } from "react-window";

interface Message {
  id: string;
  sender_uid: string;
  content: string;
  created_at: Timestamp;
  read: boolean;
}

const VIRTUALIZE_THRESHOLD = 200;

export default function ChatRoom() {
  const { chatId } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스크롤 아래로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 채팅 실시간 수신
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId as string, "messages"),
      orderBy("created_at", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(loadedMessages);

      scrollToBottom(); // 새 메시지 오면 스크롤 아래로
    });

    return () => unsubscribe();
  }, [chatId]);

  // 읽음 처리
  useEffect(() => {
    if (!chatId || !auth.currentUser) return;
    const userUid = auth.currentUser.uid;

    const markMessagesAsRead = async () => {
      const q = query(
        collection(db, "chats", chatId as string, "messages"),
        where("read", "==", false)
      );

      const snapshot = await getDocs(q);
      snapshot.forEach(async (docSnap) => {
        const message = docSnap.data();
        if (message.sender_uid !== userUid) {
          await updateDoc(
            doc(db, "chats", chatId as string, "messages", docSnap.id),
            {
              read: true,
            }
          );
        }
      });
    };

    markMessagesAsRead();
  }, [chatId]);

  // 메세지 보내기
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "chats", chatId as string, "messages"), {
        sender_uid: auth.currentUser?.uid,
        content: newMessage.trim(),
        created_at: serverTimestamp(),
        read: false,
      });

      await updateDoc(doc(db, "chats", chatId as string), {
        last_message: newMessage.trim(),
        last_message_at: serverTimestamp(),
      });

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Message failed to send:", error);
    }
  };

  // 채팅방 나가기
  const handleLeaveChatRoom = async () => {
    const confirm = window.confirm(
      "Are you sure you want to leave this chat room?"
    );
    if (!confirm || !auth.currentUser) return;

    try {
      const currentUid = auth.currentUser.uid;
      const chatRef = doc(db, "chats", chatId as string);

      // 현재 유저가 user1이면 user1_exited 필드 true로
      const exitField =
        currentUid === "user1_uid" ? "user1_exited" : "user2_exited";

      await updateDoc(chatRef, {
        [exitField]: true,
      });

      router.push("/chat");
    } catch (error) {
      console.error("Failed to leave the chat room:", error);
      alert("An error occurred while leaving the chat room.");
    }
  };

  const useVirtualization = messages.length > VIRTUALIZE_THRESHOLD;

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const msg = messages[index];
    if (!msg) return null;
    return (
      <div
        key={msg.id}
        style={style}
        className={`flex ${
          msg.sender_uid === auth.currentUser?.uid
            ? "justify-end"
            : "justify-start"
        } mb-2`}
      >
        <div
          className={`max-w-[70%] p-2 rounded-md text-sm ${
            msg.sender_uid === auth.currentUser?.uid
              ? "bg-yellow-300 text-right"
              : "bg-gray-200 text-left"
          }`}
        >
          {msg.content}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-[70px] pb-[60px] max-w-xl mx-auto min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-5">
        {useVirtualization ? (
          <List
            height={600}
            itemCount={messages.length}
            itemSize={50}
            width={"100%"}
            style={{ maxWidth: "100%" }}
          >
            {Row}
          </List>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_uid === auth.currentUser?.uid
                  ? "justify-end"
                  : "justify-start"
              } mb-2`}
            >
              <div
                className={`max-w-[70%] p-2 rounded-md text-sm ${
                  msg.sender_uid === auth.currentUser?.uid
                    ? "bg-yellow-300 text-right"
                    : "bg-gray-200 text-left"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </main>

      <div className="flex items-center gap-2 p-4 border-t">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Please enter a message"
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={handleSend}
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
        >
          Send
        </button>
      </div>

      <div className="p-4">
        <button
          onClick={handleLeaveChatRoom}
          className="w-full bg-red-400 hover:bg-red-500 text-white font-bold py-2 rounded"
        >
          Leave Chat Room
        </button>
      </div>

      <Footer />
    </div>
  );
}
