"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (provider: string) => {
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => handleLogin("google")}
        disabled={!!loading}
        className="w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
      >
        <div className="w-5 h-5 flex items-center justify-center">
            <FcGoogle size={20} />
        </div>
        {loading === "google" ? "Signing in..." : "Sign in with Google"}
      </button>

      <button
        onClick={() => handleLogin("github")}
        disabled={!!loading}
        className="w-full flex items-center justify-center gap-2 bg-[#24292F] text-white px-4 py-2 rounded hover:bg-[#24292F]/90 transition-colors"
      >
        <div className="w-5 h-5 flex items-center justify-center">
             <FaGithub size={20} />
        </div>
        {loading === "github" ? "Signing in..." : "Sign in with GitHub"}
      </button>
    </div>
  );
}
