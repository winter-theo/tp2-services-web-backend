import { apiRequest } from "./client";

const buildQueryString = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.q) {
    params.set("q", filters.q.trim());
  }
  const query = params.toString();
  return query ? `?${query}` : "";
};

export function listFish(filters, token) {
  return apiRequest(`/fish${buildQueryString(filters)}`, {
    method: "GET",
    token,
  });
}

export function getFish(fishId, token) {
  return apiRequest(`/fish/${fishId}`, {
    method: "GET",
    token,
  });
}

export function createFish(payload, token) {
  return apiRequest("/fish", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function updateFish(fishId, payload, token) {
  return apiRequest(`/fish/${fishId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteFish(fishId, token) {
  return apiRequest(`/fish/${fishId}`, {
    method: "DELETE",
    token,
  });
}
