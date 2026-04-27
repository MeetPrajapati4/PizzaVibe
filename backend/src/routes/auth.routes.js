import bcrypt from "bcryptjs";
import { Router } from "express";
import { getPool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/mailer.js";
import { makeRandomToken, signAuthToken } from "../utils/tokens.js";

export const authRouter = Router();

function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    isVerified: Boolean(row.is_verified)
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      throw new HttpError(400, "Name, email, and password are required.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpError(400, "Please enter a valid email address.");
    }

    if (password.length < 8) {
      throw new HttpError(400, "Password must be at least 8 characters.");
    }

    const pool = getPool();
    const [existing] = await pool.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);

    if (existing.length) {
      throw new HttpError(409, "An account with this email already exists.");
    }

    const verificationToken = makeRandomToken();
    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      `
        INSERT INTO users (name, email, password_hash, verification_token, is_verified)
        VALUES (?, ?, ?, ?, FALSE)
      `,
      [name, email, passwordHash, verificationToken]
    );

    const user = { id: result.insertId, name, email, role: "user", is_verified: false };
    await sendVerificationEmail(user, verificationToken);

    res.status(201).json({
      message: "Registration complete. Please verify your email before logging in.",
      user: publicUser(user),
      developmentVerificationToken: verificationToken
    });
  })
);

authRouter.post(
  "/verify-email",
  asyncHandler(async (req, res) => {
    const token = String(req.body.token || req.query.token || "").trim();

    if (!token) {
      throw new HttpError(400, "Verification token is required.");
    }

    const [result] = await getPool().execute(
      "UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = ?",
      [token]
    );

    if (!result.affectedRows) {
      throw new HttpError(400, "Verification token is invalid or already used.");
    }

    res.json({ message: "Email verified. You can now log in." });
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const [rows] = await getPool().execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);

    if (!rows.length) {
      throw new HttpError(401, "Invalid email or password.");
    }

    const user = rows[0];
    const matches = await bcrypt.compare(password, user.password_hash);

    if (!matches) {
      throw new HttpError(401, "Invalid email or password.");
    }

    if (!user.is_verified) {
      throw new HttpError(403, "Please verify your email before logging in.");
    }

    res.json({
      token: signAuthToken(user),
      user: publicUser(user)
    });
  })
);

authRouter.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body.email);
    const [rows] = await getPool().execute("SELECT id, name, email FROM users WHERE email = ? LIMIT 1", [email]);
    let developmentResetToken = null;

    if (rows.length) {
      const token = makeRandomToken();
      developmentResetToken = token;
      await getPool().execute(
        `
          UPDATE users
          SET reset_token = ?, reset_token_expires_at = DATE_ADD(NOW(), INTERVAL 1 HOUR)
          WHERE id = ?
        `,
        [token, rows[0].id]
      );
      await sendPasswordResetEmail(rows[0], token);
    }

    res.json({
      message: "If that email exists, a reset link has been sent.",
      developmentResetToken
    });
  })
);

authRouter.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const token = String(req.body.token || "").trim();
    const password = String(req.body.password || "");

    if (!token || password.length < 8) {
      throw new HttpError(400, "A valid reset token and 8 character password are required.");
    }

    const [rows] = await getPool().execute(
      `
        SELECT id
        FROM users
        WHERE reset_token = ? AND reset_token_expires_at > NOW()
        LIMIT 1
      `,
      [token]
    );

    if (!rows.length) {
      throw new HttpError(400, "Reset token is invalid or expired.");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await getPool().execute(
      `
        UPDATE users
        SET password_hash = ?, reset_token = NULL, reset_token_expires_at = NULL
        WHERE id = ?
      `,
      [passwordHash, rows[0].id]
    );

    res.json({ message: "Password updated. You can now log in." });
  })
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: publicUser(req.user) });
  })
);
