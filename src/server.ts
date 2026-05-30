import { app } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

const start = async () => {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(`[server] listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("[server] failed to start", error);
    process.exit(1);
  }
};

start();
