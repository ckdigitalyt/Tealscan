"use client";

import { motion } from "framer-motion";
import { TrendingDown, Copy, AlertTriangle, TrendingUp } from "lucide-react";

const problems = [
  {
    icon: TrendingDown,
    title: "Hidden Expense Ratios",
    description: "Are you paying 2.5% when you could pay 0.5%?",
    stat: "₹50,000+/year in hidden fees",
    color: "neon-orange",
  },
  {
    icon: Copy,
    title: "Overlapping Holdings",
    description: "Own the same stock 5 times across different funds?",
    stat: "Reduce concentration risk",
    color: "neon-green",
  },
  {
    icon: AlertTriangle,
    title: "Tax Inefficient Switches",
    description: "Triggering unnecessary LTCG tax on rebalancing?",
    stat: "Save up to ₹1,00,000 annually",
    color: "primary",
  },
  {
    icon: TrendingUp,
    title: "Underperforming Funds",
    description: "Beating inflation or losing to it?",
    stat: "Optimize for better returns",
    color: "accent",
  },
];

export default function ProblemSolution() {
  return (
    <section className="py-24 px-4 bg-dark-bg relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Problems Investors Face
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Most investors don't realize they're losing thousands to hidden charges, overlaps, and inefficient decisions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, i) => {
            const Icon = problem.icon;
            const colorClass =
              problem.color === "neon-green"
                ? "from-neon-green/10 to-neon-green/5"
                : problem.color === "neon-orange"
                  ? "from-neon-orange/10 to-neon-orange/5"
                  : problem.color === "primary"
                    ? "from-primary/10 to-primary/5"
                    : "from-accent/10 to-accent/5";

            return (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={`glass-card rounded-xl p-6 border border-white/10 hover:border-neon-green/30 bg-gradient-to-br ${colorClass}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Icon className={`w-8 h-8 ${
                      problem.color === "neon-green"
                        ? "text-neon-green"
                        : problem.color === "neon-orange"
                          ? "text-neon-orange"
                          : problem.color === "primary"
                            ? "text-primary"
                            : "text-accent"
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-4">
                      {problem.description}
                    </p>
                    <div className={`text-sm font-semibold ${
                      problem.color === "neon-green"
                        ? "text-neon-green"
                        : problem.color === "neon-orange"
                          ? "text-neon-orange"
                          : problem.color === "primary"
                            ? "text-primary"
                            : "text-accent"
                    }`}>
                      {problem.stat}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
