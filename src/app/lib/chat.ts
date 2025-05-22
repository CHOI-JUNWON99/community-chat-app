import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import { redirect } from "next/navigation";

export async function createChatRoom(
  targetUserUid: string,
  targetUserEmail: string
) {
  if (!auth.currentUser) {
    redirect("/login");
    return;
  }

  const currentUid = auth.currentUser.uid;
  const currentEmail = auth.currentUser.email ?? "noemail@example.com";

  // 항상 정렬된 배열로 구성 (중복 방지용)
  const userPair = [currentUid, targetUserUid].sort();

  const q = query(collection(db, "chats"), where("user_uids", "==", userPair));

  const existingChats = await getDocs(q);

  if (!existingChats.empty) {
    const existingChatId = existingChats.docs[0].id;
    redirect(`/chat/${existingChatId}`);
  } else {
    const newChatRef = await addDoc(collection(db, "chats"), {
      user1_uid: currentUid,
      user1_email: currentEmail,
      user2_uid: targetUserUid,
      user2_email: targetUserEmail,
      user_uids: userPair,
      user1_exited: false,
      user2_exited: false,
      created_at: serverTimestamp(),
      last_message: "",
      last_message_at: serverTimestamp(),
    });

    redirect(`/chat/${newChatRef.id}`);
  }
}
