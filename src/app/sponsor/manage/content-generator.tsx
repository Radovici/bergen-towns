"use client";

import { useState, useRef } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ContentGenerator({
  token,
  townName,
}: {
  token: string;
  townName: string;
  tierId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  const nextId = () => String(++idCounter.current);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: nextId(), role: "user", content: input };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/sponsor/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          messages: allMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = (await res.json()) as {
        content?: string;
        error?: string;
      };

      const assistantMsg: Message = {
        id: nextId(),
        role: "assistant",
        content: res.ok
          ? data.content || ""
          : data.error || "Something went wrong.",
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content: "Network error. Try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyToProfile = async (field: string, value: string) => {
    setApplying(true);
    setApplyMessage(null);
    try {
      const res = await fetch("/api/sponsor/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, [field]: value }),
      });
      const data = (await res.json()) as { error?: string };
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

  const extractApplyable = (content: string) => {
    const blocks: { field: string; value: string; label: string }[] = [];
    for (const line of content.split("\n")) {
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
        blocks.push({ field: "profileCardHtml", value: htmlMatch[0], label: "Profile Card HTML" });
      }
    }

    return blocks;
  };

  return (
    <div className="space-y-4">
      <div
        ref={chatRef}
        className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto p-4 space-y-3 bg-gray-50"
      >
        {messages.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            Try: &ldquo;I run a pizza shop in {townName}. Help me write a
            great listing.&rdquo;
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`text-sm ${
              m.role === "user" ? "text-gray-800 font-medium" : "text-gray-600"
            }`}
          >
            <span className="text-xs text-gray-400 uppercase mr-2">
              {m.role === "user" ? "You" : "AI"}
            </span>
            <div className="mt-1 whitespace-pre-wrap">{m.content}</div>
            {m.role === "assistant" && m.content && (
              <div className="mt-2 flex flex-wrap gap-2">
                {extractApplyable(m.content).map((block) => (
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
        ))}
        {isLoading && (
          <p className="text-sm text-gray-400 animate-pulse">
            AI is working...
          </p>
        )}
      </div>

      {applyMessage && (
        <p className="text-xs text-blue-600">{applyMessage}</p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your business or ask for help..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
