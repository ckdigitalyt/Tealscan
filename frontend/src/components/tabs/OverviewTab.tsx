"use client";

import { motion } from "framer-motion";
import { ScanResponse } from "@/types";
import { TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react";
import AssetChart from "../AssetChart";

interface OverviewTabProps {
  data: ScanResponse;
}

function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
  return `₹${value.toFixed(0)}`;
}

export default function OverviewTab({ data }: OverviewTabProps) {
  const healthColor = data.portfolio_health_score >= 75 ? "text-teal-600" : 
                      data.portfolio_health_score >= 50 ? "text-amber-500" : "text-red-500";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Health Score</h3>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className={healthColor}
                  strokeDasharray={`${(data.portfolio_health_score / 100) * 351} 351`}
                  initial={{ strokeDasharray: "0 351" }}
                  animate={{ strokeDasharray: `${(data.portfolio_health_score / 100) * 351} 351` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </svg>
              <div className="absolute text-center">
                <div className={`text-4xl font-bold ${healthColor}`}>{data.portfolio_health_score}</div>
                <div className="text-xs text-gray-500">out of 100</div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Expense Efficiency</span>
                <span className="text-sm font-semibold text-gray-900">24/30</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-teal-500 to-teal-600 w-4/5" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Diversification</span>
                <span className="text-sm font-semibold text-gray-900">19/25</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-teal-500 to-teal-600 w-3/4" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Tax Efficiency</span>
                <span className="text-sm font-semibold text-gray-900">15/20</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-teal-500 to-teal-600 w-3/4" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Performance vs Benchmark</span>
                <span className="text-sm font-semibold text-gray-900">14/25</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-teal-500 to-teal-600 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Net Worth", value: formatCurrency(data.net_worth), icon: Target, color: "text-teal-600", bg: "bg-teal-50" },
          { label: "Total Invested", value: formatCurrency(data.total_invested), icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Returns", value: `${data.total_gain_percent.toFixed(1)}%`, icon: TrendingUp, color: data.total_gain >= 0 ? "text-emerald-600" : "text-red-600", bg: data.total_gain >= 0 ? "bg-emerald-50" : "bg-red-50" },
          { label: "Hidden Costs/Yr", value: formatCurrency(data.total_commission_loss), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-teal-300 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-gray-600">{metric.label}</p>
                <div className={`p-2 rounded-lg ${metric.bg}`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Asset Allocation</h3>
        <AssetChart allocation={data.asset_allocation} />
      </motion.div>
    </div>
  );
}
