import { NextRequest } from "next/server";
import { getSponsorByToken } from "@/lib/sponsor-storage";
import { streamAgent } from "@/lib/aide-client";
import { TIERS } from "@/lib/sponsorship";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { messages: rawMessages, token } = body as {
    messages: { role: string; content: string }[];
    token: string;
  };

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const profile = await getSponsorByToken(token);
  if (!profile) {
    return new Response("Invalid token", { status: 401 });
  }

  const tier = TIERS.find((t) => t.id === profile.tierId);
  const tierFeatures = tier ? tier.features.join(", ") : "basic listing";

  const contextMessage = {
    role: "user" as const,
    content: `Context for this conversation: I'm a sponsor of ${profile.townName}, NJ with the "${profile.tierName}" tier (includes: ${tierFeatures}). My current business name is "${profile.businessName || "(not set)"}". My category is "${profile.category || "(not set)"}". Help me create content for my listing.`,
  };

  const allMessages = [contextMessage, ...rawMessages];

  try {
    const aideResponse = await streamAgent(allMessages);

    return new Response(aideResponse.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Agent error";
    return new Response(message, { status: 502 });
  }
}
