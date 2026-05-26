"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef } from "react";

export default function ContentGenerator({
  token,
  townName,
  tierId,
}: {
  token: string;
  townName: string;
  tierId: string;
}) {
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/sponsor/generate",
      body: { token, townName, tierId },
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  const applyToProfile = async (field: string, value: string) => {
    setApplying(true);
    setApplyMessage(null);
    try {
      const res = await fetch("/api/sponsor/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, [field]: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApplyMessage(data.error || "Failed to apply.");
      } else {
        setApplyMessage(`Applied to ${field}!`);
      }
    } catch {
      setApplyMessage("Network error.");
    } finally {
      setApplying(false);
    }
  };

  const getTextContent = (msg: (typeof messages)[number]) => {
    return msg.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
  };

  const extractApplyable = (content: string) => {
    const blocks: { field: string; value: string; label: string }[] = [];
    const lines = content.split("\n");

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.includes("business name:")) {
        const val = line.split(":").slice(1).join(":").trim().replace(/^["']|["']$/g, "");
        if (val) blocks.push({ field: "businessName", value: val, label: "Business Name" });
      }
      if (lower.includes("description:") || lower.includes("business description:")) {
        const val = line.split(":").slice(1).join(":").trim().replace(/^["']|["']$/g, "");
        if (val) blocks.push({ field: "description", value: val, label: "Description" });
      }
      if (lower.includes("category:")) {
        const val = line.split(":").slice(1).join(":").trim().replace(/^["']|["']$/g, "");
        if (val) blocks.push({ field: "category", value: val, label: "Category" });
      }
    }

    if (content.includes("<div") || content.includes("<section")) {
      const htmlMatch = content.match(/<(?:div|section)[\s\S]*<\/(?:div|section)>/);
      if (htmlMatch) {
        blocks.push({
          field: "profileCardHtml",
          value: htmlMatch[0],
          label: "Profile Card HTML",
        });
      }
    }

    return blocks;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage({ text: inputValue });
    setInputValue("");
  };

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            Try: &ldquo;I run a pizza shop in {townName}. Help me write a great
            listing.&rdquo;
          </p>
        )}
        {messages.map((m) => {
          const text = getTextContent(m);
          return (
            <div
              key={m.id}
              className={`text-sm ${
                m.role === "user"
                  ? "text-gray-800 font-medium"
                  : "text-gray-600"
              }`}
            >
              <span className="text-xs text-gray-400 uppercase mr-2">
                {m.role === "user" ? "You" : "AI"}
              </span>
              <div className="mt-1 whitespace-pre-wrap">{text}</div>
              {m.role === "assistant" && text && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {extractApplyable(text).map((block) => (
                    <button
                      key={block.field}
                      type="button"
                      onClick={() => applyToProfile(block.field, block.value)}
                      disabled={applying}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 disabled:opacity-50"
                    >
                      Apply as {block.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <p className="text-sm text-gray-400 animate-pulse">Thinking...</p>
        )}
      </div>

      {applyMessage && (
        <p className="text-xs text-blue-600">{applyMessage}</p>
      )}

      <form ref={formRef} onSubmit={handleSend} className="flex gap-2">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Describe your business or ask for help..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
