import jwt from "jsonwebtoken";
import { CurrentUser, Role } from "../models/entities";

interface AuthTokenPayload {
  sub: string;
  email: string;
  role: Role;
}

const defaultSecret = "dev-only-secret-change-me";

const getJwtSecret = (): string => {
  return process.env.JWT_SECRET ?? defaultSecret;
};

const getJwtExpiration = (): string => {
  return process.env.JWT_EXPIRES_IN ?? "1h";
};

export const signAuthToken = (user: CurrentUser): string => {
  return jwt.sign(
    { email: user.email, role: user.role },
    getJwtSecret(),
    { subject: String(user.id), expiresIn: getJwtExpiration() }
  );
};

export const verifyAuthToken = (token: string): CurrentUser | null => {
  try {
    const payload = jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
    const id = Number.parseInt(payload.sub, 10);

    if (!Number.isFinite(id) || !payload.email || !payload.role) {
      return null;
    }

    return {
      id,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
};
