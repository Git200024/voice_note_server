import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//  transcribe audio with Gemini
export const transcribeWithGemini = async (filePath) => {
  try {
    const myfile = await ai.files.upload({
      file: filePath,
      config: { mimeType: "audio/webm" },
    });

    // Generate transcription
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        "Generate a transcript of the speech.",
      ]),
    });

    return result.text;
  } catch (err) {
    console.error("Gemini transcription error:", err.message);
    return `Transcription failed: ${err.message}`;
  }
};

// generate summary with Gemini
export const summarizeWithGemini = async (text) => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createUserContent([
        {
          type: "text",
          text: `Summarize the following text in a few sentences:\n${text}`,
        },
      ]),
    });

    return result.text;
  } catch (err) {
    console.error("Gemini summarization error:", err.message);
    return `Summary failed: ${err.message}`;
  }
};
