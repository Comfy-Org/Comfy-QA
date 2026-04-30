const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY ?? "";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL ?? "openai/gpt-4.5";

export async function callLLM(prompt: string): Promise<string> {
  if (OPENROUTER_KEY) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENROUTER_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
      }),
    });
    const json = (await res.json()) as any;
    if (json.choices?.[0]?.message?.content) return json.choices[0].message.content;
    console.log(`  ⚠ OpenRouter: ${json.error?.message?.slice(0, 80) ?? "empty response"}`);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY_QA ?? process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });
    const block = response.content[0];
    return block?.type === "text" ? block.text : "";
  }

  const proc = Bun.spawn(["claude", "--print", "--model", "claude-opus-4-6"], {
    stdin: new TextEncoder().encode(prompt),
    stdout: "pipe",
    stderr: "pipe",
  });
  const output = await new Response(proc.stdout).text();
  await proc.exited;
  return output;
}
