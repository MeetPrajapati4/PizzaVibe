const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

export function getStoredSession() {
  const token = localStorage.getItem("pizza_token");
  const user = localStorage.getItem("pizza_user");
  return {
    token,
    user: user ? JSON.parse(user) : null
  };
}

export function storeSession(token, user) {
  localStorage.setItem("pizza_token", token);
  localStorage.setItem("pizza_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("pizza_token");
  localStorage.removeItem("pizza_user");
}

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}
