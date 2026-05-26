"use client";

import { useState } from "react";

export function CheckoutButton({
  tierId,
  townSlug,
  townName,
}: {
  tierId: string;
  townSlug: string;
  townName: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId, townSlug, townName }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="mt-4 w-full bg-primary text-white py-2.5 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {loading ? "Redirecting..." : "Subscribe"}
    </button>
  );
}
