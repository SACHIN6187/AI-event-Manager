"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useConvexQuery } from "./use-convex-query";
import { api } from "@/convex/_generated/api";
const ATTENDEE_PAGES = ["/explore", "/events", "/my-tickets", "/profile"];

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: currentUser, isLoading } = useConvexQuery(
    api.users.getCurrentUser
  );

  useEffect(() => {
    if (isLoading || !currentUser) return;

    if (!currentUser.hasCompletedOnboarding) {
      const requiresOnboarding = ATTENDEE_PAGES.some((page) =>
        pathname.startsWith(page)
      );

      if (requiresOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [currentUser, isLoading, pathname]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    router.refresh();
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    router.push("/");
  };

  return {
    showOnboarding,
    setShowOnboarding,
    handleOnboardingComplete,
    handleOnboardingSkip,
    needsOnboarding: currentUser && !currentUser.hasCompletedOnboarding,
  };
}