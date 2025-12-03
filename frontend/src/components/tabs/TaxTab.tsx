"use client";

import { motion } from "framer-motion";
import { ScanResponse } from "@/types";
import { Leaf, TrendingUp, Calendar } from "lucide-react";

interface TaxTabProps {
  data: ScanResponse;
}

function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
  return `₹${value.toFixed(0)}`;
}

export default function TaxTab({ data }: TaxTabProps) {
  const ltcgHarvestableFunds = data.funds.filter(f => f.invested < f.value && f.plan_type === "Regular");
  const potentialTaxFree = ltcgHarvestableFunds.reduce((sum, f) => sum + (f.value - f.invested), 0) * 0.1;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-teal-50 rounded-2xl p-8 border border-teal-200"
      >
        <div className="flex items-start gap-4 mb-6">
          <Leaf className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tax-Free LTCG Harvesting</h3>
            <p className="text-sm text-gray-600">Potential tax-free gains if harvested by year-end</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl border border-teal-200">
            <p className="text-4xl font-bold text-teal-600">{formatCurrency(potentialTaxFree)}</p>
            <p className="text-xs text-gray-500 mt-2">Can be harvested tax-free</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-teal-200">
            <p className="text-4xl font-bold text-emerald-600">₹0</p>
            <p className="text-xs text-gray-500 mt-2">Tax liability if harvested now</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Funds Ready for Harvesting</h3>
        <div className="space-y-3">
          {ltcgHarvestableFunds.slice(0, 4).map((fund, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-teal-300 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium text-sm mb-1">{fund.name}</p>
                  <p className="text-xs text-gray-500">Harvestable LTCG: {formatCurrency(fund.value - fund.invested)}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-teal-100 text-teal-700 font-semibold whitespace-nowrap">
                  Ready
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax-Aware Switch Analysis</h3>
        {data.funds.filter(f => f.plan_type === "Regular").slice(0, 3).map((fund, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 mb-4 rounded-xl bg-gray-50 border border-gray-200"
          >
            <p className="text-gray-900 font-medium text-sm mb-3">{fund.name}</p>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">Annual Savings</p>
                <p className="text-teal-600 font-semibold">{formatCurrency(fund.annual_commission_loss)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Break-even Period</p>
                <p className="text-teal-700 font-semibold">Immediate</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">10-Year Benefit</p>
                <p className="text-teal-600 font-semibold">{formatCurrency(fund.annual_commission_loss * 10)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recommended Timeline</h3>
        </div>
        <div className="space-y-3">
          {[
            { month: "This Month", action: "Harvest LTCG from completed 1-year funds", priority: "High" },
            { month: "Month 2-3", action: "Switch Regular to Direct plans", priority: "High" },
            { month: "Month 4+", action: "Monitor new fund performance", priority: "Medium" },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.priority === "High" ? "bg-amber-500" : "bg-teal-500"}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.month}</p>
                <p className="text-xs text-gray-500">{item.action}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
