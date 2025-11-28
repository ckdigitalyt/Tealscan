"use client";

import { motion } from "framer-motion";
import { Zap, Activity, TrendingDown, AlertCircle } from "lucide-react";

const demoFunds = {
  inForm: [
    { name: "ICICI Prudential Focused Equity Fund", xirr: 24.5, value: 15 },
    { name: "Axis Midcap Fund Direct Plan", xirr: 22.1, value: 12 },
  ],
  onTrack: [
    { name: "HDFC Balanced Advantage Fund", xirr: 15.8, value: 18 },
    { name: "SBI Liquid Fund Direct", xirr: 14.2, value: 8 },
  ],
  offTrack: [
    { name: "Franklin India Focused Equity", xirr: 8.5, value: 10 },
  ],
  outOfForm: [
    { name: "Motilal Oswal Multicap Fund", xirr: -2.3, value: 7 },
  ],
};

const categories = [
  { title: "In-Form", funds: demoFunds.inForm, icon: Zap, color: "emerald" },
  { title: "On-Track", funds: demoFunds.onTrack, icon: Activity, color: "blue" },
  { title: "Off-Track", funds: demoFunds.offTrack, icon: TrendingDown, color: "amber" },
  { title: "Out-of-Form", funds: demoFunds.outOfForm, icon: AlertCircle, color: "red" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
};

export default function PerformancePreview() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-accent/5 to-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            See Your Portfolio Performance
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            After scanning your CAS, get an animated breakdown of your funds by performance:
            <br />
            <span className="font-semibold text-emerald-600">in-form</span>,{" "}
            <span className="font-semibold text-blue-600">on-track</span>,{" "}
            <span className="font-semibold text-amber-600">off-track</span>, or{" "}
            <span className="font-semibold text-red-600">out-of-form</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {categories.map((category, catIndex) => {
            const IconComponent = category.icon;
            const colorMap: Record<string, string> = {
              emerald: "from-emerald-500 to-teal-500",
              blue: "from-blue-500 to-cyan-500",
              amber: "from-amber-500 to-orange-500",
              red: "from-red-500 to-pink-500",
            };

            const bgColorMap: Record<string, string> = {
              emerald: "bg-emerald-50",
              blue: "bg-blue-50",
              amber: "bg-amber-50",
              red: "bg-red-50",
            };

            const badgeColorMap: Record<string, string> = {
              emerald: "bg-emerald-100 text-emerald-700",
              blue: "bg-blue-100 text-blue-700",
              amber: "bg-amber-100 text-amber-700",
              red: "bg-red-100 text-red-700",
            };

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: catIndex * 0.1, ease: [0.16, 1, 0.3, 1] }}
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
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-3"
                  >
                    {category.funds.map((fund, index) => (
                      <motion.div
                        key={fund.name}
                        variants={cardVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className={`${bgColorMap[category.color]} rounded-2xl p-4 border-2 border-transparent hover:border-current transition-all cursor-default group`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-slate-900 transition-colors">
                              {fund.name}
                            </p>
                            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${badgeColorMap[category.color]} mt-1`}>
                              Direct Plan
                            </span>
                          </div>

                          <motion.div
                            className={`flex flex-col items-end gap-1 font-bold`}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            <span className={`text-sm ${badgeColorMap[category.color].split(" ")[1]}`}>
                              {fund.xirr.toFixed(1)}%
                            </span>
                            <IconComponent className={`w-4 h-4 ${badgeColorMap[category.color].split(" ")[1]}`} />
                          </motion.div>
                        </div>

                        {/* Animated performance bar */}
                        <motion.div
                          className="mt-3 h-2 bg-white/40 rounded-full overflow-hidden"
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + index * 0.05, duration: 0.6 }}
                          style={{ originX: 0 }}
                        >
                          <motion.div
                            className={`h-full bg-gradient-to-r ${colorMap[category.color]}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.min(100, (fund.xirr) * 3 + 50)}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + index * 0.05, duration: 0.8, ease: "easeOut" }}
                          />
                        </motion.div>

                        <div className="flex justify-between items-center mt-2 text-xs text-slate-600">
                          <span>₹{fund.value}L</span>
                          <span>{Math.round((fund.value / 70) * 100)}% portfolio</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 text-center"
        >
          <p className="text-slate-700 font-medium">
            💡 This is a demo. Upload your CAS statement to see your actual portfolio performance with smooth animations!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
