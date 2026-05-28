import type { RootState } from "../../store";

// selectors are functions that read specific piece of state
export const selectUser = (state: RootState) => state.auth.user;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectInitStatus = (state: RootState) => state.auth.initStatus;

export const selectUserName = (state: RootState) =>
  state.auth.user?.name ?? null;
