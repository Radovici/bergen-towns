const AIDE_API_URL =
  process.env.AIDE_API_URL || "https://aide-mu.vercel.app";
const AIDE_SERVICE_KEY = process.env.AIDE_SERVICE_KEY || "";
const AIDE_BRIDGE_SLUG = process.env.AIDE_BRIDGE_SLUG || "commercial";

const TERMINAL_CREATIVE =
  process.env.AIDE_TERMINAL_CREATIVE || "sponsor-creative-agent";
const TERMINAL_SUBMISSION =
  process.env.AIDE_TERMINAL_SUBMISSION || "sponsor-submission-agent";

interface AgentResponse {
  content: string;
}

async function callAgent(
  terminalSlug: string,
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
      terminal_slug: terminalSlug,
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

export async function invokeCreativeAgent(
  messages: { role: string; content: string }[],
): Promise<AgentResponse> {
  return callAgent(TERMINAL_CREATIVE, messages);
}

export async function invokeSubmissionAgent(
  messages: { role: string; content: string }[],
): Promise<AgentResponse> {
  return callAgent(TERMINAL_SUBMISSION, messages);
}
