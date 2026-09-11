"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async () => {
    try {
      const currentUser = await login({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (currentUser.role === "ADMIN") {
        router.push("/dashboard");
      } else if (currentUser.role === "LIBRARIAN") {
        router.push("/dashboard");
      } else if (currentUser.role === "MEMBER") {
        router.push("/dashboard/member");
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      setLoginError(
        Array.isArray(message)
          ? message[0]
          : message ||
              "Login failed. Check your email and password.",
      );
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-orange-50 text-gray-800">
      <div className="flex h-full w-full">
        <div className="flex h-full w-full items-center justify-center p-6">
          <div className="flex w-full max-w-md flex-col">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
                <BookOpen className="size-5 text-white" />
              </div>

              <div className="flex flex-col">
                <span className="text-2xl font-semibold leading-tight text-gray-800">
                  ShelfSphere
                </span>

                <span className="text-xs uppercase tracking-widest text-green-700">
                  Library System
                </span>
              </div>
            </div>

            <h1 className="mt-4 text-3xl font-semibold text-gray-800">
              Welcome back
            </h1>

            <p className="mt-1 mb-4 text-sm text-gray-600">
              Sign in to manage your library
            </p>

            {loginError && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {loginError}
              </p>
            )}

            <label className="mb-2 text-sm font-medium text-gray-700">
              Email address
            </label>

            <input
              type="email"
              placeholder="you@library.com"
              className="h-12 w-full rounded-lg border border-orange-200 bg-white px-4 text-sm text-gray-800 outline-none focus:border-orange-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="mt-4 mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-12 w-full rounded-lg border border-orange-200 bg-white px-4 pr-12 text-sm text-gray-800 outline-none focus:border-orange-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="absolute top-1/2 right-4 -translate-y-1/2"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-green-700" />
                ) : (
                  <Eye className="size-5 text-green-700" />
                )}
              </button>
            </div>

            <div className="mt-3 flex items-center justify-end">
              <button
                type="button"
                className="text-sm font-medium text-green-700"
                onClick={() =>
                  router.push("/forgot-password")
                }
              >
                Forgot password?
              </button>
            </div>

            <button
              type="button"
              className="mt-4 h-12 w-full rounded-lg bg-orange-500 text-sm font-semibold text-white shadow hover:bg-orange-600"
              onClick={handleSubmit}
            >
              Log In
            </button>

            <p className="mt-3 text-center text-sm text-gray-600">
              Don&apos;t have an account?

              <button
                type="button"
                className="ml-1 font-semibold text-green-700"
                onClick={() => router.push("/register")}
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}