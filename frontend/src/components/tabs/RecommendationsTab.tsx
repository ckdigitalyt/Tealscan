"use client";

import { motion } from "framer-motion";
import { ScanResponse } from "@/types";
import { AlertTriangle, Pause, TrendingUp, Leaf, Clock } from "lucide-react";

interface RecommendationsTabProps {
  data: ScanResponse;
}

export default function RecommendationsTab({ data }: RecommendationsTabProps) {
  const exitFunds = data.funds.filter(f => f.rating === "Off-Track").slice(0, 2);
  const holdFunds = data.funds.filter(f => f.rating === "On-Track").slice(0, 2);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Priority 1: Exit Immediately</h3>
        </div>
        <div className="space-y-3">
          {exitFunds.map((fund, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-red-50 rounded-xl p-4 border border-red-200 hover:border-red-300 transition-all"
            >
              <p className="text-gray-900 font-medium text-sm mb-2">{fund.name}</p>
              <p className="text-xs text-gray-600 mb-3">Underperforming for 3+ months</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all font-semibold"
              >
                View Alternatives
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Pause className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900">Priority 2: Monitor & Pause SIPs</h3>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">No funds currently in this category. Your portfolio is performing well!</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-900">Priority 3: Increase SIPs in Best Performers</h3>
        </div>
        <div className="space-y-3">
          {holdFunds.map((fund, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-teal-50 rounded-xl p-4 border border-teal-200 hover:border-teal-300 transition-all"
            >
              <p className="text-gray-900 font-medium text-sm mb-2">{fund.name}</p>
              <p className="text-xs text-gray-600 mb-3">Top quartile performer • Consistent growth</p>
              <p className="text-xs text-teal-700 font-semibold">Suggested increase: +₹5,000/month</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-900">Priority 4: Tax-Free Harvesting</h3>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <p className="text-sm font-medium text-gray-900 mb-2">Harvest by: Dec 31, 2025</p>
          <p className="text-xs text-gray-600">₹{(data.total_gain * 0.1).toFixed(0)} in potential tax-free LTCG gains</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Rebalancing</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Action Items</p>
            <ul className="space-y-2">
              {[
                "Switch 3 regular plans to direct plans",
                "Consolidate 2 overlapping equity funds",
                "Rebalance sector allocation (reduce IT by 5%)",
                "Increase debt allocation by 3%",
              ].map((action, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-teal-200 mt-1" />
                  <span className="text-gray-700">{action}</span>
                </li>
              ))}
            </ul>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/30 transition-all"
          >
            Generate Rebalancing PDF
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
