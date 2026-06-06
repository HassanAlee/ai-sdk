import { NextResponse } from "next/server";
import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { pokemonSchema } from "./schema";

export async function POST(request: Request) {
  try {
    const { type } = await request.json();
    const result = streamObject({
      model: openai("gpt-4.1-nano"),
      output: "array",
      schema: pokemonSchema,
      prompt: `Generate a list of 5 ${type} pokemon`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.log("Error generating pokemon", error);
    return NextResponse.json("Error generating pokemon", { status: 500 });
  }
}
