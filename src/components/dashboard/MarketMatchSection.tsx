"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  Target,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { FullReport, GapAnalysis, MarketMatchRequest } from "@/types/api";
import { apiClient } from "@/lib/api";
import { formatSkillName } from "@/lib/utils";
import toast from "react-hot-toast";

interface MarketMatchSectionProps {
  fullReport: FullReport | null;
}

const JOB_TITLES = [
  "Data Engineer",
  "ML Engineer",
  "Senior React Developer",
  "Senior Python Backend Developer",
  "DevOps Engineer",
  "Generative AI Specialist",
  "Cloud Solutions Architect",
  "Security Engineer",
  "Mobile App Developer",
  "AI Product Engineer",
  "Data Scientist",
  "Full Stack Engineer",
  "Site Reliability Engineer (SRE)",
  "AI Infrastructure Engineer",
  "Data Platform Engineer",
  "Blockchain Developer",
  "Computer Vision Engineer",
  "AI Prompt Engineer",
  "Automation Engineer",
  "Embedded Systems Engineer",
];

export default function MarketMatchSection({
  fullReport,
}: MarketMatchSectionProps) {
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedJob) {
      toast.error("Please select a job title");
      return;
    }

    const userSkills = fullReport?.skill_constellation || [];
    if (userSkills.length === 0) {
      toast.error("Please run full analysis first to detect your skills");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const toastId = toast.loading("Analyzing market fit...");

    try {
      const request: MarketMatchRequest = {
        user_skills: userSkills,
        job_title: selectedJob,
      };

      const analysis = await apiClient.marketMatch(request);
      setGapAnalysis(analysis);
      toast.success("Market analysis complete!", { id: toastId });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to analyze market fit";
      setError(message);
      toast.error(message, { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Input Form */}
      <div className="border border-white/30 bg-white/5 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Market Match Analysis</h2>
        </div>

        <p className="text-white/60 mb-6 leading-relaxed">
          Compare your skills against industry standards for your dream role and
          discover what you need to learn.
        </p>

        {fullReport && (
          <div className="mb-6 border border-white/20 bg-white/5 p-4">
            <p className="text-sm font-semibold mb-3 text-white/70">
              Your Current Skills ({fullReport.skill_constellation.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {fullReport.skill_constellation.slice(0, 12).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 border border-white/20 hover:bg-white/10 transition-all duration-300 text-sm"
                >
                  {formatSkillName(skill)}
                </span>
              ))}
              {fullReport.skill_constellation.length > 12 && (
                <span className="px-3 py-1 border border-white/20 text-white/50 text-sm">
                  +{fullReport.skill_constellation.length - 12} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="job"
              className="block text-sm font-semibold mb-2 text-white/70"
            >
              Target Job Role
            </label>
            <select
              id="job"
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/30 focus:outline-none focus:border-white/50 transition-all duration-300 mono"
              disabled={isAnalyzing}
            >
              <option value="">Select a job title...</option>
              {JOB_TITLES.map((job) => (
                <option key={job} value={job}>
                  {formatSkillName(job)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !fullReport || !selectedJob}
            className="w-full py-3 border border-white bg-white text-black hover:bg-white/90 font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="w-5 h-5" />
                Analyze Market Fit
              </>
            )}
          </button>

          {!fullReport && (
            <p className="text-sm text-center border border-white/20 bg-white/5 p-3 text-white/60">
              ⚠️ Run full analysis first
            </p>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 border border-red-500/30 bg-red-500/5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
            <div>
              <p className="font-bold mb-1 text-red-400">Error</p>
              <p className="text-white/60 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Gap Analysis Results */}
      {gapAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary */}
          <div className="border-2 border-white/30 bg-white/5 p-8">
            <h3 className="text-xl font-bold mb-4">Analysis Summary</h3>
            <p className="text-white/70 leading-relaxed">
              {gapAnalysis.summary_paragraph}
            </p>
          </div>

          {/* Matching Skills */}
          <div className="border border-white/30 bg-white/5 p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold">
                Matching Skills
                <span className="ml-3 px-3 py-1 border border-white/20 bg-white/5 text-sm mono">
                  {gapAnalysis.matching_skills.length} skills
                </span>
              </h3>
            </div>

            {gapAnalysis.matching_skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {gapAnalysis.matching_skills.map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-2 border border-green-500/30 bg-green-500/5 hover:bg-green-500/10 transition-all duration-300 flex items-center gap-2 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    {formatSkillName(skill)}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-white/60">No matching skills found.</p>
            )}
          </div>

          {/* Missing Skills */}
          <div className="border border-white/30 bg-white/5 p-8">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-bold">
                Skills to Learn
                <span className="ml-3 px-3 py-1 border border-white/20 bg-white/5 text-sm mono">
                  {gapAnalysis.missing_skills.length} skills
                </span>
              </h3>
            </div>

            {gapAnalysis.missing_skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {gapAnalysis.missing_skills.map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-2 border border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 transition-all duration-300 flex items-center gap-2 text-sm"
                  >
                    <XCircle className="w-4 h-4 text-orange-400" />
                    {formatSkillName(skill)}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="border border-white/20 bg-white/5 p-4 text-sm text-white/70">
                🎉 All required skills acquired
              </p>
            )}
          </div>

          {/* Match Score */}
          <div className="border-2 border-white/30 bg-white/5 p-8 text-center">
            <h3 className="text-lg font-semibold text-white/70 mb-6">
              Your Match Score
            </h3>
            <div className="w-fit mx-auto mb-6 border-2 border-white/30 bg-white/5 p-8">
              <div className="text-6xl font-bold mono mb-4">
                {Math.round(
                  (gapAnalysis.matching_skills.length /
                    (gapAnalysis.matching_skills.length +
                      gapAnalysis.missing_skills.length)) *
                    100
                )}
                <span className="text-2xl">%</span>
              </div>
              <div className="h-2 w-64 bg-black border border-white/30 overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      (gapAnalysis.matching_skills.length /
                        (gapAnalysis.matching_skills.length +
                          gapAnalysis.missing_skills.length)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
            <p className="text-white/60 mb-6">
              {gapAnalysis.matching_skills.length} of{" "}
              {gapAnalysis.matching_skills.length +
                gapAnalysis.missing_skills.length}{" "}
              required skills matched
            </p>
            <button
              onClick={handleAnalyze}
              className="px-6 py-3 border border-white hover:bg-white/90 hover:text-black transition-all duration-300 flex items-center gap-2 mx-auto font-semibold"
            >
              <Target className="w-5 h-5" />
              Analyze Different Role
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
