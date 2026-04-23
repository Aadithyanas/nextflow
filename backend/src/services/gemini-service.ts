import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from "../config/env";

function resolveGeminiModel() {
  return "gemini-2.5-flash";
}

function isRetryableGeminiError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("503") ||
    message.includes("service unavailable") ||
    message.includes("high demand") ||
    message.includes("429") ||
    message.includes("rate limit") ||
    message.includes("deadline exceeded") ||
    message.includes("timeout")
  );
}

function isQuotaGeminiError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("quota exceeded") ||
    message.includes("too many requests") ||
    message.includes("rate limit") ||
    message.includes("billing details") ||
    message.includes("limit: 0")
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithModel(client: GoogleGenerativeAI, model: string, prompt: string) {
  const geminiModel = client.getGenerativeModel({ model });
  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}

export async function generateGeminiText(prompt: string, _model = "gemini-2.5-flash") {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing. Add it to backend/.env before running AI nodes.");
  }

  const client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const primaryModel = resolveGeminiModel();

  for (let attempt = 0; attempt <= env.GEMINI_MAX_RETRIES; attempt += 1) {
    try {
      return await generateWithModel(client, primaryModel, prompt);
    } catch (error) {
      if (isQuotaGeminiError(error)) {
        throw new Error(
          `Gemini quota exceeded for ${primaryModel}. The app is staying on the 2.5 model line. Wait for quota reset or check your Google AI Studio billing and rate limits.`
        );
      }

      const isLastAttempt = attempt === env.GEMINI_MAX_RETRIES;
      if (!isRetryableGeminiError(error) || isLastAttempt) {
        break;
      }

      const backoffMs = 1200 * (attempt + 1);
      await sleep(backoffMs);
    }
  }

  throw new Error(
    `Gemini model ${primaryModel} is temporarily overloaded. Please retry in a few moments.`
  );
}
