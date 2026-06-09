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
  getLocation: tool({
    description: "Get location of user",
    inputSchema: z.object({ name: z.string().describe("Name of user") }),
    execute: async ({ name }) => {
      if (name == "Peter") {
        return "New York";
      }
      if (name == "Sami") {
        return "London";
      }
      return "Name not found";
    },
  }),
  getWeather: tool({
    description: "Get weather for a location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for."),
    }),
    execute: async ({ city }) => {
      if (city == "London") {
        return "25 degrees celcius and sunny ";
      }
      if (city == "New York") {
        return "35 degrees celcius and cloudy ";
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
      stopWhen: stepCountIs(3),
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
