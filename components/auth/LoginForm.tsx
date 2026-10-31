"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";
import { AuthCard, AuthPasswordField, AuthTextField } from "@/components/auth/AuthCard";

export function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
    <AuthCard
      title="Log In"
      description="Welcome back. Sign in to your watchlist."
      submitLabel="Log In" isLoading={isLoading}
      onSubmit={handleSubmit}
      onGoogle={handleGoogleLogin}
      footerText="Don't have an account?"
      footerLinkLabel="Sign up"
      footerHref="/signup"
    >
        <AuthTextField
          label="Email"
          type="email"
          placeholder="someone@gmail.com"
          autoComplete="email"
          value={formData.email}
          onChange={(email) => setFormData({ ...formData, email })}
        />
        <AuthPasswordField
          autoComplete="current-password"
          value={formData.password}
          onChange={(password) => setFormData({ ...formData, password })}
        />
    </AuthCard>
  );
}
