// lib/firebaseAuth.ts
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("✅ 로그인 성공:", user);
    return user;
  } catch (error) {
    console.error("❌ 로그인 실패:", error);
    throw error;
  }
};
