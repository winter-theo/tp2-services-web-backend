import { apiRequest } from "./client";

const buildQueryString = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q.trim());
  }
  if (filters.status) {
    params.set("status", filters.status);
  }
  if (filters.fishId) {
    params.set("fishId", String(filters.fishId));
  }

  const query = params.toString();
  return query ? `?${query}` : "";
};

export function listArticles(filters, token) {
  return apiRequest(`/articles${buildQueryString(filters)}`, {
    method: "GET",
    token,
  });
}

export function createArticle(payload, token) {
  return apiRequest("/articles", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function getArticle(articleId, token) {
  return apiRequest(`/articles/${articleId}`, {
    method: "GET",
    token,
  });
}

export function updateArticle(articleId, payload, token) {
  return apiRequest(`/articles/${articleId}`, {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteArticle(articleId, token) {
  return apiRequest(`/articles/${articleId}`, {
    method: "DELETE",
    token,
  });
}
