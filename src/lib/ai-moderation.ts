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
      content: `Review these business listing fields for a Bergen County, NJ town website sponsor. Return ONLY a JSON object with: {"approved": boolean, "reason": "string or null", "flaggedFields": ["field names"] or null}. No other text.\n\n${fieldList}`,
    },
  ]);

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as ModerationResult;
      return {
        approved: Boolean(parsed.approved),
        reason: parsed.reason ?? undefined,
        flaggedFields: parsed.flaggedFields ?? undefined,
      };
    }
  } catch {
    // If parsing fails, default to approved (don't block legitimate submissions)
  }

  return { approved: true };
}
