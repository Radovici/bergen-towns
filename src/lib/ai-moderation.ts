import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import type { ModerationResult } from "./sponsor-types";

const ModerationSchema = z.object({
  approved: z.boolean(),
  reason: z.string().optional(),
  flaggedFields: z.array(z.string()).optional(),
});

export async function moderateContent(
  fields: Record<string, string>,
): Promise<ModerationResult> {
  const fieldList = Object.entries(fields)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  if (!fieldList) return { approved: true };

  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-6"),
    schema: ModerationSchema,
    system: `You are a content moderator for Bergen County town information websites.
These are community-focused sites serving residents, homebuyers, and visitors.
Sponsors are local businesses paying to be listed.

Approve content that is:
- Professional business descriptions
- Accurate contact information
- Reasonable marketing language

Reject content that contains:
- Profanity or vulgar language
- Scams, phishing, or deceptive claims
- Fake credentials or misleading qualifications
- Adult or sexually explicit content
- Hate speech or discrimination
- Excessive spam (ALL CAPS, repeated punctuation, keyword stuffing)
- Links to suspicious or unrelated websites

Be reasonable — normal business promotion is fine. Only reject clearly inappropriate content.`,
    prompt: `Review these business listing fields for a Bergen County, NJ town website sponsor. Return whether the content is approved.\n\n${fieldList}`,
  });

  return object;
}
