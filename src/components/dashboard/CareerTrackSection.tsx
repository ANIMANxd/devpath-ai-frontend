"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Rocket,
} from "lucide-react";
import { FullReport, CareerTrack, CareerTrackRequest } from "@/types/api";
import { apiClient } from "@/lib/api";
import { formatSkillName } from "@/lib/utils";
import toast from "react-hot-toast";

interface CareerTrackSectionProps {
  fullReport: FullReport | null;
}

export default function CareerTrackSection({
  fullReport,
}: CareerTrackSectionProps) {
  const [careerTrack, setCareerTrack] = useState<CareerTrack | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetDomain, setTargetDomain] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTrack = async () => {
    if (!targetDomain.trim()) {
      toast.error("Please enter a target domain");
      return;
    }

    const currentSkills = fullReport?.skill_constellation || [];
    if (currentSkills.length === 0) {
      toast.error("Please run full analysis first to detect your skills");
      return;
    }

    setIsGenerating(true);
    setError(null);

    const toastId = toast.loading(
      "Generating your personalized career track..."
    );

    try {
      const request: CareerTrackRequest = {
        current_skills: currentSkills,
        target_domain: targetDomain,
      };

      const track = await apiClient.generateTrack(request);
      setCareerTrack(track);
      toast.success("Career track generated successfully!", { id: toastId });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate career track";
      setError(message);
      toast.error(message, { id: toastId });
    } finally {
      setIsGenerating(false);
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
          <TrendingUp className="w-6 h-6 text-white/70" />
          <h2 className="text-2xl font-bold">Generate Career Track</h2>
        </div>

        <p className="text-white/60 mb-6 leading-relaxed">
          Based on your current skills, we'll create a personalized learning
          path to help you reach your career goals.
        </p>

        {fullReport && (
          <div className="mb-6 border border-white/20 bg-white/5 p-4">
            <p className="text-sm font-medium mb-2 text-white/50">
              Your Current Skills:
            </p>
            <div className="flex flex-wrap gap-2">
              {fullReport.skill_constellation.slice(0, 10).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 border border-white/20 hover:border-white/40 hover:bg-white/10 text-sm transition-all duration-300"
                >
                  {formatSkillName(skill)}
                </span>
              ))}
              {fullReport.skill_constellation.length > 10 && (
                <span className="px-3 py-1 border border-white/20 text-white/50 text-sm">
                  +{fullReport.skill_constellation.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="target"
              className="block text-sm font-semibold mb-2"
            >
              Target Domain or Role
            </label>
            <input
              id="target"
              type="text"
              value={targetDomain}
              onChange={(e) => setTargetDomain(e.target.value)}
              placeholder="e.g., Frontend development with React, Machine Learning Engineer, etc."
              className="w-full px-4 py-3 bg-black border border-white/30 focus:outline-none focus:border-white/50 transition-all"
              disabled={isGenerating}
            />
          </div>

          <button
            onClick={handleGenerateTrack}
            disabled={isGenerating || !fullReport}
            className="w-full py-3 border border-white bg-white text-black hover:bg-white/90 font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                Generate Career Track
              </>
            )}
          </button>

          {!fullReport && (
            <p className="text-sm text-center border border-white/30 bg-white/5 p-3 text-white/60">
              ⚠️ Run full analysis first
            </p>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 border border-white/30 bg-white/5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
            <div>
              <p className="font-bold mb-1">Error</p>
              <p className="text-white/60 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Career Track Results */}
      {careerTrack && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Learning Step */}
          <div className="border-2 border-white/30 bg-white/5 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border border-white/30 flex items-center justify-center font-bold mono">
                1
              </div>
              <h3 className="text-xl font-bold">Learning Step</h3>
            </div>
            <h4 className="text-lg font-bold mb-3">
              {careerTrack.learning_step.title}
            </h4>
            <p className="text-white/60 leading-relaxed">
              {careerTrack.learning_step.description}
            </p>
          </div>

          {/* Bridge Project */}
          <div className="border-2 border-white/30 bg-white/5 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border border-white/30 flex items-center justify-center font-bold mono">
                2
              </div>
              <h3 className="text-xl font-bold">Bridge Project</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold mb-3">
                  {careerTrack.bridge_project.title}
                </h4>
                <p className="text-white/60 leading-relaxed">
                  {careerTrack.bridge_project.description}
                </p>
              </div>

              <div className="border border-white/20 bg-white/5 p-4">
                <h5 className="text-sm font-semibold mb-3 text-white/70">
                  Key Features:
                </h5>
                <ul className="space-y-2">
                  {careerTrack.bridge_project.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-white/60"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-white/20 bg-white/5 p-4">
                <h5 className="text-sm font-semibold mb-3 text-white/70">
                  Suggested Stack:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {careerTrack.bridge_project.suggested_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 border border-white/20 text-sm mono hover:bg-white/10 transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Capstone Project */}
          <div className="border-2 border-white/30 bg-white/5 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border border-white/30 flex items-center justify-center font-bold mono">
                3
              </div>
              <h3 className="text-xl font-bold">Capstone Project</h3>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold mb-3">
                  {careerTrack.capstone_project.title}
                </h4>
                <p className="text-white/60 leading-relaxed">
                  {careerTrack.capstone_project.description}
                </p>
              </div>

              <div className="border border-white/20 bg-white/5 p-4">
                <h5 className="text-sm font-semibold mb-3 text-white/70">
                  Key Features:
                </h5>
                <ul className="space-y-2">
                  {careerTrack.capstone_project.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-white/60"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-white/20 bg-white/5 p-4">
                <h5 className="text-sm font-semibold mb-3 text-white/70">
                  Suggested Stack:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {careerTrack.capstone_project.suggested_stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 border border-white/20 text-sm mono hover:bg-white/10 transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="border-2 border-white/30 bg-white/5 p-8 text-center">
            <div className="border border-white/30 bg-white/5 w-fit mx-auto p-4 mb-4">
              <Rocket className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold mb-2">
              Ready to Start Your Journey?
            </h3>
            <p className="text-white/60 mb-6 leading-relaxed">
              Follow this structured path to achieve your goal of becoming a{" "}
              {careerTrack.target_domain} expert.
            </p>
            <button
              onClick={handleGenerateTrack}
              className="px-6 py-3 border border-white hover:bg-white/90 hover:text-black transition-all duration-300 flex items-center gap-2 mx-auto font-semibold"
            >
              <TrendingUp className="w-5 h-5" />
              Generate New Track
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
