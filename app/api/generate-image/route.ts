import { openai } from "@ai-sdk/openai";
import { generateImage } from "ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const { image } = await generateImage({
      model: openai.image("gpt-image-1-mini"),
      prompt,
      size: "1024x1024",
      providerOptions: {
        openai: {
          quality: "high",
        },
      },
    });
    return NextResponse.json(image.base64);
  } catch (error) {
    console.log("Error generating image", error);
    return NextResponse.json(
      { error: "Error generating image" },
      { status: 500 },
    );
  }
}
