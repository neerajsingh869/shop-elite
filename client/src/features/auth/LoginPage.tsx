import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";

import { useAuth } from "./hooks";
import GoogleIcon from "../../shared/components/ui/GoogleIcon";
import useDocumentTitle from "../../shared/hooks/useDocumentTitle";

// zod schema for login form
const User = z.object({
  email: z.email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password should have at least 8 characters"),
});

type User = z.infer<typeof User>;

function LoginPage() {
  const { login, googleLogin } = useAuth();

  useDocumentTitle("Sign in");

  const [serverError, setServerError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: zodResolver(User),
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setServerError(null);
      setGoogleLoading(true);

      try {
        await googleLogin(tokenResponse.access_token);
      } catch {
        setServerError("Google sign-in failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setServerError("Google sign-in was cancelled or failed."),
  });

  const onSubmit: SubmitHandler<User> = async (data) => {
    setServerError(null);

    try {
      await login(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(
          err.response?.data.message ?? "Login failed. Please try again",
        );
      } else {
        setServerError(
          err instanceof Error ? err.message : "Something went wrong",
        );
      }
    }
  };

  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      <div className="flex flex-col gap-6 w-84">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Welcome back</h1>
          <p className="text-zinc-500 text-sm">
            Sign in to your account to continue
          </p>
        </div>
        <button
          onClick={() => handleGoogleLogin()}
          disabled={googleLoading}
          className="border bg-zinc-900 border-zinc-600 rounded-md h-10 text-sm cursor-pointer flex gap-2 items-center justify-center transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:translate-0 disabled:bg-zinc-900 disabled:opacity-50"
        >
          {googleLoading ? (
            <div className="animate-spin w-4 h-4 border-2 rounded-full border-zinc-600 border-t-zinc-300"></div>
          ) : (
            <GoogleIcon />
          )}
          <span>
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </span>
        </button>
        <div className="flex justify-between gap-1 text-sm items-center">
          <span className="border grow h-0 border-zinc-800"></span>
          <span className="text-zinc-500">or</span>
          <span className="border grow h-0 border-zinc-800"></span>
        </div>
        {/* Server error */}
        {serverError && (
          // role="alert" so a failed sign in is spoken - it used to appear
          // silently and a screen reader user just heard nothing happen
          <div
            role="alert"
            className="flex items-start gap-2.5 mb-4 p-3.5
            bg-red-950/50 border border-red-900/50 rounded-lg"
          >
            <AlertCircle
              size={15}
              aria-hidden="true"
              className="text-red-400 mt-0.5 shrink-0"
            />
            <p className="text-red-400 text-sm">{serverError}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.25">
            <label className="text-zinc-400 text-xs" htmlFor="email">
              Email address
            </label>
            <div className="relative">
              <Mail
                size={16}
                aria-hidden="true"
                className="absolute top-1/2 -translate-y-1/2 left-2.5 text-neutral-400"
              />
              <input
                id="email"
                type="email"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="w-full border rounded-md border-zinc-800 bg-neutral-900 h-10 px-3 pl-8 text-sm placeholder:text-neutral-400 focus:border-yellow-600 transition duration-200 text-zinc-300"
                placeholder="you@example.com"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.25">
            <label className="text-zinc-400 text-xs" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                aria-hidden="true"
                className="absolute top-1/2 -translate-y-1/2 left-2.5 text-neutral-400"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className="w-full border rounded-md border-zinc-800 bg-neutral-900 h-10 px-3 pl-8 pr-8 text-sm placeholder:text-neutral-400 focus:border-yellow-600 transition duration-200 text-zinc-300"
                placeholder="••••••••••••"
                {...register("password")}
              />
              {/*
                Had no name at all, so it announced as just "button".
                aria-pressed makes it a toggle, so the state is spoken too.
              */}
              <button
                onClick={() => setShowPassword((v) => !v)}
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <Eye
                    size={16}
                    aria-hidden="true"
                    className="absolute top-1/2 -translate-y-1/2 right-2.5 text-neutral-400"
                  />
                ) : (
                  <EyeOff
                    size={16}
                    aria-hidden="true"
                    className="absolute top-1/2 -translate-y-1/2 right-2.5 text-neutral-400"
                  />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="mt-1.5 text-xs text-red-400"
              >
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            disabled={isSubmitting}
            className="bg-yellow-500 text-black font-semibold text-sm rounded-md grow transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-400 w-full p-2 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-0 disabled:bg-yellow-500"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-500 tracking-tight">
          Don't have an account?{" "}
          <Link to={"/register"} className="text-yellow-500 cursor-pointer">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
