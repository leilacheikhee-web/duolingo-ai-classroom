import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { TUTOR_SYSTEM_PROMPT, GRAMMAR_SYSTEM_PROMPT, TRANSLATION_SYSTEM_PROMPT } from "@/lib/llm-service";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, mode = "tutor" } = await request.json();

    const systemPrompts: Record<string, string> = {
      tutor: TUTOR_SYSTEM_PROMPT,
      grammar: GRAMMAR_SYSTEM_PROMPT,
      translation: TRANSLATION_SYSTEM_PROMPT,
    };

    const systemPrompt = systemPrompts[mode] || TUTOR_SYSTEM_PROMPT;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const anthropicStream = await client.messages.stream({
            model: "claude-opus-4-5",
            max_tokens: 1024,
            system: systemPrompt,
            messages,
          });

          for await (const event of anthropicStream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const data = JSON.stringify({ text: event.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
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
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
