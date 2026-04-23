import mongoose from "mongoose";

import { env } from "./env";

let isConnected = false;

export async function connectDatabase() {
  if (isConnected) {
    return mongoose.connection;
  }

  await mongoose.connect(env.MONGODB_URI);
  isConnected = true;
  return mongoose.connection;
}

