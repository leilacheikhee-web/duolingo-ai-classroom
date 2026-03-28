import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPTS: Record<string, string> = {
  tutor: "You are an expert language learning tutor. Help students learn new languages in an engaging, supportive way. Correct grammar mistakes with clear explanations. Provide translations with cultural context. Always be patient and educational.",
  grammar: "You are a grammar correction specialist. Identify grammatical errors, provide the corrected version, explain each correction clearly, and give examples of proper usage.",
  translation: "You are a professional translator. Provide accurate translations with cultural context and explain idiomatic expressions.",
};

export async function POST(request: NextRequest) {
  try {
    const { messages, mode = "tutor" } = await request.json();
    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.tutor;

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
        system: systemPrompt,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", error);
      return NextResponse.json({ error }, { status: response.status });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`));
                  }
                } catch {}
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
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
