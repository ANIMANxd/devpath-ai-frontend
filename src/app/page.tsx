"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Github,
  Code2,
  TrendingUp,
  Target,
  ChevronRight,
  Terminal,
  Zap,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function HomePage() {
  const router = useRouter();
  const { jwtToken } = useAuthStore();

  const handleGetStarted = () => {
    if (jwtToken) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  };

  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* Subtle Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Minimal Geometric Accents */}
      <div className="absolute top-0 left-0 w-64 h-64 border border-white/5 hidden xl:block" />
      <div className="absolute bottom-0 right-0 w-96 h-96 border border-white/5 hidden xl:block" />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/20 bg-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 md:gap-3"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 border border-white/30 flex items-center justify-center">
              <Terminal className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-lg md:text-xl font-bold mono">
              DevPath AI
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 md:gap-4"
          >
            <button
              onClick={() => router.push("/dashboard")}
              className="hidden sm:block px-4 md:px-5 py-2 md:py-2.5 border border-white/30 hover:border-white/50 hover:bg-white/5 font-medium text-xs md:text-sm tracking-wide transition-all duration-300"
            >
              Dashboard
            </button>
            <button
              onClick={handleGetStarted}
              className="px-3 md:px-5 py-2 md:py-2.5 border border-white bg-white text-black hover:bg-white/90 font-semibold text-xs md:text-sm tracking-wide flex items-center gap-1.5 md:gap-2 transition-all duration-300"
            >
              <Github className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 pt-16 md:pt-24 lg:pt-32 pb-16 md:pb-20 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8"
        >
          {/* Version Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 md:gap-3 mb-8 md:mb-12 border border-white/20 px-3 md:px-4 py-1.5 md:py-2 bg-white/5"
          >
            <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />
            <span className="mono text-[10px] md:text-xs font-medium text-white/70">
              v2.4.0 · AI Powered
            </span>
          </motion.div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 md:mb-6 leading-[1.1] tracking-tight">
            Your Developer
            <br />
            <span className="text-white/80">Journey, Mapped</span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl max-w-2xl mb-8 md:mb-12 leading-relaxed text-white/70">
            Unlock deep insights from your GitHub profile. Discover your
            developer archetype and get AI-powered career paths tailored
            specifically for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <motion.button
              whileHover={{ x: 4, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetStarted}
              className="px-8 py-4 border-2 border-white bg-white text-black font-bold text-base flex items-center justify-between hover:bg-white/90 transition-all duration-300 group"
            >
              <span className="flex items-center gap-3">
                <Github className="w-5 h-5" />
                Analyze My GitHub
              </span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/explore")}
              className="px-8 py-4 border border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50 font-semibold text-base flex items-center justify-between transition-all duration-300 group"
            >
              <span>Explore Features</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* Terminal Output Style */}
          <div className="border border-white/20 bg-white/5 p-6 max-w-xl mono text-sm">
            <p className="text-white/40">$ devpath --status</p>
            <p className="text-green-400 mt-2">&gt; System: Operational</p>
            <p className="text-green-400">&gt; AI Engine: Ready</p>
            <p className="text-white/60">&gt; Repos Scanned: 45,293</p>
            <p className="text-white/60">&gt; Developers Analyzed: 12,847</p>
            <p className="text-white/40 mt-2">
              $<span className="animate-pulse">_</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-24 border-t border-white/20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + 0.1 * idx }}
              className="border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 p-8 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-14 h-14 border border-white/30 flex items-center justify-center mb-6 group-hover:border-white/50 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed mb-6">
                {feature.description}
              </p>
              <div className="flex items-center gap-2 font-semibold mono text-sm text-white/50">
                <span>&gt;&gt;</span>
                <span>LEARN_MORE</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="border-2 border-white/30 bg-white/5 p-12 md:p-16 text-center"
        >
          <div className="mb-8 flex justify-center">
            <div className="border border-white/30 w-16 h-16 flex items-center justify-center bg-white/5">
              <Zap className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Ready to Discover Your Path?
          </h2>

          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            Join 12,000+ developers who have unlocked their career potential
            with AI-powered insights.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/auth")}
            className="px-10 py-4 border-2 border-white bg-white text-black font-bold text-lg inline-flex items-center gap-3 hover:bg-white/90 transition-all duration-300"
          >
            <Github className="w-5 h-5" />
            Start Your Journey
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          <div className="mt-10 pt-8 border-t border-white/20 flex flex-wrap justify-center gap-8 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white/50 rounded-full" />
              <span>Instant Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-white" />
              <span>NO_SIGNUP_REQUIRED</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/20 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Left: Copyright */}
            <div className="text-sm text-white/50">
              <p>© 2024 DevPath AI. All rights reserved.</p>
            </div>

            {/* Center: Social Links */}
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/ANIMANxd"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300"
              >
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:border-white/40 group-hover:bg-white/5 transition-all duration-300">
                  <Github className="w-5 h-5" />
                </div>
                <span className="text-sm hidden sm:inline">GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/aniruddha-bhide0704/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300"
              >
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:border-white/40 group-hover:bg-white/5 transition-all duration-300">
                  <Linkedin className="w-5 h-5" />
                </div>
                <span className="text-sm hidden sm:inline">LinkedIn</span>
              </a>

              <a
                href="https://www.instagram.com/_aniruddha_bhide/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-white/60 hover:text-white transition-all duration-300"
              >
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center group-hover:border-white/40 group-hover:bg-white/5 transition-all duration-300">
                  <Instagram className="w-5 h-5" />
                </div>
                <span className="text-sm hidden sm:inline">Instagram</span>
              </a>
            </div>

            {/* Right: Built by */}
            <div className="mono text-xs text-white/40">
              <p>Built by ANIMANxd</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const features = [
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "GitHub Deep Dive",
    description:
      "Comprehensive analysis of your repositories, code quality, and development patterns using advanced AI algorithms.",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Developer Archetype",
    description:
      "Discover if you're a Builder, Refiner, or Maintainer based on your commit history and coding style patterns.",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Career Pathways",
    description:
      "Get personalized learning tracks, project suggestions, and market-fit analysis for your dream tech role.",
  },
];
