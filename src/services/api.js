const API_BASE_URL = process.env.REACT_APP_API_URL || "";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error(`Network Error ${path}:`, error);
    throw new Error("Could not connect to the server. Please ensure the backend is running.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error(`API Error [${response.status}] ${path}:`, data.message || "Request failed");
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
