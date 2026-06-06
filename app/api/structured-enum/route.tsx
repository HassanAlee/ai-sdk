import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { text } = await request.json();
  try {
    const result = await generateObject({
      model: openai("gpt-4.1-nano"),
      output: "enum",
      enum: ["positive", "negative", "neutral"],
      prompt: `Classify the sentiment in this text: "${text}`,
    });
    return result.toJsonResponse();
  } catch (error) {
    console.log("Error generating sentiment", error);
    return NextResponse.json("Error generating sentiment", { status: 500 });
  }
}
