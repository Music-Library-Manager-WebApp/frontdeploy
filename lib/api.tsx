// src/lib/api.ts
const BASE_URL = "http://127.0.0.1:8000"; // FastAPI backend URL

export interface SignupData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

export interface User {
  username: string;
  email?: string;
  full_name?: string;
  disabled?: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// Signup API
export const signup = async (data: SignupData): Promise<User> => {
  const formData = new FormData();
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);
  if (data.full_name) formData.append("full_name", data.full_name);

  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// Login API
export const login = async (username: string, password: string): Promise<Token> => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const res = await fetch(`${BASE_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// Get current user
export const getCurrentUser = async (token: string): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};
