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

async function seedPosts() {
  const postRef = collection(db, "posts");
  for (let i = 0; i < 500; i++) {
    await addDoc(postRef, {
      author_email: `testuser${i}@example.com`,
      author_nickname: `유저${i}`,
      author_uid: `uid-${i}`,
      comments_count: Math.floor(Math.random() * 20),
      content: `더미 게시글 내용 ${i}입니다.`,
      created_at: serverTimestamp(),
      likes_count: Math.floor(Math.random() * 100),
      title: `더미 게시글 ${i}`,
      type: ["school", "free", "club", "secondhand"][i % 4],
    });
  }
  console.log("500개 게시글 삽입 완료!");
}

seedPosts();
