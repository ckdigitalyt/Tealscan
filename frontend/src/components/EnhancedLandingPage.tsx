"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Zap, TrendingDown, Users } from "lucide-react";
import ProblemSolution from "./ProblemSolution";
import HowItWorks from "./HowItWorks";
import FeatureGrid from "./FeatureGrid";
import TestimonialCarousel from "./TestimonialCarousel";
import SavingsComparison from "./SavingsComparison";
import FAQ from "./FAQ";
import Footer from "./Footer";
import { ScrollProgress } from "./animations";
import { AnimatedNumber } from "./animations";
import { useState } from "react";

interface EnhancedLandingPageProps {
  onStartAudit: () => void;
}

export default function EnhancedLandingPage({
  onStartAudit,
}: EnhancedLandingPageProps) {
  const [savings, setSavings] = useState(75000);

  return (
    <div className="min-h-screen bg-dark-bg">
      <ScrollProgress />
      {/* Hero Section */}
      <section className="min-h-screen pt-24 pb-12 px-4 flex items-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto w-full">
          <div className="text-center mb-12">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 text-neon-green text-sm font-medium mb-8"
            >
              <Users className="w-4 h-4" />
              Join 10,000+ Smart Investors
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 text-balance"
            >
              Stop Losing{" "}
              <motion.span
                className="gradient-text"
                animate={{ backgroundPosition: "200% 0" }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ₹{(savings / 1000).toFixed(0)}K
              </motion.span>
              <br />
              to Hidden Charges
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 text-balance"
            >
              The world's first privacy-first portfolio analyzer.
              <br />
              Your data never leaves your browser.
            </motion.p>

            {/* Dynamic Calculator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-12 glass-card rounded-2xl p-8 border border-white/10 max-w-2xl mx-auto"
            >
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-4">
                  Potential Annual Savings:
                </p>
                <input
                  type="range"
                  min="50000"
                  max="200000"
                  step="10000"
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-green"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>₹50K</span>
                  <span>₹200K</span>
                </div>
              </div>
              <div className="text-center">
                <motion.div
                  key={savings}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-bold text-neon-green mb-2"
                >
                  ₹{(savings / 100000).toFixed(1)}L
                </motion.div>
                <p className="text-sm text-gray-400">
                  Based on switching from regular to direct plans
                </p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <motion.button
                onClick={onStartAudit}
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 255, 148, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-neon-green to-accent text-dark-bg font-bold text-lg rounded-xl shadow-lg shadow-neon-green/30 hover:shadow-neon-green/50 transition-all"
              >
                Analyze My Portfolio - Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 border-2 border-neon-green text-neon-green font-bold text-lg rounded-xl hover:bg-neon-green/10 transition-all"
              >
                See How It Works
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-white/10"
            >
              {[
                {
                  icon: Lock,
                  title: "100% Privacy Guaranteed",
                  desc: "Client-side processing",
                },
                {
                  icon: Shield,
                  title: "Your Data Never Uploaded",
                  desc: "Everything stays local",
                },
                {
                  icon: Zap,
                  title: "Tax-Aware Logic",
                  desc: "Optimize for LTCG benefits",
                },
              ].map((indicator, i) => {
                const Icon = indicator.icon;
                return (
                  <motion.div
                    key={indicator.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <Icon className="w-6 h-6 text-neon-green" />
                    <div className="text-center">
                      <p className="font-semibold text-white text-sm">
                        {indicator.title}
                      </p>
                      <p className="text-xs text-gray-400">{indicator.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <ProblemSolution />
      <SavingsComparison />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <FeatureGrid />
      <TestimonialCarousel />
      <FAQ />
      <Footer />
    </div>
  );
}
