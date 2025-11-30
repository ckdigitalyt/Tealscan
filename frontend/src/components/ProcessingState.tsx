"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const statuses = [
  "Reading your portfolio data...",
  "Analyzing 47 transactions across 8 funds...",
  "Calculating expense ratios...",
  "Detecting overlapping holdings...",
  "Comparing with benchmarks...",
  "Generating recommendations...",
];

interface ProcessingStateProps {
  progress?: number;
}

export default function ProcessingState({ progress = 65 }: ProcessingStateProps) {
  const currentStatusIndex = Math.floor((progress / 100) * statuses.length);
  const currentStatus = statuses[Math.min(currentStatusIndex, statuses.length - 1)];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card bg-dark-card rounded-3xl p-12 shadow-card border border-white/10 text-center">
        {/* Animated Spinner */}
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-neon-green/10 to-accent/10 mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-neon-green" />
        </motion.div>

        {/* Status Message */}
        <motion.h3
          key={currentStatus}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-semibold text-white mb-6"
        >
          {currentStatus}
        </motion.h3>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-neon-green to-accent rounded-full"
            />
          </div>
          <p className="text-sm text-gray-400 mt-3">{Math.round(progress)}%</p>
        </div>

        {/* Status Indicators */}
        <div className="flex gap-2 justify-center mb-6">
          {statuses.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`w-2 h-2 rounded-full transition-all ${
                i < currentStatusIndex
                  ? "bg-neon-green"
                  : i === currentStatusIndex
                    ? "bg-neon-green/50"
                    : "bg-white/10"
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-gray-500">
          This may take a few seconds...
        </p>
      </div>
    </motion.div>
  );
}
