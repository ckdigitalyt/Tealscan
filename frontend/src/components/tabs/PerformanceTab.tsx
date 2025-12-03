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
      <div className="grid sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-teal-50 rounded-xl p-6 border border-teal-200"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">On-Track Funds</p>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-bold text-teal-600">{onTrack}</p>
          <p className="text-xs text-gray-500 mt-2">Outperforming category</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-amber-50 rounded-xl p-6 border border-amber-200"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Off-Track Funds</p>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-amber-600">{offTrack}</p>
          <p className="text-xs text-gray-500 mt-2">Underperforming recently</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-emerald-50 rounded-xl p-6 border border-emerald-200"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Avg Return</p>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">14.2%</p>
          <p className="text-xs text-gray-500 mt-2">Portfolio XIRR</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 overflow-hidden shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Performance Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Fund Name</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">1Y %</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">3Y %</th>
                <th className="text-right py-3 px-4 text-gray-600 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.funds.slice(0, 6).map((fund, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-900 font-medium text-sm">{fund.name.substring(0, 35)}...</td>
                  <td className={`text-right py-3 px-4 font-semibold ${fund.xirr && fund.xirr > 12 ? "text-teal-600" : "text-gray-500"}`}>
                    {fund.xirr ? `${fund.xirr.toFixed(1)}%` : "—"}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-600">13.5%</td>
                  <td className="text-right py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      fund.rating === "On-Track" 
                        ? "bg-teal-100 text-teal-700" 
                        : "bg-amber-100 text-amber-700"
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">vs Benchmark (Nifty 50)</h3>
        <div className="space-y-4">
          {["1 Year", "3 Year", "5 Year"].map((period, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">{period} Return</span>
                <span className="text-sm font-semibold text-gray-900">+2.3%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "62%" }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-600"
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">Your portfolio is outperforming the benchmark by an average of 2.3% annually.</p>
      </motion.div>
    </div>
  );
}
