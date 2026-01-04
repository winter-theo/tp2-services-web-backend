import { Request } from "express";
import { CurrentUser } from "./entities";

export interface AuthenticatedRequest extends Request {
  currentUser?: CurrentUser;
}
