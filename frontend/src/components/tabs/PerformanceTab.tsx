"use client";

import { motion } from "framer-motion";
import { ScanResponse } from "@/types";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface PerformanceTabProps {
  data: ScanResponse;
}

export default function PerformanceTab({ data }: PerformanceTabProps) {
  const onTrack = data.funds.filter(f => f.rating === "On-Track").length;
  const offTrack = data.funds.filter(f => f.rating === "Off-Track").length;

  return (
    <div className="space-y-6">
      {/* Fund Categories */}
      <div className="grid sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-xl p-6 border border-neon-green/30 bg-neon-green/5"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">On-Track Funds</p>
            <TrendingUp className="w-4 h-4 text-neon-green" />
          </div>
          <p className="text-3xl font-bold text-neon-green">{onTrack}</p>
          <p className="text-xs text-gray-400 mt-2">Outperforming category</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card rounded-xl p-6 border border-yellow-400/30 bg-yellow-400/5"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Off-Track Funds</p>
            <AlertCircle className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-yellow-400">{offTrack}</p>
          <p className="text-xs text-gray-400 mt-2">Underperforming recently</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-xl p-6 border border-accent/30 bg-accent/5"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">Avg Return</p>
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          <p className="text-3xl font-bold text-accent">14.2%</p>
          <p className="text-xs text-gray-400 mt-2">Portfolio XIRR</p>
        </motion.div>
      </div>

      {/* Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass-card rounded-2xl p-6 border border-white/10 overflow-hidden"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Fund Performance Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400">Fund Name</th>
                <th className="text-right py-3 px-4 text-gray-400">1Y %</th>
                <th className="text-right py-3 px-4 text-gray-400">3Y %</th>
                <th className="text-right py-3 px-4 text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.funds.slice(0, 6).map((fund, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white font-medium text-sm">{fund.name.substring(0, 35)}...</td>
                  <td className={`text-right py-3 px-4 font-semibold ${fund.xirr && fund.xirr > 12 ? "text-neon-green" : "text-gray-400"}`}>
                    {fund.xirr ? `${fund.xirr.toFixed(1)}%` : "—"}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-400">13.5%</td>
                  <td className="text-right py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      fund.rating === "On-Track" 
                        ? "bg-neon-green/20 text-neon-green" 
                        : "bg-neon-orange/20 text-neon-orange"
                    }`}>
                      {fund.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Portfolio vs Benchmark */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass-card rounded-2xl p-6 border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-4">vs Benchmark (Nifty 50)</h3>
        <div className="space-y-4">
          {["1 Year", "3 Year", "5 Year"].map((period, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">{period} Return</span>
                <span className="text-sm font-semibold text-white">+2.3%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "62%" }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="h-full bg-gradient-to-r from-neon-green to-accent"
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">Your portfolio is outperforming the benchmark by an average of 2.3% annually.</p>
      </motion.div>
    </div>
  );
}
