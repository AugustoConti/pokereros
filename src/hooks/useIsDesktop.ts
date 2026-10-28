import { useSyncExternalStore } from "react";

// Tailwind's `lg` breakpoint: from here on there's room for the table and the lists side by side.
const DESKTOP_QUERY = "(min-width: 64rem)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);

  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
}

/** Whether the screen is wide enough for the desktop layout. */
export function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}
