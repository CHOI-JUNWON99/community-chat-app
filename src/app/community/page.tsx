"use client";

import { useSearchParams } from "next/navigation";
import Community from "@/app/components/Community";
import FreeBoard from "@/app/components/FreeBoard";

export default function CommunityPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return type === "free" ? <FreeBoard /> : <Community />;
}
