"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import toast from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { isAuthenticated, login, loginWithGoogle, isLoading } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();

    if (isAuthenticated) {
      toast.error("User is already logged in");
      router.push("/");
      return;
    }
    const email = formData.email;
    const password = formData.password;
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const loginPromise = login(email, password).then(() => {
      router.push("/");
    }).catch((error) => {
      console.error(error);
      throw error;
    });

    toast.promise(loginPromise, {
      loading: "Logging in...",
      success: "Logged in successfully!",
      error: (err) => {
        const errorMessage =
          err?.customData?._tokenResponse?.error?.message ||
          err?.code?.replace("auth/", "").replace(/-/g, "_").toUpperCase() ||
          err?.message ||
          "Log in failed!";

        const formattedMessage = errorMessage
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/^\w/, (c) => c.toUpperCase());

        return formattedMessage;
      },
    });
  }

  async function handleGoogleLogin() {
    if (isAuthenticated) {
      toast.error("User is already logged in");
      router.push("/");
      return;
    }

    const googleLoginPromise = loginWithGoogle().then(() => {
      router.push("/");
    }).catch((error) => {
      console.error(error);
      throw error;
    });

    toast.promise(googleLoginPromise, {
      loading: "Signing in with Google...",
      success: "Logged in successfully!",
      error: (err) => {
        if (err.code === "auth/popup-closed-by-user") {
          return "Sign-in popup was closed";
        }
        return err?.message || "Google sign-in failed!";
      },
    });
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-70px-32px)] px-4 sm:px-6 md:px-0">
      <form
        onSubmit={handleSubmit}
        className="space-y-3 w-full sm:w-[70%] md:w-[60%] lg:w-[40%] xl:w-[30%] p-4 md:p-5 xl:p-6 bg-white shadow-xl rounded-3xl"
      >
        <h1 className="text-3xl text-gray-700 font-medium text-center mb-2">Log In</h1>

        <div>
          <label htmlFor="email" className="pl-2 text-sm md:text-base font-semibold text-gray-600">
            Email*
          </label>
          <input
            required
            placeholder="someone@gmail.com"
            type={"text"}
            id="email"
            className={"w-full py-2 px-4 text-gray-700 text-sm md:text-base placeholder:text-gray-400 placeholder:text-sm placeholder:md:text-base bg-gray-50 border border-gray-300 rounded-full"}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="pl-2 text-sm md:text-base font-semibold text-gray-600">
            Password*{" "}
          </label>
          <input
            required
            placeholder="******"
            type={showPassword ? "text" : "password"}
            id="password"
            className={"w-full py-2 px-4 pr-10 text-gray-700 text-sm md:text-base placeholder:text-gray-400 placeholder:text-sm placeholder:md:text-base bg-gray-50 border border-gray-300 rounded-full"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-6 top-[30%] translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              {showPassword ? "visibility" : "visibility_off"}
            </span>
          </button>
        </div>

        <p className="w-full text-sm mt-3 text-gray-500">
          <span>
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-400">
              Signup
            </Link>
          </span>
        </p>

        <Button size="md" className="w-full mb-2" loading={isLoading} >
          Log In
        </Button>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 whitespace-nowrap">or continue with</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span className="text-sm font-semibold text-gray-700">Continue with Google</span>
        </button>
      </form>

    </div>
  );
}
