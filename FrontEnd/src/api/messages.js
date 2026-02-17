import { apiRequest } from "./client";

export function getMessagesByUserId(userId, token) {
  return apiRequest(`/users/${userId}/messages`, {
    method: "GET",
    token,
  });
}

export function postMessageForUser(userId, content, token) {
  return apiRequest(`/users/${userId}/messages`, {
    method: "POST",
    token,
    body: JSON.stringify({ content }),
  });
}
