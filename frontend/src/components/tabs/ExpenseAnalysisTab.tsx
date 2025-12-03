"use client";

import { motion } from "framer-motion";
import { ScanResponse } from "@/types";
import { TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ExpenseAnalysisTabProps {
  data: ScanResponse;
}

function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
  return `₹${value.toFixed(0)}`;
}

export default function ExpenseAnalysisTab({ data }: ExpenseAnalysisTabProps) {
  const potentialSavings = data.total_commission_loss;
  const regularFunds = data.funds.filter(f => f.plan_type === "Regular");

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-red-50 rounded-xl border border-red-100">
            <p className="text-sm text-gray-600 mb-2">Total Annual Expense</p>
            <p className="text-4xl font-bold text-red-600">{formatCurrency(data.total_commission_loss)}/yr</p>
            <p className="text-xs text-gray-500 mt-2">Approximate annual fees across all funds</p>
          </div>
          <div className="p-6 bg-teal-50 rounded-xl border border-teal-100">
            <p className="text-sm text-gray-600 mb-2">Potential Savings</p>
            <p className="text-4xl font-bold text-teal-600">{formatCurrency(potentialSavings)}/yr</p>
            <p className="text-xs text-gray-500 mt-2">By switching to direct plans</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 overflow-hidden shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">High-Cost Regular Plans</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Fund Name</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Current Value</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Annual Cost</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Potential Savings</th>
              </tr>
            </thead>
            <tbody>
              {regularFunds.slice(0, 5).map((fund, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-900 font-medium">{fund.name.substring(0, 40)}</td>
                  <td className="text-right py-3 px-4 text-gray-700">{formatCurrency(fund.value)}</td>
                  <td className="text-right py-3 px-4 text-red-600 font-semibold">{formatCurrency(fund.annual_commission_loss)}</td>
                  <td className="text-right py-3 px-4 text-teal-600 font-semibold">{formatCurrency(fund.annual_commission_loss)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-teal-50 rounded-2xl p-6 border border-teal-200"
      >
        <div className="flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-gray-900 font-semibold mb-2">Already Using {data.direct_funds_count} Direct Plans</h4>
            <p className="text-gray-600 text-sm">
              Great! You're already saving on {data.direct_funds_count} fund{data.direct_funds_count > 1 ? "s" : ""}.
              Consider converting your {data.regular_funds_count} regular plan{data.regular_funds_count > 1 ? "s" : ""} to direct for maximum savings.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900">Recommended Actions</h3>
        {regularFunds.slice(0, 3).map((fund, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-teal-300 transition-all shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-gray-900 font-medium text-sm mb-1">{fund.name}</p>
                <p className="text-xs text-gray-500">Current annual cost: {formatCurrency(fund.annual_commission_loss)}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg hover:bg-teal-200 transition-all"
              >
                View Direct Option
              </motion.button>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
