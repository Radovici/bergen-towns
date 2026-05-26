import { invokeAgent } from "./aide-client";
import type { ModerationResult } from "./sponsor-types";

export async function moderateContent(
  fields: Record<string, string>,
): Promise<ModerationResult> {
  const fieldList = Object.entries(fields)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  if (!fieldList) return { approved: true };

  const response = await invokeAgent([
    {
      role: "user",
      content: `Review these business listing fields for a Bergen County, NJ town website sponsor.

Return ONLY a JSON object with:
{
  "approved": boolean,
  "needsReview": boolean,
  "reason": "string or null",
  "flaggedFields": ["field names"] or null
}

Rules:
- "approved": true — clearly appropriate content, publish immediately
- "approved": false — clearly inappropriate (profanity, scams, hate speech, etc.), reject
- "approved": false, "needsReview": true — borderline or uncertain, flag for human moderator

Flag for human review when: claims seem exaggerated but not clearly false, content is unusual but not harmful, links to unfamiliar domains, medical/legal/financial claims that need verification, or anything you're not 100% sure about.

When in doubt, flag for review rather than approving or rejecting.

No other text outside the JSON.

${fieldList}`,
    },
  ]);

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as ModerationResult;
      return {
        approved: Boolean(parsed.approved),
        needsReview: Boolean(parsed.needsReview),
        reason: parsed.reason ?? undefined,
        flaggedFields: parsed.flaggedFields ?? undefined,
      };
    }
  } catch {
    // Parse failure = flag for human review rather than auto-approving
    return { approved: false, needsReview: true, reason: "Could not parse moderation response" };
  }

  return { approved: false, needsReview: true, reason: "No moderation response" };
}
