"use client";

import { motion } from "framer-motion";
import { ScanResponse } from "@/types";
import { TrendingUp, TrendingDown, AlertTriangle, Wallet, PieChart, Target, CheckCircle2 } from "lucide-react";
import AssetChart from "./AssetChart";
import FundTable from "./FundTable";
import PortfolioPerformance from "./PortfolioPerformance";

interface DashboardProps {
  data: ScanResponse;
}

function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `${(value / 100000).toFixed(2)} L`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} K`;
  }
  return value.toFixed(2);
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Dashboard({ data }: DashboardProps) {
  const hasCommissions = data.total_commission_loss > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen pt-24 pb-12 px-4"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-700/50"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              variants={itemVariants}
              className="hover-lift cursor-default"
            >
              <p className="text-slate-400 text-sm mb-2 font-medium">Net Worth</p>
              <p className="text-3xl sm:text-4xl font-bold">
                ₹{formatCurrency(data.net_worth)}
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="hover-lift cursor-default"
            >
              <p className="text-slate-400 text-sm mb-2 font-medium">Total Invested</p>
              <p className="text-2xl sm:text-3xl font-semibold text-slate-300">
                ₹{formatCurrency(data.total_invested)}
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="hover-lift cursor-default"
            >
              <p className="text-slate-400 text-sm mb-2 font-medium">Total Gain</p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl sm:text-3xl font-semibold ${data.total_gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {data.total_gain >= 0 ? "+" : ""}₹{formatCurrency(Math.abs(data.total_gain))}
                </p>
                {data.total_gain >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
              <p className={`text-sm mt-1 ${data.total_gain_percent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {data.total_gain_percent >= 0 ? "+" : ""}{data.total_gain_percent.toFixed(2)}%
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="hover-lift cursor-default"
            >
              <p className="text-slate-400 text-sm mb-2 font-medium">Hidden Commissions</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl sm:text-3xl font-semibold text-red-400">
                  ₹{formatCurrency(data.total_commission_loss)}/yr
                </p>
                {hasCommissions && <AlertTriangle className="w-5 h-5 text-red-400" />}
              </div>
              {hasCommissions && (
                <p className="text-xs text-red-300 mt-1">
                  Lost to regular plan expenses
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-5 hover-lift cursor-default"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-slate-500 font-medium">Funds Scanned</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{data.funds_count}</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-5 hover-lift cursor-default"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm text-slate-500 font-medium">Direct Plans</p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">{data.direct_funds_count}</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-5 hover-lift cursor-default"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-sm text-slate-500 font-medium">Regular Plans</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">{data.regular_funds_count}</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-5 hover-lift cursor-default"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-slate-500 font-medium">Health Score</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {data.portfolio_health_score}
              <span className="text-sm font-normal text-slate-500">/100</span>
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-2xl p-8"
        >
          <PortfolioPerformance funds={data.funds} />
        </motion.div>

        {hasCommissions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 hover-lift cursor-default"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Action Required: Switch to Direct Plans
                </h3>
                <p className="text-slate-600 text-sm mb-3">
                  You have <span className="font-semibold text-red-600">{data.regular_funds_count} Regular plan(s)</span> in
                  your portfolio. By switching to Direct plans, you can save approximately{" "}
                  <span className="font-semibold text-red-600">₹{formatCurrency(data.total_commission_loss)}</span> per year
                  in hidden commissions.
                </p>
                <p className="text-xs text-slate-500">
                  Over 20 years, this could amount to <span className="font-medium">₹{formatCurrency(data.total_commission_loss * 20 * 1.5)}</span> in lost wealth (assuming 8% growth).
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6 hover-lift cursor-default"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-slate-900">Asset Allocation</h3>
            </div>
            <AssetChart allocation={data.asset_allocation} />
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.45 }}
            className="glass-card rounded-2xl p-6 hover-lift cursor-default"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Portfolio Summary</h3>
            <div className="space-y-3">
              <motion.div 
                className="flex justify-between items-center p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                whileHover={{ x: 4 }}
              >
                <span className="text-slate-600 font-medium">Equity Allocation</span>
                <span className="font-bold text-slate-900">{data.asset_allocation.Equity}%</span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                whileHover={{ x: 4 }}
              >
                <span className="text-slate-600 font-medium">Debt Allocation</span>
                <span className="font-bold text-slate-900">{data.asset_allocation.Debt}%</span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                whileHover={{ x: 4 }}
              >
                <span className="text-slate-600 font-medium">Gold Allocation</span>
                <span className="font-bold text-slate-900">{data.asset_allocation.Gold}%</span>
              </motion.div>
              <motion.div 
                className="flex justify-between items-center p-3 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
                whileHover={{ x: 4 }}
              >
                <span className="text-primary font-semibold">Direct Plan Ratio</span>
                <span className="font-bold text-primary">
                  {data.funds_count > 0 ? ((data.direct_funds_count / data.funds_count) * 100).toFixed(0) : 0}%
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <FundTable funds={data.funds} />
        </motion.div>
      </div>
    </motion.div>
  );
}
