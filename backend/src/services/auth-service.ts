import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { UserModel } from "../models/User";

function signUserToken(user: { id: string; email: string; name: string }) {
  return jwt.sign(user, env.JWT_SECRET, { expiresIn: "7d" });
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
}) {
  const existingUser = await UserModel.findOne({ email: input.email.toLowerCase() });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await UserModel.create({
    email: input.email.toLowerCase(),
    passwordHash,
    name: input.name,
  });

  return {
    token: signUserToken({ id: user.id, email: user.email, name: user.name }),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await UserModel.findOne({ email: input.email.toLowerCase() });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return {
    token: signUserToken({ id: user.id, email: user.email, name: user.name }),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
}

