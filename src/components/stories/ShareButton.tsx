"use client";
import { Share2 } from "lucide-react";
import { useState } from "react";

export function ShareButton({ label }: { label: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const shareData = { title: document.title, url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button
      type="button"
      className="flex h-fit items-center gap-2 text-sm text-muted-foreground hover:text-espresso"
      aria-label={label}
      onClick={() => void share()}
    >
      <Share2 size={17} />
      {copied ? "Copied" : label}
    </button>
  );
}
