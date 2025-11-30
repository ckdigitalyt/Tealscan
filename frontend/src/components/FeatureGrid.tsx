"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  TrendingUp,
  Leaf,
  BarChart3,
  Target,
  Search,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Portfolio X-Ray",
    description: "Deep dive analysis of your complete portfolio composition",
  },
  {
    icon: Shield,
    title: "Expense Optimizer",
    description: "Find hidden fees and calculate exact switching benefits",
  },
  {
    icon: Search,
    title: "Overlap Detector",
    description: "Identify duplicate holdings and concentration risks",
  },
  {
    icon: Leaf,
    title: "Tax-Loss Harvesting",
    description: "Maximize LTCG benefits and minimize tax liabilities",
  },
  {
    icon: BarChart3,
    title: "Performance Benchmark",
    description: "Compare your funds against category and index benchmarks",
  },
  {
    icon: Target,
    title: "Goal-Based Rebalancing",
    description: "Optimize allocation to reach your financial goals",
  },
  {
    icon: TrendingUp,
    title: "Fund Recommendations",
    description: "AI-powered suggestions for better alternatives",
  },
  {
    icon: Clock,
    title: "SIP Optimizer",
    description: "Optimal monthly investment distribution strategy",
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-24 px-4 bg-dark-card/50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to master your mutual fund investments
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-xl p-6 border border-white/10 hover:border-neon-green/30 group cursor-pointer"
              >
                <div className="mb-4 inline-flex p-3 rounded-lg bg-neon-green/10 group-hover:bg-neon-green/20 transition-all">
                  <Icon className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
