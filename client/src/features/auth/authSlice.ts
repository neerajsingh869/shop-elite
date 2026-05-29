import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  // "idle" => app just started
  // "loading" => checking for existing session (call /api/auth/refresh on mount)
  // "settled" => check is done, we now know if user is logged in or not
  initStatus: "idle" | "loading" | "settled";
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  initStatus: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // called after successful login, register, token refresh
    setAuth: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>, // action is object having 2 keys (type and payload)
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    // called after logout or refresh fails
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },

    // called by useInitAuth hook to track session check progress
    setInitStatus: (state, action: PayloadAction<AuthState["initStatus"]>) => {
      state.initStatus = action.payload;
    },
  },
});

// export actions that we can use to trigger state changes
export const { setAuth, clearAuth, setInitStatus } = authSlice.actions;

// export reducer so that we can register it in the global state
export const authReducer = authSlice.reducer;
