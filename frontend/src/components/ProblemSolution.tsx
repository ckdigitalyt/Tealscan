"use client";

import { motion } from "framer-motion";
import { TrendingDown, Copy, AlertTriangle, TrendingUp } from "lucide-react";
import { FadeInSection, StaggerContainer, StaggerItem } from "./animations";

const problems = [
  {
    icon: TrendingDown,
    title: "Hidden Expense Ratios",
    description: "Are you paying 2.5% when you could pay 0.5%?",
    stat: "₹50,000+/year in hidden fees",
    color: "red",
  },
  {
    icon: Copy,
    title: "Overlapping Holdings",
    description: "Own the same stock 5 times across different funds?",
    stat: "Reduce concentration risk",
    color: "teal",
  },
  {
    icon: AlertTriangle,
    title: "Tax Inefficient Switches",
    description: "Triggering unnecessary LTCG tax on rebalancing?",
    stat: "Save up to ₹1,00,000 annually",
    color: "amber",
  },
  {
    icon: TrendingUp,
    title: "Underperforming Funds",
    description: "Beating inflation or losing to it?",
    stat: "Optimize for better returns",
    color: "emerald",
  },
];

export default function ProblemSolution() {
  return (
    <section className="py-24 px-4 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-teal-50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <FadeInSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            The Problems <span className="text-teal-600">Investors Face</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Most investors don't realize they're losing thousands to hidden charges, overlaps, and inefficient decisions.
          </p>
        </FadeInSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem) => {
            const Icon = problem.icon;
            const iconBgColor =
              problem.color === "red"
                ? "bg-red-100"
                : problem.color === "teal"
                  ? "bg-teal-100"
                  : problem.color === "amber"
                    ? "bg-amber-100"
                    : "bg-emerald-100";
            
            const iconTextColor =
              problem.color === "red"
                ? "text-red-600"
                : problem.color === "teal"
                  ? "text-teal-600"
                  : problem.color === "amber"
                    ? "text-amber-600"
                    : "text-emerald-600";

            return (
              <StaggerItem key={problem.title}>
                <motion.div
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(20, 184, 166, 0.15)" }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-teal-300 shadow-sm h-full"
                >
                  <div className={`${iconBgColor} ${iconTextColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {problem.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {problem.description}
                  </p>
                  <div className={`text-sm font-semibold ${iconTextColor}`}>
                    {problem.stat}
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
