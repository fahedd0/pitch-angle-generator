import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { announcement, archetypes } = await req.json();

  if (
    typeof announcement !== "string" ||
    announcement.trim().length < 20 ||
    !Array.isArray(archetypes) ||
    archetypes.length === 0
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const prompt = `You are a PR strategist. Given this client announcement, generate one pitch angle for EACH of the following journalist archetypes: ${archetypes.join(", ")}.

Announcement:
"""
${announcement}
"""

For each archetype, the proof point MUST be grounded in specific details actually present in the announcement above — do not invent facts.

Respond ONLY with valid JSON, no markdown fences, no preamble, in this exact shape:
{
  "results": [
    { "archetype": string, "subject_line": string, "hook": string, "proof_point": string }
  ]
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No response" }, { status: 500 });
  }

  try {
    const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to parse model output" }, { status: 500 });
  }
}