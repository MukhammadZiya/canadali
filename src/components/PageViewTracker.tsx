"use client";

/**
 * Fires one tracking beacon per page view. Mounted once in the public
 * layout; usePathname changes on client-side navigation, so soft navigations
 * are counted too, not just full loads.
 */
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // keepalive lets the request finish even if the visitor navigates away
    // immediately — the classic lost-last-pageview problem.
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      // Analytics must never surface an error to a visitor.
    });
  }, [pathname]);

  return null;
}
