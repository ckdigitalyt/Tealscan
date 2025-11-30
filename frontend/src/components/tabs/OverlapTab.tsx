"use client";

import { motion } from "framer-motion";
import { ScanResponse } from "@/types";
import { AlertTriangle, TrendingDown } from "lucide-react";
import { detectOverlaps } from "@/lib/overlapDetector";

interface OverlapTabProps {
  data: ScanResponse;
}

export default function OverlapTab({ data }: OverlapTabProps) {
  const overlaps = detectOverlaps(data.funds);
  const overlappingFunds = data.funds.filter(f => overlaps.fundOverlaps[f.name] && overlaps.fundOverlaps[f.name].length > 0);

  return (
    <div className="space-y-6">
      {/* Risk Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`glass-card rounded-2xl p-6 border ${overlaps.concentrationScore > 60 ? "border-neon-orange/50 bg-neon-orange/5" : "border-white/10"}`}
      >
        <div className="flex items-start gap-4">
          <AlertTriangle className={`w-6 h-6 flex-shrink-0 mt-1 ${overlaps.concentrationScore > 60 ? "text-neon-orange" : "text-yellow-400"}`} />
          <div>
            <h3 className="text-white font-semibold mb-2">Concentration Risk Score: {overlaps.concentrationScore}/100</h3>
            <p className="text-gray-400 text-sm">
              {overlaps.concentrationScore > 60 
                ? "Your portfolio has significant overlap. Consider consolidating similar funds to reduce risk." 
                : "Your portfolio diversification looks good. Monitor for potential overlaps."}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Overlapping Holdings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="glass-card rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Overlapping Fund Holdings</h3>
        <div className="space-y-3">
          {overlappingFunds.slice(0, 5).map((fund, i) => {
            const fundOverlaps = overlaps.fundOverlaps[fund.name] || [];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-neon-orange/30 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-white font-medium text-sm">{fund.name}</p>
                  <span className="text-xs px-2 py-1 rounded bg-neon-orange/20 text-neon-orange font-semibold">
                    {fundOverlaps.length} overlaps
                  </span>
                </div>
                <p className="text-xs text-gray-400">Overlaps with: {fundOverlaps.join(", ")}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Sector Concentration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Sector Concentration</h3>
        <div className="space-y-3">
          {[
            { sector: "IT", percentage: 28, limit: 30 },
            { sector: "Banking", percentage: 22, limit: 30 },
            { sector: "Pharma", percentage: 18, limit: 30 },
            { sector: "Auto", percentage: 15, limit: 30 },
            { sector: "FMCG", percentage: 12, limit: 30 },
            { sector: "Others", percentage: 5, limit: 30 },
          ].map((sector, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-300">{sector.sector}</span>
                <span className="text-sm font-semibold text-white">{sector.percentage}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sector.percentage}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  className={`h-full rounded-full ${sector.percentage > sector.limit ? "bg-neon-orange" : "bg-gradient-to-r from-neon-green to-accent"}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Diversification Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass-card rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-primary/10 to-transparent"
      >
        <h4 className="text-white font-semibold mb-4">Diversification Metrics</h4>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-3xl font-bold text-primary mb-1">{data.funds_count}</p>
            <p className="text-sm text-gray-400">Total Funds in Portfolio</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-accent mb-1">{Math.round(data.funds_count * 0.85)}</p>
            <p className="text-sm text-gray-400">Effective Holdings</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
