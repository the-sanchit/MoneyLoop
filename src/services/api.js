const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  login(payload) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  signup(payload) {
    return request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getData() {
    return request("/api/data");
  },
  saveData(payload) {
    return request("/api/data", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  clearData() {
    return request("/api/data", {
      method: "DELETE",
    });
  },
  chat(payload) {
    return request("/api/chat", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
