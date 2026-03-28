import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) return NextResponse.json({ error: "No GOOGLE_API_KEY" });
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Say hello in one word" }] }],
      }),
    }
  );
  const data = await response.json();
  return NextResponse.json(data);
}
