import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const { text } = await generateText({
      model: openai("gpt-4.1-nano"),
      prompt,
    });
    return NextResponse.json({ text });
  } catch (error) {
    console.error("error generating text", error);

    return NextResponse.json(
      { error: "failed to generate text" },
      { status: 500 },
    );
  }
}
