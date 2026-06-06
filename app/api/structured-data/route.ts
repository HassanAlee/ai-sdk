import { NextResponse } from "next/server";
import { recipeSchema } from "./schema";
import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  try {
    const { dish } = await request.json();

    const result = streamObject({
      model: openai("gpt-4.1-nano"),
      schema: recipeSchema,
      prompt: `Generate a recepie for ${dish}`,
    });
    return result.toTextStreamResponse();
  } catch (error) {
    console.log("Error generating recipie", error);
    return NextResponse.json(
      { error: "Failed to generate recipie" },
      { status: 500 },
    );
  }
}
