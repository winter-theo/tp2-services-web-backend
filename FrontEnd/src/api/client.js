const API_PREFIX = "/api";

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(path, options = {}) {
  const { token, headers, ...rest } = options;

  const response = await fetch(`${API_PREFIX}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    ...rest,
  });

  const text = await response.text();
  const data = text ? safeJsonParse(text) ?? text : null;

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && data.message) ||
      `Request failed (${response.status})`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}
