import { Suspense, lazy } from "react";
const CommunityClient = lazy(() => import("./CommunityClient"));

export default function CommunityPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading Community...</div>}>
      <CommunityClient />
    </Suspense>
  );
}
