"use client";

import { useState } from "react";

const CATEGORIES = [
  "Restaurant & Dining",
  "Real Estate",
  "Home Services",
  "Health & Wellness",
  "Retail & Shopping",
  "Professional Services",
  "Education & Childcare",
  "Auto & Transportation",
  "Entertainment & Events",
  "Other",
];

interface ProfileData {
  businessName: string;
  description: string;
  website: string;
  phone: string;
  category: string;
}

export default function ProfileEditor({
  token,
  initialProfile,
}: {
  token: string;
  initialProfile: ProfileData;
}) {
  const [form, setForm] = useState<ProfileData>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "review";
    text: string;
  } | null>(null);

  const update = (field: keyof ProfileData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/sponsor/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...form }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.moderation) {
          const reason =
            data.moderation.reason || "Content did not pass review.";
          const flagged = data.moderation.flaggedFields?.join(", ");
          setMessage({
            type: "error",
            text: `Rejected: ${reason}${flagged ? ` (fields: ${flagged})` : ""}`,
          });
        } else {
          setMessage({ type: "error", text: data.error || "Save failed." });
        }
        return;
      }

      if (data.status === "pending_review") {
        setMessage({
          type: "review",
          text: data.message || "Your submission is under review by a moderator.",
        });
        return;
      }

      setMessage({ type: "success", text: "Profile updated and live!" });
    } catch {
      setMessage({ type: "error", text: "Network error. Try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Name
        </label>
        <input
          type="text"
          value={form.businessName}
          onChange={(e) => update("businessName", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
          placeholder="Tell residents about your business..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="(201) 555-0100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
        >
          <option value="">Select a category...</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : message.type === "review"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "review" && (
            <span className="font-semibold">Under Review: </span>
          )}
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
