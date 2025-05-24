import type { NextApiRequest, NextApiResponse } from "next";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { currentUid, currentEmail, targetUserUid, targetUserEmail } = req.body;
  if (!currentUid || !targetUserUid)
    return res.status(400).json({ error: "Missing user info" });

  const userPair = [currentUid, targetUserUid].sort();
  const q = query(collection(db, "chats"), where("user_uids", "==", userPair));
  const existingChats = await getDocs(q);

  if (!existingChats.empty) {
    const existingChatId = existingChats.docs[0].id;
    return res.status(200).json({ chatId: existingChatId });
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
    return res.status(200).json({ chatId: newChatRef.id });
  }
}
