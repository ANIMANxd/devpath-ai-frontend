"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Terminal,
  Code2,
  TrendingUp,
  Target,
  User,
  History,
  Trash2,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { apiClient } from "@/lib/api";
import { FullReport, ReportHistoryItem } from "@/types/api";
import toast from "react-hot-toast";

import AnalysisSection from "@/components/dashboard/AnalysisSection";
import CareerTrackSection from "@/components/dashboard/CareerTrackSection";
import MarketMatchSection from "@/components/dashboard/MarketMatchSection";

export default function DashboardPage() {
  const router = useRouter();
  const { jwtToken, githubUsername, clearJwtToken, setGithubUsername } =
    useAuthStore();

  const [activeTab, setActiveTab] = useState<
    "analysis" | "career" | "market" | "history"
  >("analysis");
  const [fullReport, setFullReport] = useState<FullReport | null>(null);
  const [currentReportId, setCurrentReportId] = useState<number | null>(null);
  const [reportDate, setReportDate] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load report history and auto-load latest report on mount
  useEffect(() => {
    if (!jwtToken) {
      toast.error("Please authenticate first");
      router.push("/auth");
      return;
    }

    loadReportHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwtToken, router]);

  const loadReportHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const history = await apiClient.getReportHistory();
      setReportHistory(history);

      // Auto-load the most recent report if exists
      if (history.length > 0 && !fullReport) {
        const latestReport = history[0];
        const report = await apiClient.getReport(latestReport.id);
        setFullReport(report);
        setCurrentReportId(latestReport.id);
        setReportDate(latestReport.created_at);

        // Extract GitHub username from any repo if available
        if (!githubUsername) {
          // Try project_hubs first
          if (report.project_hubs.length > 0) {
            for (const repo of report.project_hubs) {
              if (repo.name && repo.name.includes("/")) {
                const username = repo.name.split("/")[0];
                if (username) {
                  setGithubUsername(username);
                  console.log(
                    "Extracted username from project_hubs:",
                    username
                  );
                  break;
                }
              }
            }
          }
          // Fallback to flagship_projects if project_hubs didn't work
          if (!githubUsername && report.flagship_projects.length > 0) {
            for (const repo of report.flagship_projects) {
              if (repo.name && repo.name.includes("/")) {
                const username = repo.name.split("/")[0];
                if (username) {
                  setGithubUsername(username);
                  console.log(
                    "Extracted username from flagship_projects:",
                    username
                  );
                  break;
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to load report history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleFullAnalysis = async () => {
    if (!jwtToken) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    const toastId = toast.loading(
      "Analyzing your GitHub profile... This may take a minute."
    );

    try {
      const report = await apiClient.analyze();
      setFullReport(report);
      setReportDate(new Date().toISOString());
      setCurrentReportId(null); // New analysis, not saved yet

      // Extract GitHub username from the new report
      if (!githubUsername) {
        if (report.project_hubs.length > 0) {
          for (const repo of report.project_hubs) {
            if (repo.name && repo.name.includes("/")) {
              const username = repo.name.split("/")[0];
              if (username) {
                setGithubUsername(username);
                console.log("Extracted username from new analysis:", username);
                break;
              }
            }
          }
        }
      }

      toast.success("Analysis complete! Check out your developer DNA.", {
        id: toastId,
      });

      // Reload history to get the new report ID
      await loadReportHistory();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to analyze profile";
      setAnalysisError(message);
      toast.error(message, { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadReport = async (reportId: number) => {
    try {
      const report = await apiClient.getReport(reportId);
      setFullReport(report);
      setCurrentReportId(reportId);
      const reportItem = reportHistory.find((r) => r.id === reportId);
      if (reportItem) {
        setReportDate(reportItem.created_at);
      }
      setActiveTab("analysis");
      toast.success("Report loaded successfully");
    } catch (err) {
      console.error("Failed to load report:", err);
      toast.error("Failed to load report");
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!confirm("Are you sure you want to delete this analysis report?")) {
      return;
    }

    try {
      await apiClient.deleteReport(reportId);
      toast.success("Report deleted successfully");

      // If we deleted the current report, clear it
      if (currentReportId === reportId) {
        setFullReport(null);
        setCurrentReportId(null);
        setReportDate(null);
      }

      // Reload history
      await loadReportHistory();
    } catch (err) {
      console.error("Failed to delete report:", err);
      toast.error("Failed to delete report");
    }
  };

  const handleLogout = () => {
    clearJwtToken();
    toast.success("Logged out successfully");
    router.push("/");
  };

  if (!jwtToken) {
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
            {githubUsername && (
              <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 border border-white/20 bg-white/5 mono text-[10px] md:text-xs">
                <User className="w-3 h-3 md:w-3.5 md:h-3.5 text-white/60" />
                <span className="text-white/70">{githubUsername}</span>
              </div>
            )}
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
              {
                id: "history" as const,
                label: "History",
                fullLabel: "Report History",
                icon: History,
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
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Analysis Date and Re-analyze Button */}
              {fullReport && reportDate && (
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/20 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-white/60" />
                    <span className="text-white/60">Analysis from:</span>
                    <span className="font-semibold">
                      {new Date(reportDate).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <button
                    onClick={handleFullAnalysis}
                    disabled={isAnalyzing}
                    className="px-4 py-2 border border-white/30 hover:border-white/50 hover:bg-white/10 font-semibold text-sm flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`}
                    />
                    Re-analyze
                  </button>
                </div>
              )}
              <AnalysisSection
                fullReport={fullReport}
                isAnalyzing={isAnalyzing}
                analysisError={analysisError}
                onAnalyze={handleFullAnalysis}
              />
            </motion.div>
          )}
          {activeTab === "career" && (
            <CareerTrackSection key="career" fullReport={fullReport} />
          )}
          {activeTab === "market" && (
            <MarketMatchSection key="market" fullReport={fullReport} />
          )}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="border border-white/30 bg-white/5 p-6">
                <h2 className="text-2xl font-bold mb-4">Report History</h2>
                <p className="text-white/60 mb-6">
                  View and manage your past analysis reports (up to 3 most
                  recent)
                </p>

                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent animate-spin" />
                  </div>
                ) : reportHistory.length === 0 ? (
                  <div className="text-center py-12 border border-white/20 bg-black/20">
                    <History className="w-12 h-12 mx-auto mb-4 text-white/30" />
                    <p className="text-white/50 mb-4">
                      No analysis reports yet
                    </p>
                    <button
                      onClick={() => setActiveTab("analysis")}
                      className="px-6 py-2 border border-white/30 hover:bg-white/10 font-semibold transition-all duration-300"
                    >
                      Run Your First Analysis
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reportHistory.map((report) => (
                      <div
                        key={report.id}
                        className="border border-white/30 bg-black/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/5 transition-all duration-300"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold mono">#{report.id}</span>
                            {currentReportId === report.id && (
                              <span className="px-2 py-0.5 bg-white text-black text-xs font-semibold">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white/60">
                            {new Date(report.created_at).toLocaleString(
                              "en-US",
                              {
                                dateStyle: "full",
                                timeStyle: "short",
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLoadReport(report.id)}
                            className="px-4 py-2 border border-white/30 hover:bg-white/10 font-semibold text-sm transition-all duration-300"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeleteReport(report.id)}
                            className="px-4 py-2 border border-red-500/30 hover:bg-red-500/10 text-red-400 font-semibold text-sm flex items-center gap-2 transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
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
