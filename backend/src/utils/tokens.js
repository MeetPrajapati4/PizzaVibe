import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function makeRandomToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function signAuthToken(user) {
  return jwt.sign(
    {
      sub: String(user.id),
      role: user.role,
      email: user.email
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
}

export function verifyAuthToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
