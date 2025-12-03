"use client";

import { motion } from "framer-motion";
import { ScanResponse } from "@/types";
import { AlertTriangle, TrendingDown } from "lucide-react";

interface OverlapTabProps {
  data: ScanResponse;
}

export default function OverlapTab({ data }: OverlapTabProps) {
  const fundNames = data.funds.map(f => f.name);
  const categoryMap: Record<string, string[]> = {};

  fundNames.forEach(name => {
    const category = name.includes("Equity") ? "Equity" : 
                    name.includes("Debt") ? "Debt" : 
                    name.includes("Gold") ? "Gold" : 
                    name.includes("Balanced") ? "Balanced" : "Other";
    if (!categoryMap[category]) categoryMap[category] = [];
    categoryMap[category].push(name);
  });

  const overlappingFunds = Object.entries(categoryMap).filter(([_, funds]) => funds.length > 1);
  const concentrationScore = overlappingFunds.reduce((score, [_, funds]) => score + (funds.length * 15), 30);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`bg-white rounded-2xl p-6 border shadow-sm ${concentrationScore > 60 ? "border-amber-300 bg-amber-50" : "border-gray-200"}`}
      >
        <div className="flex items-start gap-4">
          <AlertTriangle className={`w-6 h-6 flex-shrink-0 mt-1 ${concentrationScore > 60 ? "text-amber-600" : "text-amber-500"}`} />
          <div>
            <h3 className="text-gray-900 font-semibold mb-2">Concentration Risk Score: {Math.min(100, concentrationScore)}/100</h3>
            <p className="text-gray-600 text-sm">
              {concentrationScore > 60 
                ? "Your portfolio has significant overlap. Consider consolidating similar funds to reduce risk." 
                : "Your portfolio diversification looks good. Monitor for potential overlaps."}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Categories & Overlaps</h3>
        <div className="space-y-3">
          {overlappingFunds.map(([category, funds], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-amber-300 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-gray-900 font-medium text-sm">{category}</p>
                <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 font-semibold">
                  {funds.length} funds
                </span>
              </div>
              <p className="text-xs text-gray-500">{funds.join(", ").substring(0, 60)}...</p>
            </motion.div>
          ))}
          {overlappingFunds.length === 0 && (
            <p className="text-gray-500 text-sm">No significant overlaps detected</p>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector Concentration</h3>
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
                <span className="text-sm text-gray-700">{sector.sector}</span>
                <span className="text-sm font-semibold text-gray-900">{sector.percentage}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sector.percentage}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  className={`h-full rounded-full ${sector.percentage > sector.limit ? "bg-amber-500" : "bg-gradient-to-r from-teal-500 to-teal-600"}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-teal-50 rounded-2xl p-6 border border-teal-200"
      >
        <h4 className="text-gray-900 font-semibold mb-4">Diversification Metrics</h4>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-3xl font-bold text-teal-600 mb-1">{data.funds_count}</p>
            <p className="text-sm text-gray-600">Total Funds in Portfolio</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-teal-700 mb-1">{Math.round(data.funds_count * 0.85)}</p>
            <p className="text-sm text-gray-600">Effective Holdings</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
