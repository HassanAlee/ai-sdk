import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  tool,
  InferUITools,
  UIDataTypes,
  stepCountIs,
} from "ai";
import { NextResponse } from "next/server";
import z from "zod";
const tools = {
  getWeather: tool({
    description: "Get weather for a location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for."),
    }),
    execute: async ({ city }: { city: string }) => {
      if (city == "Lahore") {
        return "43 degress celcius and sunny ";
      }
      if (city == "Islamabad") {
        return "40 degress celcius and cloudy ";
      }
      return "City not found";
    },
  }),
};
export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  try {
    const result = streamText({
      model: openai("gpt-4.1-mini"),
      tools,
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(2),
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
