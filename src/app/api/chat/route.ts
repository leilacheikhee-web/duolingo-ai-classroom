import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPTS: Record<string, string> = {
  tutor: "You are an expert language learning tutor. Help students learn languages in an engaging way. Always respond with helpful, encouraging content.",
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt + "\n\nUser: " + messages[messages.length-1].content }] }
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data));
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not generate a response.";

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const words = text.split(" ");
        let i = 0;
        const interval = setInterval(() => {
          if (i < words.length) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: words[i] + " " })}\n\n`));
            i++;
          } else {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
            clearInterval(interval);
          }
        }, 30);
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
