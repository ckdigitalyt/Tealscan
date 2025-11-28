"use client";

import { motion } from "framer-motion";
import { FundData } from "@/types";
import { TrendingUp, TrendingDown, Zap, Activity, AlertCircle } from "lucide-react";

interface PortfolioPerformanceProps {
  funds: FundData[];
}

function getRatingDetails(rating: string) {
  switch (rating) {
    case "In-Form":
      return {
        icon: Zap,
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
        badgeColor: "bg-emerald-100",
      };
    case "On-Track":
      return {
        icon: Activity,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        badgeColor: "bg-blue-100",
      };
    case "Off-Track":
      return {
        icon: TrendingDown,
        color: "from-amber-500 to-orange-500",
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        badgeColor: "bg-amber-100",
      };
    case "Out-of-Form":
      return {
        icon: AlertCircle,
        color: "from-red-500 to-pink-500",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        badgeColor: "bg-red-100",
      };
    default:
      return {
        icon: TrendingUp,
        color: "from-slate-500 to-slate-600",
        bgColor: "bg-slate-50",
        textColor: "text-slate-700",
        badgeColor: "bg-slate-100",
      };
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function PortfolioPerformance({ funds }: PortfolioPerformanceProps) {
  const inFormFunds = funds.filter((f) => f.rating === "In-Form");
  const onTrackFunds = funds.filter((f) => f.rating === "On-Track");
  const offTrackFunds = funds.filter((f) => f.rating === "Off-Track");
  const outOfFormFunds = funds.filter((f) => f.rating === "Out-of-Form");

  const categories = [
    { title: "In-Form", funds: inFormFunds, icon: Zap, color: "emerald" },
    { title: "On-Track", funds: onTrackFunds, icon: Activity, color: "blue" },
    { title: "Off-Track", funds: offTrackFunds, icon: TrendingDown, color: "amber" },
    { title: "Out-of-Form", funds: outOfFormFunds, icon: AlertCircle, color: "red" },
  ];

  return (
    <section className="py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Portfolio Performance</h2>
        <p className="text-slate-600">
          See what's <span className="font-semibold text-emerald-600">in-form</span> & what's{" "}
          <span className="font-semibold text-red-600">out-of-form</span> in your portfolio.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => {
          if (category.funds.length === 0) return null;

          const IconComponent = category.icon;
          const colorMap: Record<string, string> = {
            emerald: "from-emerald-500 to-teal-500",
            blue: "from-blue-500 to-cyan-500",
            amber: "from-amber-500 to-orange-500",
            red: "from-red-500 to-pink-500",
          };

          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorMap[category.color]} flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{category.title}</h3>
                    <p className="text-xs text-slate-500">{category.funds.length} fund{category.funds.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {category.funds.map((fund, index) => {
                    const details = getRatingDetails(fund.rating);
                    const DetailIcon = details.icon;

                    return (
                      <motion.div
                        key={`${fund.folio}-${fund.name}`}
                        variants={cardVariants}
                        whileHover="hover"
                        className={`${details.bgColor} rounded-2xl p-4 border-2 border-transparent hover:border-current transition-all cursor-default group`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-slate-900 transition-colors">
                              {fund.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${details.badgeColor} ${details.textColor}`}>
                                {fund.plan_type}
                              </span>
                              <span className="text-xs text-slate-500">{fund.amc}</span>
                            </div>
                          </div>

                          <motion.div
                            className={`flex flex-col items-end gap-1 ${details.textColor} font-bold`}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {fund.xirr !== null ? (
                              <>
                                <span className="text-sm">{fund.xirr.toFixed(1)}%</span>
                                <DetailIcon className="w-4 h-4" />
                              </>
                            ) : (
                              <span className="text-xs">{fund.xirr_status}</span>
                            )}
                          </motion.div>
                        </div>

                        {/* Performance bar */}
                        <motion.div
                          className="mt-3 h-2 bg-white/40 rounded-full overflow-hidden"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.2 + index * 0.05, duration: 0.6 }}
                          style={{ originX: 0 }}
                        >
                          <motion.div
                            className={`h-full bg-gradient-to-r ${details.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (fund.xirr ?? 0) * 5 + 50)}%` }}
                            transition={{ delay: 0.3 + index * 0.05, duration: 0.8, ease: "easeOut" }}
                          />
                        </motion.div>

                        {/* Value info */}
                        <div className="flex justify-between items-center mt-2 text-xs text-slate-600">
                          <span>₹{(fund.value / 100000).toFixed(2)}L</span>
                          <span>{((fund.value / (funds.reduce((a, b) => a + b.value, 0) || 1)) * 100).toFixed(1)}% portfolio</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {categories.map((category) => {
          if (category.funds.length === 0) return null;
          const colorMap: Record<string, { bg: string; text: string }> = {
            emerald: { bg: "bg-emerald-50", text: "text-emerald-700" },
            blue: { bg: "bg-blue-50", text: "text-blue-700" },
            amber: { bg: "bg-amber-50", text: "text-amber-700" },
            red: { bg: "bg-red-50", text: "text-red-700" },
          };

          return (
            <motion.div
              key={`stat-${category.title}`}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`${colorMap[category.color].bg} rounded-xl p-4 text-center cursor-default`}
            >
              <p className={`text-2xl font-bold ${colorMap[category.color].text}`}>
                {category.funds.length}
              </p>
              <p className="text-xs text-slate-600 font-medium">{category.title}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
