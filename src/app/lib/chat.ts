import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
// import { redirect } from "next/navigation";

export async function createChatRoom(
  targetUserUid: string,
  targetUserEmail: string
): Promise<string | null> {
  if (!auth.currentUser) {
    return null;
  }

  const currentUid = auth.currentUser.uid;
  const currentEmail = auth.currentUser.email ?? "noemail@example.com";
  const userPair = [currentUid, targetUserUid].sort();
  const q = query(collection(db, "chats"), where("user_uids", "==", userPair));
  const existingChats = await getDocs(q);

  if (!existingChats.empty) {
    return existingChats.docs[0].id;
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
    return newChatRef.id;
  }
}
