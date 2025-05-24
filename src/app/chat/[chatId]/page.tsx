import { db } from "@/app/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import ChatRoomClient from "./ChatRoomClient";

export default async function ChatRoomPage({
  params,
}: {
  params: { chatId: string };
}) {
  const { chatId } = params;
  // 서버에서 메시지 미리 fetch
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("created_at", "asc")
  );
  const snapshot = await getDocs(q);
  const messages = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      sender_uid: data.sender_uid,
      content: data.content,
      created_at:
        data.created_at && typeof data.created_at.toMillis === "function"
          ? data.created_at.toMillis()
          : null,
      read: data.read,
    };
  });
  return <ChatRoomClient chatId={chatId} initialMessages={messages} />;
}
