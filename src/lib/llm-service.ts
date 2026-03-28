import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function generateAIResponse(
  messages: Message[],
  systemPrompt: string = "You are a helpful language learning tutor."
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

export async function streamAIResponse(
  messages: Message[],
  systemPrompt: string = "You are a helpful language learning tutor."
) {
  return client.messages.stream({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });
}

export const TUTOR_SYSTEM_PROMPT = `You are an expert language learning tutor for Duolingo's AI Classroom.
Your role is to:
- Help students learn new languages in an engaging, supportive way
- Correct grammar mistakes with clear explanations
- Provide translations with cultural context
- Adapt to the student's proficiency level
- Give encouraging feedback
- Generate practice exercises on request
Always be patient, encouraging, and educational.`;

export const GRAMMAR_SYSTEM_PROMPT = `You are a grammar correction specialist.
When given text, you:
1. Identify grammatical errors
2. Provide the corrected version
3. Explain each correction clearly
4. Give examples of proper usage
Be concise but thorough.`;

export const TRANSLATION_SYSTEM_PROMPT = `You are a professional translator with deep cultural knowledge.
When translating:
1. Provide accurate translations
2. Note important cultural context
3. Explain idiomatic expressions
4. Offer alternative phrasings when relevant
Always include the source and target language in your response.`;
