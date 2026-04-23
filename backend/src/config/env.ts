import dotenv from "dotenv";
import path from "node:path";
import { z } from "zod";

const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend", ".env"),
  path.resolve(__dirname, "../../.env"),
];

for (const envPath of envPaths) {
  dotenv.config({ path: envPath, override: false });
}

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().default("http://localhost:3000"),
  MONGODB_URI: z.string().default("mongodb://127.0.0.1:27017/ai-workflow-builder"),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters").default("dev-secret-change-me"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MAX_RETRIES: z.coerce.number().int().min(0).max(5).default(5),
});

export const env = envSchema.parse(process.env);

export function getMissingRecommendedEnvVars() {
  const missing: string[] = [];

  if (!process.env.GEMINI_API_KEY) {
    missing.push("GEMINI_API_KEY");
  }

  return missing;
}
