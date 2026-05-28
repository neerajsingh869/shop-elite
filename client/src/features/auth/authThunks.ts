import { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  googleAuthApi,
  loginApi,
  logoutApi,
  refreshApi,
  registerApi,
} from "./api";
import { clearAuth, setAuth, setInitStatus } from "./authSlice";
import type { LoginFormData, RegisterFormData } from "./types";

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data: RegisterFormData, { dispatch, rejectWithValue }) => {
    try {
      const res = await registerApi(data);

      dispatch(setAuth({ user: res.user, accessToken: res.accessToken }));

      return res;
    } catch (err) {
      // rejectWithValue passes the error to the rejected action
      return rejectWithValue(
        err instanceof AxiosError
          ? (err.response?.data?.message ?? "Registration failed")
          : "Registration failed",
      );
    }
  },
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: LoginFormData, { dispatch, rejectWithValue }) => {
    try {
      const res = await loginApi(data);

      dispatch(setAuth({ user: res.user, accessToken: res.accessToken }));

      return res;
    } catch (err) {
      // rejectWithValue passes the error to the rejected action
      return rejectWithValue(
        err instanceof AxiosError
          ? (err.response?.data?.message ?? "Login failed")
          : "Login failed",
      );
    }
  },
);

export const googleAuthThunk = createAsyncThunk(
  "auth/google",
  async (accessToken: string, { dispatch, rejectWithValue }) => {
    try {
      const res = await googleAuthApi(accessToken);

      dispatch(setAuth({ user: res.user, accessToken: res.accessToken }));

      return res;
    } catch (err) {
      // rejectWithValue passes the error to the rejected action
      return rejectWithValue(
        err instanceof AxiosError
          ? (err.response?.data?.message ?? "Google Authentication failed")
          : "Google Authentication failed",
      );
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await logoutApi();
    } finally {
      // user must always be able to log out
      dispatch(clearAuth());
    }
  },
);

// thunk which will be used to restore session on page load
export const initAuthThunk = createAsyncThunk(
  "auth/init",
  async (_, { dispatch }) => {
    dispatch(setInitStatus("loading"));

    try {
      const res = await refreshApi();

      dispatch(setAuth({ user: res.user, accessToken: res.accessToken }));

      return res;
    } catch {
      // no valid session - user will see login page on protected routes
    } finally {
      dispatch(setInitStatus("settled"));
    }
  },
);
