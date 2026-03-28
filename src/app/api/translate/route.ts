import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json();
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: "You are a professional translator with cultural knowledge.",
        messages: [{ role: "user", content: `Translate to ${targetLanguage}: "${text}"` }],
      }),
    });
    const data = await response.json();
    const translation = data.content?.[0]?.text || "Error getting translation";
    return NextResponse.json({ translation });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
