import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import {
  googleAuthThunk,
  initAuthThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
} from "./authThunks";
import type { LoginFormData, RegisterFormData } from "./types";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { selectIsAuthenticated, selectUser } from "./authSelectors";

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const register = useCallback(
    async (data: Omit<RegisterFormData, "confirmPassword">) => {
      // dispatch returns a promise with the thunk result
      const result = await dispatch(registerThunk(data));

      // registerThunk.fulfilled means it succeeded
      if (registerThunk.fulfilled.match(result)) {
        const state = location.state as { from?: { pathname: string } };

        navigate(state.from?.pathname ?? "/", { replace: true });
      } else {
        // registerThunk.rejected — result.payload has the error message
        throw new Error(result.payload as string);
      }
    },
    [dispatch, navigate, location],
  );

  const login = useCallback(
    async (data: LoginFormData) => {
      const result = await dispatch(loginThunk(data));

      if (loginThunk.fulfilled.match(result)) {
        const state = location.state as { from?: { pathname: string } };

        navigate(state?.from?.pathname ?? "/", { replace: true });
      } else {
        throw new Error(result.payload as string);
      }
    },
    [dispatch, navigate, location],
  );

  const googleLogin = useCallback(
    async (accessToken: string) => {
      const result = await dispatch(googleAuthThunk(accessToken));
      console.log(result);
      console.log(loginThunk);

      if (googleAuthThunk.fulfilled.match(result)) {
        const state = location.state as { from?: { pathname: string } };

        navigate(state.from?.pathname ?? "/", { replace: true });
      } else {
        console.log(result);
        throw new Error(result.payload as string);
      }
    },
    [dispatch, navigate, location],
  );

  const logout = useCallback(async () => {
    await dispatch(logoutThunk());

    navigate("/login");
  }, [dispatch, navigate]);

  return { register, login, googleLogin, logout, user, isAuthenticated };
}

// only needed when page loads for the first time
// The reason: user logs in -> get access token in memory (redux state)
//             user refreshes the page -> memory is cleared -> access token gone
//             but we have httpOnly cookie storing refresh token
//             we will use it to get a new session token and restore the session silently
export function useInitAuth() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initAuthThunk());
  }, [dispatch]);
}
