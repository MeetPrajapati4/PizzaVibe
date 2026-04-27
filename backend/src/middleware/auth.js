import { getPool } from "../db/pool.js";
import { HttpError } from "../utils/httpError.js";
import { verifyAuthToken } from "../utils/tokens.js";

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new HttpError(401, "Authentication token is required.");
    }

    const payload = verifyAuthToken(token);
    const [rows] = await getPool().execute(
      "SELECT id, name, email, role, is_verified FROM users WHERE id = ? LIMIT 1",
      [payload.sub]
    );

    if (!rows.length) {
      throw new HttpError(401, "User account no longer exists.");
    }

    req.user = rows[0];
    next();
  } catch (error) {
    next(error.status ? error : new HttpError(401, "Invalid or expired authentication token."));
  }
}

export function requireAdmin(req, _res, next) {
  if (!req.user || req.user.role !== "admin") {
    next(new HttpError(403, "Admin access is required."));
    return;
  }

  next();
}
