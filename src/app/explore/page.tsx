"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Github,
  TrendingUp,
  Target,
  Rocket,
  CheckCircle2,
  Zap,
  Shield,
  Users,
  BarChart3,
  Terminal,
} from "lucide-react";

export default function ExplorePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle Grid Pattern Background */}
      <div className="fixed inset-0 z-0 grid-pattern opacity-50" />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/20 bg-black/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 flex items-center justify-between">
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

          <button
            onClick={() => router.push("/auth")}
            className="px-3 md:px-5 py-2 md:py-2.5 border border-white bg-white text-black hover:bg-white/90 font-semibold text-xs md:text-sm flex items-center gap-1.5 md:gap-2 transition-all duration-300"
          >
            <Github className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Start</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 md:gap-3 mb-8 md:mb-12 border border-white/20 bg-white/5 px-3 md:px-4 py-1.5 md:py-2">
            <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />
            <span className="mono text-[10px] md:text-xs font-medium text-white/70">
              Explore Features
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-[1.1] tracking-tight">
            Unlock Your
            <br />
            <span className="text-white/80">Full Potential</span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-white/70 max-w-2xl mb-8 md:mb-12 leading-relaxed">
            AI-powered insights, personalized career tracks, and market-ready
            guidance to accelerate your developer journey.
          </p>
        </motion.div>
      </div>

      {/* Core Features */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12 md:pb-20 border-t border-white/20 pt-12 md:pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-20"
        >
          {coreFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 p-8 transition-all duration-300 h-full"
            >
              <div className="w-14 h-14 border-2 border-white flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase mono">
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.points.map((point, pIdx) => (
                  <li
                    key={pIdx}
                    className="flex items-start gap-2 text-sm text-gray-400"
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              How It Works
            </h2>
            <p className="text-white/60">
              A simple 4-step process to unlock your potential
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + 0.1 * idx }}
                className="border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 p-6 h-full transition-all duration-300"
              >
                <div className="w-10 h-10 border border-white/30 flex items-center justify-center font-bold text-lg mb-4 mono">
                  {idx + 1}
                </div>
                <step.icon className="w-7 h-7 mb-4 text-white/70" />
                <h3 className="text-sm font-bold mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Why Choose DevPath AI
            </h2>
            <p className="text-white/60">Built for developers, by developers</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + 0.1 * idx }}
                className="border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 p-6 flex gap-4 transition-all duration-300"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 border border-white/30 flex items-center justify-center">
                    {benefit.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold mb-2">{benefit.title}</h3>
                  <p className="text-white/60">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="border-2 border-white/30 bg-white/5 p-12 text-center max-w-4xl mx-auto">
            <div className="border border-white/30 w-fit mx-auto p-4 mb-8 bg-white/5">
              <Zap className="w-12 h-12 text-white/70" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
              Join thousands of developers who have unlocked their potential
              with AI-powered insights.
            </p>
            <button
              onClick={() => router.push("/auth")}
              className="px-8 py-3.5 border-2 border-white bg-white text-black hover:bg-white/90 font-bold flex items-center gap-3 mx-auto transition-all duration-300"
            >
              <Github className="w-5 h-5" />
              Start Your Journey
              <Rocket className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

const coreFeatures = [
  {
    icon: <Terminal className="w-7 h-7 text-white" />,
    gradient: "from-violet-500 to-purple-500",
    title: "Full GitHub Analysis",
    description:
      "Deep dive into your entire GitHub presence with AI-powered insights.",
    points: [
      "Scans up to 30 repositories",
      "Identifies your developer archetype",
      "Extracts skill constellation",
      "Highlights flagship projects",
      "AI code quality analysis",
    ],
  },
  {
    icon: <TrendingUp className="w-7 h-7 text-white" />,
    gradient: "from-blue-500 to-cyan-500",
    title: "Career Track Generator",
    description: "Get personalized learning paths tailored to your goals.",
    points: [
      "3-step structured roadmap",
      "Learning resources & guidance",
      "Bridge & capstone projects",
      "Suggested tech stacks",
      "Skill progression tracking",
    ],
  },
  {
    icon: <Target className="w-7 h-7 text-white" />,
    gradient: "from-orange-500 to-red-500",
    title: "Market Match Analysis",
    description: "Compare your skills against industry standards.",
    points: [
      "Gap analysis for dream roles",
      "Skills matching vs missing",
      "Visual match score",
      "8+ job role profiles",
      "Actionable recommendations",
    ],
  },
];

const steps = [
  {
    icon: Github,
    title: "Connect GitHub",
    description:
      "Authenticate via GitHub OAuth to securely analyze your profile.",
  },
  {
    icon: Terminal,
    title: "AI Analysis",
    description: "Our AI analyzes your repos, commits, and code patterns.",
  },
  {
    icon: BarChart3,
    title: "Get Insights",
    description: "Discover your archetype, skills, and quality metrics.",
  },
  {
    icon: Rocket,
    title: "Take Action",
    description: "Follow personalized career tracks and project suggestions.",
  },
];

const benefits = [
  {
    icon: <Zap className="w-6 h-6 text-white" />,
    title: "Lightning Fast",
    description:
      "Get comprehensive insights in under 60 seconds with advanced AI processing.",
  },
  {
    icon: <Shield className="w-6 h-6 text-white" />,
    title: "Privacy First",
    description:
      "Your data stays secure. Tokens are stored locally and never shared.",
  },
  {
    icon: <Users className="w-6 h-6 text-white" />,
    title: "Community Driven",
    description:
      "Built by developers, for developers. We understand your journey.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    title: "Always Improving",
    description:
      "Regular updates with new features, insights, and career opportunities.",
  },
];
