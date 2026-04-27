import { getDemoState } from "../db/demoStore.js";
import { HttpError } from "../utils/httpError.js";
import { verifyAuthToken } from "../utils/tokens.js";

export function requireDemoAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new HttpError(401, "Authentication token is required.");
    }

    const payload = verifyAuthToken(token);
    const user = getDemoState().users.find((item) => Number(item.id) === Number(payload.sub));

    if (!user) {
      throw new HttpError(401, "User account no longer exists.");
    }

    req.user = user;
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
