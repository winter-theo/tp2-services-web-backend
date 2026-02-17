import { apiRequest } from "./client";

export function listUsers(token) {
  return apiRequest("/users", {
    method: "GET",
    token,
  });
}
