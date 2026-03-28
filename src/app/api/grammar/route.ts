import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
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
        system: "You are a grammar correction specialist. Identify errors, provide corrections, and explain them clearly.",
        messages: [{ role: "user", content: `Check and correct this text: "${text}"` }],
      }),
    });
    const data = await response.json();
    const correction = data.content?.[0]?.text || "Error getting correction";
    return NextResponse.json({ correction });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
