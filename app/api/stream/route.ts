import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const result = streamText({
      model: openai("gpt-4.1-nano"),
      prompt,
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log("error streaming text", error);
    return new NextResponse("Failed to stream text", { status: 500 });
  }
}
