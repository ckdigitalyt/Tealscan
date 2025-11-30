"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Info } from "lucide-react";
import { OverlapAlert } from "@/lib/overlapDetector";

interface ConcentrationRiskProps {
  overlaps: OverlapAlert[];
  score: number;
}

export default function ConcentrationRisk({ overlaps, score }: ConcentrationRiskProps) {
  if (overlaps.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 border border-neon-green/30 bg-neon-green/5"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-neon-green/20 flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6 text-neon-green" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neon-green mb-1">✅ Portfolio Diversified</h3>
            <p className="text-gray-300 text-sm">
              Good news! Your funds are well-distributed across categories. No concentration risks detected.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const riskLevel = score > 60 ? "High" : score > 30 ? "Medium" : "Low";
  const riskColor = score > 60 ? "neon-orange" : score > 30 ? "yellow-400" : "neon-green";
  const bgColor = score > 60 ? "neon-orange/5" : score > 30 ? "yellow-400/5" : "neon-green/5";
  const borderColor = score > 60 ? "neon-orange/30" : score > 30 ? "yellow-400/30" : "neon-green/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card rounded-2xl p-8 border border-${borderColor} bg-${bgColor}`}
    >
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-${riskColor}/20 flex items-center justify-center`}>
            <AlertTriangle className={`w-6 h-6 text-${riskColor}`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold text-${riskColor}`}>⚠️ Concentration Risk</h3>
            <p className="text-gray-400 text-sm">{riskLevel} Risk Level</p>
          </div>
        </div>
      </div>

      {/* Risk meter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">Risk Score</span>
          <span className={`text-2xl font-bold text-${riskColor}`}>{score}/100</span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r from-${riskColor} to-${riskColor} opacity-80`}
          />
        </div>
      </div>

      {/* Overlaps list */}
      <div className="space-y-3 mb-6">
        {overlaps.map((overlap, i) => (
          <motion.div
            key={overlap.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="bg-white/5 rounded-lg p-3 border border-white/5"
          >
            <p className="text-sm font-semibold text-white mb-1">{overlap.category}</p>
            <p className="text-xs text-gray-400">{overlap.message}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {overlap.fundNames.map((name) => (
                <span key={name} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded truncate">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-gray-500">
        💡 Tip: Consider consolidating overlapping funds to reduce fee redundancy and simplify portfolio management.
      </p>
    </motion.div>
  );
}
