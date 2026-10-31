"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { useAuth } from "@/hooks/useAuth";
import { AuthCard, AuthPasswordField, AuthTextField } from "@/components/auth/AuthCard";

export function SignupForm() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const router = useRouter();

  const { isAuthenticated, signup, loginWithGoogle, isLoading } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isAuthenticated) {
      toast.error("User is already logged in");
      router.push("/");
      return;
    }

    const email = formData.email;
    const password = formData.password;
    const fullName = formData.fullName;
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }

    const signupPromise = signup(fullName, email, password).then(() => {
      router.push("/");
    }).catch((error) => {
      console.error(error);
      throw error;
    });

    toast.promise(signupPromise, {
      loading: "Signing up...",
      success: "Signed up successfully!",
      error: (err) => {
        const errorMessage =
          err?.customData?._tokenResponse?.error?.message ||
          err?.code?.replace("auth/", "").replace(/-/g, "_").toUpperCase() ||
          err?.message ||
          "Sign up failed!";

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
      title="Sign Up"
      description="Create an account to save movies and playlists."
      submitLabel="Sign Up" isLoading={isLoading}
      onSubmit={handleSubmit}
      onGoogle={handleGoogleLogin}
      footerText="Already have an account?"
      footerLinkLabel="Log in"
      footerHref="/login"
    >
        <AuthTextField
          label="Full name"
          placeholder="John Doe"
          autoComplete="name"
          value={formData.fullName}
          onChange={(fullName) => setFormData({ ...formData, fullName })}
        />
        <AuthTextField
          label="Email"
          type="email"
          placeholder="someone@gmail.com"
          autoComplete="email"
          value={formData.email}
          onChange={(email) => setFormData({ ...formData, email })}
        />
        <AuthPasswordField
          autoComplete="new-password"
          value={formData.password}
          onChange={(password) => setFormData({ ...formData, password })}
        />
    </AuthCard>
  );
}
