"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Github,
  Lock,
  AlertCircle,
  Terminal,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setGithubToken } = useAuthStore();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleOAuthCallback(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleOAuthCallback = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/github/callback?code=${code}`
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `HTTP ${response.status}: ${response.statusText}`
        );
      }
      const data = await response.json();
      if (!data.access_token) throw new Error("No access token received");
      setGithubToken(data.access_token);
      toast.success("Successfully authenticated!");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (error) {
      console.error("OAuth error:", error);
      toast.error(
        `OAuth failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setShowManualInput(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    const clientId =
      process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "YOUR_GITHUB_CLIENT_ID";
    if (clientId === "YOUR_GITHUB_CLIENT_ID") {
      toast.error("GitHub OAuth not configured");
      setShowManualInput(true);
      return;
    }
    const redirectUri = `${window.location.origin}/auth`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo user`;
    window.location.href = githubAuthUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      toast.error("Please enter your GitHub token");
      return;
    }
    setIsLoading(true);
    try {
      setGithubToken(token);
      toast.success("Token saved!");
      setTimeout(() => router.push("/dashboard"), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden p-4 md:p-8">
      <div className="absolute inset-0 grid-pattern opacity-[0.02]" />

      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              DevPath <span className="mono">AI</span>
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-white/70" />
              <p className="text-base md:text-lg text-white/70">
                Authenticate to Continue
              </p>
            </div>
            <div className="w-full h-[1px] bg-white/20 mt-4" />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="border border-white/30 bg-white/5 p-6 md:p-10"
          >
            {!showManualInput ? (
              <div className="space-y-6">
                <button
                  onClick={handleGitHubLogin}
                  disabled={isLoading}
                  className="w-full border border-white bg-white text-black py-4 md:py-6 font-semibold text-base md:text-lg hover:bg-white/90 disabled:opacity-50 transition-all duration-300 flex items-center justify-between px-6 md:px-8"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 border border-black/20 flex items-center justify-center">
                      {isLoading ? (
                        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-black border-t-transparent animate-spin" />
                      ) : (
                        <Github className="w-5 h-5 md:w-6 md:h-6" />
                      )}
                    </div>
                    <span className="text-sm md:text-lg">
                      {isLoading ? "Connecting..." : "Login with GitHub"}
                    </span>
                  </div>
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                <div className="border-t border-white/20 pt-6 grid grid-cols-3 gap-3 md:gap-4">
                  <div className="border border-white/20 bg-white/5 p-3 md:p-4 text-center">
                    <Terminal className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
                    <p className="text-[10px] md:text-xs font-semibold text-white/70">
                      Secure
                    </p>
                  </div>
                  <div className="border border-white/20 bg-white/5 p-3 md:p-4 text-center">
                    <Lock className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
                    <p className="text-[10px] md:text-xs font-semibold text-white/70">
                      Encrypted
                    </p>
                  </div>
                  <div className="border border-white/20 bg-white/5 p-3 md:p-4 text-center">
                    <Github className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
                    <p className="text-[10px] md:text-xs font-semibold text-white/70">
                      Read-Only
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-6">
                  <button
                    onClick={() => setShowManualInput(true)}
                    className="text-xs md:text-sm hover:bg-white/10 transition-all duration-300 w-full border border-white/30 py-3 font-semibold"
                  >
                    Use Personal Access Token
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-4 text-white/70">
                    Enter GitHub Token
                  </label>
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-4 py-3 md:py-4 bg-black border border-white/30 focus:outline-none focus:border-white/50 mono text-sm md:text-base disabled:opacity-50 transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full border border-white bg-white text-black py-4 md:py-5 font-semibold text-base md:text-lg hover:bg-white/90 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-3 md:gap-4"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-black border-t-transparent animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Start Analysis
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowManualInput(false)}
                  className="text-xs md:text-sm hover:bg-white/10 transition-all duration-300 w-full border border-white/30 py-3 font-semibold"
                >
                  ← Back to OAuth
                </button>
              </form>
            )}

            <div className="mt-6 border border-white/20 bg-white/5 p-4 flex gap-3 md:gap-4">
              <AlertCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5 text-white/70" />
              <div className="text-xs md:text-sm">
                <p className="font-semibold mb-2 text-white/70">
                  {showManualInput ? "Token Required" : "Permissions"}
                </p>
                <p className="text-xs leading-relaxed text-white/60">
                  {showManualInput
                    ? "Generate at: GitHub → Settings → Developer settings. Required scopes: repo"
                    : "We only read your public repositories. We never modify your code."}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="mt-6 md:mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="text-xs md:text-sm hover:bg-white/10 transition-all duration-300 px-6 py-3 border border-white/30 font-semibold w-full md:w-auto"
            >
              ← Back to Home
            </button>
            <div className="mono text-xs text-white/50 text-center md:text-right">
              <p>$ pwd</p>
              <p>/devpath-ai/auth</p>
              <p>
                $<span className="animate-pulse">_</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
