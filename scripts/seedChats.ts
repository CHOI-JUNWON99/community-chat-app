import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedChats() {
  for (let i = 0; i < 100; i++) {
    const chatDoc = await addDoc(collection(db, "chats"), {
      user1_uid: `uid-${i}`,
      user2_uid: `uid-${i + 100}`,
      user1_email: `user${i}@example.com`,
      user2_email: `user${i + 100}@example.com`,
      user_uids: [`uid-${i}`, `uid-${i + 100}`].sort(),
      created_at: serverTimestamp(),
      last_message: `Hello from chat ${i}`,
      last_message_at: serverTimestamp(),
      user1_exited: false,
      user2_exited: false,
    });

    const msgRef = collection(db, "chats", chatDoc.id, "messages");
    for (let j = 0; j < 100; j++) {
      await addDoc(msgRef, {
        sender_uid: j % 2 === 0 ? `uid-${i}` : `uid-${i + 100}`,
        content: `메시지 ${j} from chat ${i}`,
        created_at: serverTimestamp(),
        read: false,
      });
    }
  }
  console.log("100개 채팅방 + 메시지 삽입 완료");
}
seedChats();
