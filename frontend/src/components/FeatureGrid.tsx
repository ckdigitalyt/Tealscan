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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function FeatureGrid() {
  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful <span className="text-teal-600">Features</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to master your mutual fund investments
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative rounded-xl border border-gray-200 p-8 bg-white/50 backdrop-blur-sm hover:border-teal-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent" />
                </div>

                <div className="relative z-10">
                  <motion.div
                    className="w-14 h-14 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300"
                    whileHover={{ rotate: 6, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-7 h-7" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>

                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-teal-600"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
