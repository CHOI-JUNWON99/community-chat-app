import { Suspense } from "react";
import CommunityClient from "./CommunityClient";

export default function CommunityPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading Community...</div>}>
      <CommunityClient />
    </Suspense>
  );
}
