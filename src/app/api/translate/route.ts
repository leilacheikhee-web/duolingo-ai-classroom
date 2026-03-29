import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json();
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Translate to ${targetLanguage} with cultural context: "${text}"` }] }],
        }),
      }
    );
    const data = await response.json();
    const translation = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Error";
    return NextResponse.json({ translation });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
