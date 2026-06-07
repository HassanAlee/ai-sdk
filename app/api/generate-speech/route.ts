import { openai } from "@ai-sdk/openai";
import { experimental_generateSpeech as generateSpeech } from "ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json("Please provide text", { status: 400 });
    }
    const { audio } = await generateSpeech({
      model: openai.speech("tts-1"),
      text,
    });
    return new Response(audio.uint8Array as unknown as BodyInit, {
      headers: {
        "Content-Type": audio.mediaType || "audio/mpeg",
      },
    });
  } catch (error) {
    console.log("Error generating speech", error);
    return NextResponse.json("Error generating speech", { status: 500 });
  }
}
