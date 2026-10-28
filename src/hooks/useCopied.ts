import { useState } from "react";

/** Copies text to the clipboard and remembers for a moment that it did, to confirm it on screen. */
export function useCopied() {
  const [copied, setCopied] = useState(false);

  return {
    copied,
    copy: (text: string) => {
      void navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
  };
}
