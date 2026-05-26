const AIDE_API_URL =
  process.env.AIDE_API_URL || "https://aide-mu.vercel.app";
const AIDE_SERVICE_KEY = process.env.AIDE_SERVICE_KEY || "";
const AIDE_BRIDGE_SLUG = process.env.AIDE_BRIDGE_SLUG || "commercial";
const AIDE_TERMINAL_SLUG =
  process.env.AIDE_TERMINAL_SLUG || "bergen-sponsor-agent";

interface AgentResponse {
  content: string;
  model: string;
}

export async function invokeAgent(
  messages: { role: string; content: string }[],
): Promise<AgentResponse> {
  const res = await fetch(`${AIDE_API_URL}/api/v1/service/agent`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIDE_SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bridge_slug: AIDE_BRIDGE_SLUG,
      terminal_slug: AIDE_TERMINAL_SLUG,
      messages,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { detail?: string }).detail ||
        `AIDE agent error: ${String(res.status)}`,
    );
  }

  return (await res.json()) as AgentResponse;
}
