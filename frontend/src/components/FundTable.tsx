"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FundData } from "@/types";
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, HelpCircle, Zap, Activity } from "lucide-react";

interface FundTableProps {
  funds: FundData[];
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

function getRatingConfig(rating: string) {
  switch (rating) {
    case "In-Form":
      return {
        icon: Zap,
        color: "text-emerald-600",
        bg: "bg-emerald-100",
        border: "border-emerald-200",
      };
    case "On-Track":
      return {
        icon: Activity,
        color: "text-blue-600",
        bg: "bg-blue-100",
        border: "border-blue-200",
      };
    case "Off-Track":
      return {
        icon: TrendingDown,
        color: "text-amber-600",
        bg: "bg-amber-100",
        border: "border-amber-200",
      };
    case "Out-of-Form":
      return {
        icon: AlertTriangle,
        color: "text-red-600",
        bg: "bg-red-100",
        border: "border-red-200",
      };
    default:
      return {
        icon: HelpCircle,
        color: "text-slate-600",
        bg: "bg-slate-100",
        border: "border-slate-200",
      };
  }
}

export default function FundTable({ funds }: FundTableProps) {
  const [sortBy, setSortBy] = useState<"value" | "xirr" | "name">("value");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedFund, setExpandedFund] = useState<string | null>(null);

  const sortedFunds = [...funds].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "value") {
      comparison = a.value - b.value;
    } else if (sortBy === "xirr") {
      const aXirr = a.xirr ?? -999;
      const bXirr = b.xirr ?? -999;
      comparison = aXirr - bXirr;
    } else {
      comparison = a.name.localeCompare(b.name);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: "value" | "xirr" | "name") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Fund Health Report</h3>
        <p className="text-sm text-slate-500 mt-1">
          Detailed analysis of each fund in your portfolio
        </p>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th
                onClick={() => handleSort("name")}
                className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  Fund Name
                  {sortBy === "name" && (sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Type
              </th>
              <th
                onClick={() => handleSort("value")}
                className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  Value
                  {sortBy === "value" && (sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                </div>
              </th>
              <th
                onClick={() => handleSort("xirr")}
                className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  XIRR
                  {sortBy === "xirr" && (sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedFunds.map((fund, index) => {
              const ratingConfig = getRatingConfig(fund.rating);
              const RatingIcon = ratingConfig.icon;
              
              return (
                <motion.tr
                  key={`${fund.folio}-${fund.name}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className={`hover:bg-slate-50 transition-colors ${
                    fund.plan_type === "Regular" ? "bg-amber-50/50" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm font-medium text-slate-900 truncate" title={fund.name}>
                        {fund.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{fund.amc}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      fund.category === "Equity"
                        ? "bg-primary/10 text-primary"
                        : fund.category === "Debt"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {fund.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      fund.plan_type === "Direct"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {fund.plan_type === "Direct" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      {fund.plan_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      ₹{formatCurrency(fund.value)}
                    </p>
                    {fund.plan_type === "Regular" && fund.annual_commission_loss > 0 && (
                      <p className="text-xs text-red-500">
                        -₹{formatCurrency(fund.annual_commission_loss)}/yr
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {fund.xirr !== null ? (
                      <div className="flex items-center justify-end gap-1">
                        <span className={`text-sm font-semibold ${
                          fund.xirr >= 0 ? "text-emerald-600" : "text-red-600"
                        }`}>
                          {fund.xirr >= 0 ? "+" : ""}{fund.xirr.toFixed(1)}%
                        </span>
                        {fund.xirr >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">{fund.xirr_status}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${ratingConfig.bg} ${ratingConfig.color} border ${ratingConfig.border}`}>
                        <RatingIcon className="w-3.5 h-3.5" />
                        {fund.rating}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-slate-100">
        {sortedFunds.map((fund, index) => {
          const ratingConfig = getRatingConfig(fund.rating);
          const RatingIcon = ratingConfig.icon;
          const isExpanded = expandedFund === `${fund.folio}-${fund.name}`;
          
          return (
            <motion.div
              key={`${fund.folio}-${fund.name}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className={`p-4 ${fund.plan_type === "Regular" ? "bg-amber-50/50" : ""}`}
            >
              <div
                onClick={() => setExpandedFund(isExpanded ? null : `${fund.folio}-${fund.name}`)}
                className="cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-slate-900 truncate">{fund.name}</p>
                    <p className="text-xs text-slate-500">{fund.amc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">₹{formatCurrency(fund.value)}</p>
                    {fund.xirr !== null && (
                      <p className={`text-xs font-medium ${fund.xirr >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {fund.xirr >= 0 ? "+" : ""}{fund.xirr.toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    fund.category === "Equity"
                      ? "bg-primary/10 text-primary"
                      : fund.category === "Debt"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {fund.category}
                  </span>
                  
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    fund.plan_type === "Direct"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {fund.plan_type === "Direct" ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {fund.plan_type}
                  </span>
                  
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${ratingConfig.bg} ${ratingConfig.color}`}>
                    <RatingIcon className="w-3 h-3" />
                    {fund.rating}
                  </span>
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 border-t border-slate-200 space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Invested</span>
                      <span className="font-medium text-slate-900">₹{formatCurrency(fund.invested)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Folio</span>
                      <span className="font-medium text-slate-900">{fund.folio}</span>
                    </div>
                    {fund.plan_type === "Regular" && fund.annual_commission_loss > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-red-500">Annual Loss</span>
                        <span className="font-medium text-red-600">₹{formatCurrency(fund.annual_commission_loss)}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
