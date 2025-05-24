import { auth } from "@/app/lib/firebase";

export async function createChatRoom(
  targetUserUid: string,
  targetUserEmail: string
): Promise<string | null> {
  if (!auth.currentUser) {
    // 클라이언트에서 직접 router.push("/login") 처리 필요
    return null;
  }

  const currentUid = auth.currentUser.uid;
  const currentEmail = auth.currentUser.email ?? "noemail@example.com";

  const res = await fetch("/api/create-chat-room", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      currentUid,
      currentEmail,
      targetUserUid,
      targetUserEmail,
    }),
  });
  const data = await res.json();
  return data.chatId || null;
}
