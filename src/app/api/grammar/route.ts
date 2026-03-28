import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse, GRAMMAR_SYSTEM_PROMPT } from "@/lib/llm-service";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });
    const response = await generateAIResponse(
      [{ role: "user", content: `Please check and correct this text: "${text}"` }],
      GRAMMAR_SYSTEM_PROMPT
    );
    return NextResponse.json({ correction: response });
  } catch (error) {
    console.error("Grammar API error:", error);
    return NextResponse.json({ error: "Failed to check grammar" }, { status: 500 });
  }
}
