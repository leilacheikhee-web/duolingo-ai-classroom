import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse, TRANSLATION_SYSTEM_PROMPT } from "@/lib/llm-service";

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json();
    if (!text || !targetLanguage) return NextResponse.json({ error: "Text and target language are required" }, { status: 400 });
    const response = await generateAIResponse(
      [{ role: "user", content: `Translate the following to ${targetLanguage}: "${text}"` }],
      TRANSLATION_SYSTEM_PROMPT
    );
    return NextResponse.json({ translation: response });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: "Failed to translate" }, { status: 500 });
  }
}
