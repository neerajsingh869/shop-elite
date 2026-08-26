import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router";
import { AlertCircle, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import { useAuth } from "./hooks";
import GoogleIcon from "../../shared/components/ui/GoogleIcon";
import useDocumentTitle from "../../shared/hooks/useDocumentTitle";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Please enter a valid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "One uppercase letter required")
      .regex(/[0-9]/, "One number required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterPage() {
  useDocumentTitle("Create account");

  const [serverError, setServerError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register: registerUser, googleLogin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleGoogleSignUp = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setServerError(null);
      setGoogleLoading(true);

      try {
        await googleLogin(tokenResponse.access_token);
      } catch {
        setServerError("Google sign-up failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setServerError("Google sign-up was cancelled or failed."),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    console.log(data);
    setServerError(null);

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setServerError(
          err.response?.data.message ?? "Registration failed. Please try again",
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
          <h1 className="text-2xl font-semibold text-zinc-100">
            Create account
          </h1>
          <p className="text-zinc-500 text-sm">
            Start your ShopElite membership today
          </p>
        </div>
        <button
          onClick={() => handleGoogleSignUp()}
          disabled={googleLoading}
          className="border bg-zinc-900 border-zinc-600 rounded-md h-10 text-sm cursor-pointer flex gap-2 items-center justify-center transition duration-300 hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:translate-0 disabled:bg-zinc-900 disabled:opacity-50"
        >
          {googleLoading ? (
            <div className="animate-spin w-4 h-4 border-2 rounded-full border-zinc-600 border-t-zinc-300"></div>
          ) : (
            <GoogleIcon />
          )}
          <span>{googleLoading ? "Signing up..." : "Sign up with Google"}</span>
        </button>
        <div className="flex justify-between gap-1 text-sm items-center">
          <span className="border grow h-0 border-zinc-800"></span>
          <span className="text-zinc-500">or</span>
          <span className="border grow h-0 border-zinc-800"></span>
        </div>
        {/* Server error */}
        {serverError && (
          <div
            className="flex items-start gap-2.5 p-2.5
            bg-red-950/50 border border-red-900/50 rounded-lg"
          >
            <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-400 text-sm">{serverError}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.25">
            <label className="text-zinc-400 text-xs" htmlFor="name">
              Full name
            </label>
            <div className="relative flex items-center">
              <User
                size={16}
                className="absolute top-1/2 -translate-y-1/2 left-2.5 text-neutral-600"
              />
              <input
                id="name"
                type="text"
                className="w-full border rounded-md border-zinc-800 bg-neutral-900 h-10 px-3 pl-8 text-sm placeholder:text-neutral-600 outline-0 focus:border-yellow-600 transition duration-200 text-zinc-400"
                placeholder="Danny Johnson"
                {...register("name")}
              />
            </div>
            <p className="mt-1.5 text-xs text-red-400">
              {errors.name?.message}
            </p>
          </div>
          <div className="flex flex-col gap-1.25">
            <label className="text-zinc-400 text-xs" htmlFor="email">
              Email address
            </label>
            <div className="relative flex items-center">
              <Mail
                size={16}
                className="absolute top-1/2 -translate-y-1/2 left-2.5 text-neutral-600"
              />
              <input
                id="email"
                type="email"
                className="w-full border rounded-md border-zinc-800 bg-neutral-900 h-10 px-3 pl-8 text-sm placeholder:text-neutral-600 outline-0 focus:border-yellow-600 transition duration-200 text-zinc-400"
                placeholder="you@example.com"
                {...register("email")}
              />
            </div>
            <p className="mt-1.5 text-xs text-red-400">
              {errors.email?.message}
            </p>
          </div>
          <div className="flex flex-col gap-1.25">
            <label className="text-zinc-400 text-xs" htmlFor="password">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock
                size={16}
                className="absolute top-1/2 -translate-y-1/2 left-2.5 text-neutral-600"
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-md border-zinc-800 bg-neutral-900 h-10 px-3 pl-8 pr-8 text-sm placeholder:text-neutral-600 outline-0 focus:border-yellow-600 transition duration-200 text-zinc-400"
                placeholder="••••••••••••"
                {...register("password")}
              />
              <button onClick={() => setShowPassword((v) => !v)} type="button">
                {showPassword ? (
                  <Eye
                    size={16}
                    className="absolute top-1/2 -translate-y-1/2 right-2.5 text-neutral-600"
                  />
                ) : (
                  <EyeOff
                    size={16}
                    className="absolute top-1/2 -translate-y-1/2 right-2.5 text-neutral-600"
                  />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-red-400">
              {errors.password?.message}
            </p>
          </div>
          <div className="flex flex-col gap-1.25">
            <label className="text-zinc-400 text-xs" htmlFor="confirm-password">
              Confirm password
            </label>
            <div className="relative flex items-center">
              <Lock
                size={16}
                className="absolute top-1/2 -translate-y-1/2 left-2.5 text-neutral-600"
              />
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                className="w-full border rounded-md border-zinc-800 bg-neutral-900 h-10 px-3 pl-8 pr-8 text-sm placeholder:text-neutral-600 outline-0 focus:border-yellow-600 transition duration-200 text-zinc-400"
                placeholder="••••••••••••"
                {...register("confirmPassword")}
              />
              <button onClick={() => setShowConfirm((v) => !v)} type="button">
                {showConfirm ? (
                  <Eye
                    size={16}
                    className="absolute top-1/2 -translate-y-1/2 right-2.5 text-neutral-600"
                  />
                ) : (
                  <EyeOff
                    size={16}
                    className="absolute top-1/2 -translate-y-1/2 right-2.5 text-neutral-600"
                  />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-red-400">
              {errors.confirmPassword?.message}
            </p>
          </div>
          <button
            disabled={isSubmitting}
            className="bg-yellow-500 text-black font-semibold text-sm rounded-md grow transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-400 w-full p-2 mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-0 disabled:bg-yellow-500"
          >
            {isSubmitting ? "Signing up..." : "Create account"}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-500 tracking-tight">
          Already have an account?{" "}
          <Link to={"/login"} className="text-yellow-500 cursor-pointer">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
