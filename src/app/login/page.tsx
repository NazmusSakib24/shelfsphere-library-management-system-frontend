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
    	const currentUser=await login({
      	email: email.trim().toLowerCase(),
      	password: password,
    	});

    		if(currentUser.role==="ADMIN"){
				router.push("/dashboard");
			}
			else if(currentUser.role==="LIBRARIAN"){
				router.push("/dashboard");
			}
			else if(currentUser.role==="MEMBER"){
				router.push("/dashboard/member");
			}
		}
		catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      setLoginError(
        Array.isArray(message)
          ? message[0]
          : message || "Login failed. Check your email and password.",
      );
		}
	};

  return (
    <div className="bg-[#FAF3E9] text-foreground w-full h-screen overflow-hidden">
      <div className="flex w-full h-full">

        <div className="flex justify-center items-center w-full h-full p-6">
          <div className="flex flex-col w-full max-w-[400px]">

            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-linear-135/srgb from-[#D97748] to-[#B94E3D] flex justify-center items-center size-10">
                <BookOpen className="text-white size-5" />
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-[#2E211A] text-2xl leading-tight">
                  ShelfSphere
                </span>

                <span className="uppercase text-[#81927C] text-xs tracking-widest">
                  Library System
                </span>
              </div>
            </div>

            <h1 className="font-semibold text-[#2E211A] text-3xl mt-4">
              Welcome back
            </h1>

            <p className="text-[#6B5B4D] text-[15px] mt-1 mb-4">
              Sign in to manage your library
            </p>

            {loginError && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {loginError}
              </p>
            )}

            <label className="font-medium text-[#4A362A] text-[13px] mb-2">
              Email address
            </label>

            <input
              type="email"
              placeholder="you@library.com"
              className="transition-all rounded-lg bg-white text-[#2E211A] text-[15px] border border-[#E6D8C5] outline-none pl-4 w-full h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="font-medium text-[#4A362A] text-[13px] mt-4 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="transition-all rounded-lg bg-white text-[#2E211A] text-[15px] border border-[#E6D8C5] outline-none pr-12 pl-4 w-full h-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="-translate-y-1/2 absolute top-1/2 right-4"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-[#81927C] size-[18px]" />
                ) : (
                  <Eye className="text-[#81927C] size-[18px]" />
                )}
              </button>
            </div>

            <div className="flex mt-3 justify-between items-center">

              <label className="cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded-md border-[#C9D1C1] size-[18px]"
                />

                <span className="text-[#6B5B4D] text-[13px]">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                className="font-medium cursor-pointer text-[#81927C] text-[13px]"
                onClick={() => router.push("/forgot-password")}
              >
                Forgot password?
              </button>

            </div>

            <button
              type="button"
              className="font-semibold transition-all duration-150 ease-out shadow-[0px_1px_3px_rgba(0,_0,_0,_0.1),_0px_1px_2px_-1px_rgba(0,_0,_0,_0.1)] rounded-lg bg-[#D97748] text-white text-[15px] mt-4 w-full h-12"
			  onClick={handleSubmit}	
			>
              Log In
            </button>

           <div className="flex mt-4 items-center gap-4">
              <div className="bg-[#E6D8C5] flex-1 h-px" />

              <span className="text-[#A8988A] text-xs">
                OR
              </span>

              <div className="bg-[#E6D8C5] flex-1 h-px" />
            </div>

            <button
              type="button"
              className="font-medium transition-all rounded-lg bg-white text-[#2E211A] text-sm border border-[#D8C9B8] flex mt-4 justify-center items-center gap-2 w-full h-12"
            >
              <span className="font-semibold text-[#4285F4]">
                G
              </span>

              Continue with Google
            </button>

            <p className="text-center text-[#6B5B4D] text-sm mt-3">
              Don&apos;t have an account?

              <button
                type="button"
                className="font-semibold cursor-pointer text-[#81927C] ml-1"
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
