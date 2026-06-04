import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  try {
    const result = streamText({
      model: openai("gpt-4.1-nano"),
      messages: await convertToModelMessages(messages),
    });
    result.usage.then((usage) => {
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log("Error streaming chat response", error);
    return NextResponse.json(
      { error: "Failed to generate chat response" },
      { status: 500 },
    );
  }
}
