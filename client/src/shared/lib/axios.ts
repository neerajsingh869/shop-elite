import axios from "axios";

import { store } from "../../store";
import type { AuthResponse, User } from "../../features/auth/types";
import { clearAuth, setAuth } from "../../features/auth/authSlice";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  // tell browser to send httpOnly cookie with every request
  // equivalent to credentials: "include" in fetch requests
  withCredentials: true,
});

// ------------------- REQUEST INTERCEPTOR -------------------
// runs BEFORE every request - attach the access token
api.interceptors.request.use((config) => {
  // access redux state directly to get access token
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ------------------- RESPONSE INTERCEPTOR -------------------
// runs AFTER every response comes back
// JOB: if we get a 401, silently refresh the token and retry

// flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;

// build queue of requests that has failed while a refresh was in progress
// once the refresh succeeds, all queued requests are retried
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });

  failedQueue = [];
}

api.interceptors.response.use(
  // success case - return response as it is
  (response) => response,

  // failure case - check if it is 401 and handle it
  async (error) => {
    const originalRequest = error.config;
    // only handle 401
    const is401 = error.response?.status === 401;
    const isRetry = originalRequest._retry;
    const isRefreshUrl = originalRequest.url?.includes("/auth/refresh");

    // return early with error in case of failure caused by other reasons
    if (!is401 || isRetry || isRefreshUrl) {
      return Promise.reject(error);
    }

    // if already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.header.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    // start refreshing
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post<AuthResponse>("/auth/refresh");

      // dispatch setAuth directly to redux store
      store.dispatch(setAuth(data));

      // update the failed request's header
      originalRequest.header.Authorization = `Bearer ${data.accessToken}`;

      // unblock all queue requests
      processQueue(null, data.accessToken);

      // retry the original request that caused 401
      return api(originalRequest);
    } catch (refreshError) {
      // refresh failed - session is truely over
      processQueue(refreshError, null);

      // dispatch clearAuth directly to redux store
      store.dispatch(clearAuth());

      // redirect to login page
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = true;
    }
  },
);
