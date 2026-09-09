"use client";

import { z } from "zod";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import {
  Eye,
  EyeOff,
  Library,
} from "lucide-react";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse({
      fullName,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        fullName: fieldErrors.fullName?.[0] || "",
        email: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || "",
        confirmPassword:
          fieldErrors.confirmPassword?.[0] || "",
      });

      return;
    }

    setErrors({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    try {
      await register({
        fullName,
        email,
        password,
      });

      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-orange-50 flex w-full min-h-screen">
      <div className="flex p-12 justify-center items-center w-3/5">
        <div className="flex flex-col w-full max-w-md">

          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-orange-500 flex justify-center items-center size-11">
              <Library className="text-white size-6" />
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 text-2xl">
                ShelfSphere
              </span>

              <span className="text-gray-500 text-xs">
                Library System
              </span>
            </div>
          </div>

          <h1 className="font-semibold text-gray-800 text-3xl mt-8">
            Create your account
          </h1>

          <p className="text-gray-600 text-sm mt-2 mb-6">
            Join ShelfSphere to start managing your library
          </p>

          <form onSubmit={handleSubmit}>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">
                Full name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                className="rounded-lg bg-white text-gray-800 text-sm border border-gray-300 outline-none px-3 w-full h-12"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
              />

              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="flex mt-4 flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">
                Email address
              </label>

              <input
                type="email"
                placeholder="you@library.com"
                className="rounded-lg bg-white text-gray-800 text-sm border border-gray-300 outline-none px-3 w-full h-12"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex mt-4 flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">
                Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  placeholder="Enter your password"
                  className="rounded-lg bg-white text-gray-800 text-sm border border-gray-300 outline-none pr-10 pl-3 w-full h-12"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="text-gray-500 absolute top-1/2 right-3 -translate-y-1/2"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex mt-4 flex-col gap-2">
              <label className="font-medium text-gray-700 text-sm">
                Confirm password
              </label>

              <div className="relative">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  className="rounded-lg bg-white text-gray-800 text-sm border border-gray-300 outline-none pr-10 pl-3 w-full h-12"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />

                <button
                  type="button"
                  className="text-gray-500 absolute top-1/2 right-3 -translate-y-1/2"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="font-medium rounded-lg bg-orange-500 text-white text-sm mt-6 w-full h-12"
            >
              Create Account
            </button>

          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?

            <button
              type="button"
              className="font-semibold text-gray-500 ml-1"
              onClick={() => router.push("/login")}
            >
              Sign in
            </button>
          </p>

        </div>
      </div>

      <div className="bg-gray-50 flex p-12 justify-center items-center w-2/5">
        <div className="text-center">
          <h2 className="font-semibold text-gray-800 text-2xl">
            Join the shelf.
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Set up your library account in minutes
          </p>
        </div>
      </div>
    </div>
  );
}