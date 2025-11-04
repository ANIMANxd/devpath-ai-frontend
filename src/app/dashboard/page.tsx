"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Terminal, Code2, TrendingUp, Target } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { apiClient } from "@/lib/api";
import { FullReport } from "@/types/api";
import toast from "react-hot-toast";

import AnalysisSection from "@/components/dashboard/AnalysisSection";
import CareerTrackSection from "@/components/dashboard/CareerTrackSection";
import MarketMatchSection from "@/components/dashboard/MarketMatchSection";

export default function DashboardPage() {
  const router = useRouter();
  const { githubToken, clearToken } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"analysis" | "career" | "market">(
    "analysis"
  );
  const [fullReport, setFullReport] = useState<FullReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    if (!githubToken) {
      toast.error("Please authenticate first");
      router.push("/auth");
    }
  }, [githubToken, router]);

  const handleFullAnalysis = async () => {
    if (!githubToken) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    const toastId = toast.loading(
      "Analyzing your GitHub profile... This may take a minute."
    );

    try {
      const report = await apiClient.fullAnalysis(githubToken);
      setFullReport(report);
      toast.success("Analysis complete! Check out your developer DNA.", {
        id: toastId,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to analyze profile";
      setAnalysisError(message);
      toast.error(message, { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (!githubToken) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle Grid Pattern Background */}
      <div className="fixed inset-0 z-0 grid-pattern opacity-50" />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/20 bg-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 border border-white/30 flex items-center justify-center">
                <Terminal className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-base md:text-xl font-bold mono">
                DevPath AI
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 border border-white/20 bg-white/5 mono text-[10px] md:text-xs">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/60">Connected</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 md:px-4 py-1.5 md:py-2 border border-white/30 hover:border-white/50 hover:bg-white/5 font-medium text-xs md:text-sm flex items-center gap-1.5 md:gap-2 transition-all duration-300"
            >
              <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-10"
        >
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" />
            <span className="mono text-[10px] md:text-xs font-medium text-white/50 tracking-wide">
              Developer Dashboard
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-2">
            Your Developer Dashboard
          </h1>
          <p className="text-sm md:text-base text-white/60">
            Unlock insights, track progress, and plan your career path.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 md:mb-10 overflow-x-auto"
        >
          <div className="border border-white/20 bg-white/5 p-1 inline-flex gap-1 min-w-max">
            {[
              {
                id: "analysis" as const,
                label: "Analysis",
                fullLabel: "Full Analysis",
                icon: Code2,
              },
              {
                id: "career" as const,
                label: "Career",
                fullLabel: "Career Track",
                icon: TrendingUp,
              },
              {
                id: "market" as const,
                label: "Market",
                fullLabel: "Market Match",
                icon: Target,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 md:px-5 py-2 md:py-2.5 font-semibold transition-all duration-300 flex items-center gap-1.5 md:gap-2 text-xs md:text-sm ${
                  activeTab === tab.id
                    ? "bg-white text-black"
                    : "hover:bg-white/10"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">{tab.fullLabel}</span>
                <span className="sm:hidden">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "analysis" && (
            <AnalysisSection
              key="analysis"
              fullReport={fullReport}
              isAnalyzing={isAnalyzing}
              analysisError={analysisError}
              onAnalyze={handleFullAnalysis}
            />
          )}
          {activeTab === "career" && (
            <CareerTrackSection key="career" fullReport={fullReport} />
          )}
          {activeTab === "market" && (
            <MarketMatchSection key="market" fullReport={fullReport} />
          )}
        </AnimatePresence>
      </div>

      {/* Terminal Output Footer */}
      <div className="fixed bottom-4 right-4 z-50 border border-white/30 bg-black p-3 md:p-4 mono text-[10px] md:text-xs hidden lg:block">
        <p className="opacity-50">$ devpath --current-tab</p>
        <p className="text-green-500">&gt; {activeTab.toUpperCase()}</p>
        <p className="opacity-50">
          $<span className="animate-pulse">_</span>
        </p>
      </div>
    </main>
  );
}
