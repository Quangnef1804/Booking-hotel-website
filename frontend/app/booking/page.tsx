import { Suspense } from "react";
import BookingPageClient from "./BookingPageClient";

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <BookingPageClient />
    </Suspense>
  );
}
