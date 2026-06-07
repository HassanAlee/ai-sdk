import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { experimental_transcribe as transcribeAudio } from "ai";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }
    const arrayBuffer = await audioFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const transcript = await transcribeAudio({
      model: openai.transcription("whisper-1"),
      audio: uint8Array,
    });
    return NextResponse.json(transcript);
  } catch (error) {
    console.log("Error transcribing audio", error);
    return NextResponse.json(error);
  }
}
