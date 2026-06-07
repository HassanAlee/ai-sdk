import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json();
    const result = streamText({
      model: openai("gpt-4.1-nano"),
      messages: await convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log("Error generating text from images", error);
    return NextResponse.json("Error generating text from images", {
      status: 500,
    });
  }
}
