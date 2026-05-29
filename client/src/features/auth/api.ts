import type { AuthResponse } from "./types";
import { api } from "../../shared/lib/axios";

// api to register user
export async function registerApi(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await api.post<AuthResponse>("/api/auth/register", data);
  return res.data;
}

// api to login user
export async function loginApi(data: { email: string; password: string }) {
  const res = await api.post<AuthResponse>("/api/auth/login", data);
  return res.data;
}

// api to refresh the access token on app startup to restore session
export async function refreshApi() {
  const res = await api.post<AuthResponse>("/api/auth/refresh");
  return res.data;
}

// api to logout the user and revoke the refresh token
export async function logoutApi() {
  await api.post("/api/auth/logout");
}

// api for google login/register
export async function googleAuthApi(accessToken: string) {
  const res = await api.post<AuthResponse>("/api/auth/google", { accessToken });
  return res.data;
}
