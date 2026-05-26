import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { NextRequest } from "next/server";
import { getSponsorByToken } from "@/lib/sponsor-storage";
import { TIERS } from "@/lib/sponsorship";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { messages, token } = body;

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const profile = await getSponsorByToken(token);
  if (!profile) {
    return new Response("Invalid token", { status: 401 });
  }

  const tier = TIERS.find((t) => t.id === profile.tierId);
  const tierFeatures = tier ? tier.features.join(", ") : "basic listing";

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: `You are a helpful assistant for creating business listings on Bergen County town information websites.

You are helping a sponsor set up their listing for ${profile.townName}, NJ.
Their subscription tier is "${profile.tierName}" which includes: ${tierFeatures}.

Current business info:
- Name: ${profile.businessName || "(not set)"}
- Description: ${profile.description || "(not set)"}
- Category: ${profile.category || "(not set)"}
- Website: ${profile.website || "(not set)"}

Help them by:
1. Writing compelling business descriptions tailored to their town
2. Suggesting categories that fit their business
3. Creating taglines and marketing copy
4. Generating HTML for custom profile cards (when asked)

Keep content professional, local, and community-focused.
When generating HTML profile cards, use clean inline styles, keep it under 500 lines, and make it mobile-friendly.
Do NOT include any scripts or external resources in generated HTML.

When they're happy with content, tell them to click "Apply to Profile" to save it.`,
    messages,
  });

  return result.toUIMessageStreamResponse();
}
