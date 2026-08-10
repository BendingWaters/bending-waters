import type { Metadata } from "next";
import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export const metadata: Metadata = {
  title: "You're on the list — BendingWaters",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-5">
      <div className="size-8 animate-spin rounded-full border-2 border-white/15 border-t-primary" />
    </div>
  );
}
