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

const myUid = "z23puQrVwQSL1FVRHePLKH5dnZu2";
const myEmail = "sunlift10000@gmail.com";

async function seedChats() {
  try {
    for (let i = 0; i < 100; i++) {
      const user1_uid = myUid;
      const user2_uid = `uid-${i}`;
      const user1_email = myEmail;
      const user2_email = `user${i}@example.com`;

      const chatDoc = await addDoc(collection(db, "chats"), {
        user1_uid,
        user2_uid,
        user1_email,
        user2_email,
        user_uids: [user1_uid, user2_uid].sort(),
        created_at: serverTimestamp(),
        last_message: `Hello from chat ${i}`,
        last_message_at: serverTimestamp(),
        user1_exited: false,
        user2_exited: false,
      });

      const msgRef = collection(db, "chats", chatDoc.id, "messages");
      for (let j = 0; j < 20; j++) {
        await addDoc(msgRef, {
          sender_uid: j % 2 === 0 ? user1_uid : user2_uid,
          content: `메시지 ${j} from chat ${i}`,
          created_at: serverTimestamp(),
          read: false,
        });
      }

      if ((i + 1) % 10 === 0) {
        console.log(`${i + 1}개 채팅방 생성 완료`);
      }
    }

    console.log("✅ 100개 채팅방 + 메시지 삽입 완료");
  } catch (error) {
    console.error("❌ 에러 발생:", error);
  }
}

seedChats();
