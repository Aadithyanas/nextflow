import { connectDatabase } from "./config/database";
import { env, getMissingRecommendedEnvVars } from "./config/env";
import { createApp } from "./app";

async function start() {
  await connectDatabase();
  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Backend running on http://localhost:${env.PORT}`);
    const missing = getMissingRecommendedEnvVars();
    if (missing.length > 0) {
      console.warn(
        `Optional environment variables not set: ${missing.join(", ")}. AI nodes will stay unavailable until they are configured.`
      );
    }
  });
}

start().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
