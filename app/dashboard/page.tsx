"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";
import { InteractiveDashboard } from "@/app/components/sections/InteractiveDashboard";
import { Navbar } from "@/app/components/layout/Navbar";

export default function DashboardPage() {
  const { user, isAuthenticated, addPoints } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handleCollection = useCallback(
    (pts: number) => {
      addPoints(pts);
    },
    [addPoints]
  );

  if (!user) {
    return null;
  }

  const firstName = user.name.split(" ")[0];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <InteractiveDashboard
          userName={firstName}
          userPoints={user.points}
          userActivity={user.activityLog}
          onCollectionComplete={handleCollection}
        />
      </main>
    </>
  );
}
