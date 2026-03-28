import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPTS: Record<string, string> = {
  tutor: "You are an expert language learning tutor. Help students learn languages in an engaging way.",
  grammar: "You are a grammar correction specialist. Identify errors, provide corrections and explanations.",
  translation: "You are a professional translator. Provide accurate translations with cultural context.",
};

export async function POST(request: NextRequest) {
  try {
    const { messages, mode = "tutor" } = await request.json();
    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.tutor;

    const geminiMessages = messages.map((m: {role: string, content: string}) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiMessages,
        }),
      }
    );

    const data = await response.json();
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        try {
          const items = Array.isArray(data) ? data : [data];
          for (const item of items) {
            const text = item?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (text) {
              const words = text.split(" ");
              for (const word of words) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: word + " " })}\n\n`));
              }
            }
          }
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
