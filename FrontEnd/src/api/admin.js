import { apiRequest } from "./client";

export function listUsers(token) {
  return apiRequest("/users", {
    method: "GET",
    token,
  });
}

export function deleteUser(userId, token) {
  return apiRequest(`/users/${userId}`, {
    method: "DELETE",
    token,
  });
}
