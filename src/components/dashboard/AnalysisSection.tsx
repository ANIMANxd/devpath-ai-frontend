"use client";

import { motion } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  Code2,
  Star,
  Package,
  CheckCircle2,
  TrendingUp,
  Rocket,
  Terminal,
  Zap,
  ChevronRight,
} from "lucide-react";
import { FullReport } from "@/types/api";
import { formatSkillName, getArchetypeIcon } from "@/lib/utils";

interface AnalysisSectionProps {
  fullReport: FullReport | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  onAnalyze: () => void;
}

export default function AnalysisSection({
  fullReport,
  isAnalyzing,
  analysisError,
  onAnalyze,
}: AnalysisSectionProps) {
  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-[600px]"
      >
        <div className="border border-white/30 bg-white/5 p-12 text-center max-w-2xl">
          {/* Animated Icon */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-8"
          >
            <div className="w-20 h-20 border border-white/30 flex items-center justify-center mx-auto">
              <Terminal className="w-10 h-10 text-white/70" />
            </div>
          </motion.div>

          <h3 className="text-xl md:text-2xl font-bold mb-3">
            Analyzing Your Profile
          </h3>
          <p className="text-white/60 mb-8 md:mb-10 text-sm md:text-base">
            Examining repositories, commit patterns, and code style
          </p>

          {/* Progress Steps */}
          <div className="space-y-2 md:space-y-3 text-left max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-2 md:gap-3 p-3 md:p-4 border border-white/10 bg-white/5"
            >
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5 text-white/60" />
              <div>
                <p className="font-semibold text-xs md:text-sm">
                  Scanning Repositories
                </p>
                <p className="text-[10px] md:text-xs text-white/50">
                  Projects indexed
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-start gap-2 md:gap-3 p-3 md:p-4 border border-white/10 bg-white/5"
            >
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5 text-white/60" />
              <div>
                <p className="font-semibold text-xs md:text-sm">
                  Analyzing Code
                </p>
                <p className="text-[10px] md:text-xs text-white/50">
                  Patterns examined
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-start gap-2 md:gap-3 p-3 md:p-4 border border-white/30 bg-white/10"
            >
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs md:text-sm">
                  AI Processing
                </p>
                <p className="text-[10px] md:text-xs text-white/70">
                  Generating insights
                </p>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-xs text-white/40">
              Typically 30-60 seconds · Up to 30 repos
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (analysisError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="border border-white/30 bg-white/5 p-8 max-w-2xl mx-auto"
      >
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1 text-red-400" />
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Analysis Failed</h3>
            <p className="text-white/60 mb-4 text-sm">{analysisError}</p>
            <button
              onClick={onAnalyze}
              className="px-6 py-2.5 border border-white bg-white text-black hover:bg-white/90 font-semibold transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!fullReport) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="text-center"
      >
        <div className="border border-white/30 bg-white/5 p-12 max-w-3xl mx-auto">
          <div className="w-20 h-20 border border-white/30 flex items-center justify-center mx-auto mb-8">
            <Terminal className="w-10 h-10 text-white/70" />
          </div>

          <h2 className="text-3xl font-bold mb-3">
            Discover Your Developer DNA
          </h2>

          <p className="text-white/60 mb-10 text-base max-w-xl mx-auto leading-relaxed">
            Advanced AI will analyze your GitHub profile to uncover insights
            about your coding style, strengths, and career opportunities.
          </p>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <div className="border border-white/10 bg-white/5 hover:bg-white/10 p-4 transition-all duration-300">
              <Zap className="w-7 h-7 mx-auto mb-2 text-white/60" />
              <p className="text-sm font-semibold">AI Powered</p>
            </div>
            <div className="border border-white/10 bg-white/5 hover:bg-white/10 p-4 transition-all duration-300">
              <Code2 className="w-7 h-7 mx-auto mb-2 text-white/60" />
              <p className="text-sm font-semibold">Code Quality</p>
            </div>
            <div className="border border-white/10 bg-white/5 hover:bg-white/10 p-4 transition-all duration-300">
              <TrendingUp className="w-7 h-7 mx-auto mb-2 text-white/60" />
              <p className="text-sm font-semibold">Career Paths</p>
            </div>
          </div>

          <button
            onClick={onAnalyze}
            className="px-8 py-3.5 border-2 border-white bg-white text-black hover:bg-white/90 font-bold inline-flex items-center gap-3 transition-all duration-300"
          >
            Start Analysis
            <ChevronRight className="w-5 h-5" />
          </button>

          <p className="text-xs mono opacity-50 mt-6">
            30_REPOS // 60_SECONDS // 100%_SECURE
          </p>
        </div>
      </motion.div>
    );
  }

  // Show full report
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Developer Archetype */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border-2 border-white/30 bg-white/5 p-8"
      >
        <div className="flex items-center gap-6 mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-7xl"
          >
            {getArchetypeIcon(fullReport.developer_archetype)}
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-white/50">
                Developer Type
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-3">
              {fullReport.developer_archetype}
            </h2>
            <p className="text-white/60 text-base leading-relaxed">
              Based on commit patterns and coding style
            </p>
          </div>
        </div>
      </motion.div>

      {/* Skills Constellation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border border-white/30 bg-white/5 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 border border-white/30 flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold">Skill Map</h3>
          <span className="px-4 py-1.5 border border-white/20 bg-white/5 text-sm font-semibold mono">
            {fullReport.skill_constellation.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {fullReport.skill_constellation.map((skill, idx) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.03 * idx }}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2.5 border border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer font-medium text-sm"
            >
              {formatSkillName(skill)}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Flagship Projects */}
      {fullReport.flagship_projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-white/30 bg-white/5 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 border border-white/30 flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold">Flagship Projects</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fullReport.flagship_projects.map((project) => (
              <div
                key={project.name}
                className="border border-white/20 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300 h-full"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 border border-white/30 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold truncate text-sm">{project.name}</h4>
                </div>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">
                  {project.ai_summary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 border border-white/20 text-xs mono"
                    >
                      {formatSkillName(skill)}
                    </span>
                  ))}
                  {project.skills.length > 4 && (
                    <span className="px-2 py-1 border border-white/20 text-xs mono text-white/50">
                      +{project.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Code Quality Summary */}
      {fullReport.ai_code_quality_summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-white/30 bg-white/5 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 border border-white/30 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold">Code Quality</h3>
          </div>
          <div className="border border-white/20 bg-white/5 p-6">
            <p className="text-white/70 leading-relaxed">
              {fullReport.ai_code_quality_summary}
            </p>
          </div>
        </motion.div>
      )}

      {/* Suggested Career Paths */}
      {fullReport.suggested_paths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="border border-white/30 bg-white/5 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 border border-white/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold">Career Paths</h3>
          </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
            {fullReport.suggested_paths.map((path, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="border border-white/20 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 border border-white/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="font-bold mono text-sm">{idx + 1}</span>
                  </div>
                  <h4 className="font-bold text-base">{path.path_name}</h4>
                </div>
                <p className="text-white/60 mb-4 leading-relaxed">
                  {path.description}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white/70">
                    Skills Needed:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {path.skills_to_develop.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 border border-white/20 text-sm mono"
                      >
                        {formatSkillName(skill)}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Suggested Projects */}
      {fullReport.suggested_projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="border border-white/30 bg-white/5 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 border border-white/30 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold">Project Ideas</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {fullReport.suggested_projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 * idx }}
                className="border border-white/20 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 border border-white/30 bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold">{project.title}</h4>
                </div>
                <p className="text-white/60 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Key Features:
                    </h5>
                    <ul className="space-y-2">
                      {project.features.map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          className="text-sm text-white/60 flex items-start gap-2 pl-6"
                        >
                          <span className="text-white/50 font-bold">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <h5 className="text-sm font-semibold text-white/70 mb-2">
                      Suggested Stack:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {project.suggested_stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 border border-white/20 text-xs mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Refresh Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center pt-8"
      >
        <button
          onClick={onAnalyze}
          className="px-8 py-4 border-2 border-white hover:bg-white/90 hover:text-black transition-all duration-300 flex items-center gap-3 mx-auto font-semibold"
        >
          <Zap className="w-5 h-5" />
          Re-analyze Profile
          <Zap className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  );
}
