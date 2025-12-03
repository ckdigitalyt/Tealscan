"use client";

import { motion } from "framer-motion";
import { TrendingUp, Shield, FileText, Zap, BarChart3, Lock } from "lucide-react";

interface Card {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

const cards: Card[] = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "100% Privacy",
    description: "Your data never leaves your browser. All analysis happens locally.",
    gradient: "from-teal-500/10 to-teal-600/5",
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Instant Analysis",
    description: "Upload your CAS PDF and get complete portfolio insights in seconds.",
    gradient: "from-blue-500/10 to-blue-600/5",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "True XIRR Returns",
    description: "Calculate actual returns accounting for all cash flows and timing.",
    gradient: "from-emerald-500/10 to-emerald-600/5",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Hidden Cost Detection",
    description: "Identify Regular vs Direct plans and save thousands in commissions.",
    gradient: "from-amber-500/10 to-amber-600/5",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Portfolio Health Score",
    description: "Get a complete assessment of your portfolio diversification.",
    gradient: "from-purple-500/10 to-purple-600/5",
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Tax Optimization",
    description: "Actionable insights for tax-aware rebalancing and harvesting.",
    gradient: "from-rose-500/10 to-rose-600/5",
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

export default function AnimatedCardsSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need for <span className="text-teal-600">Smart Investing</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced portfolio analysis powered by privacy-first technology. All the insights, none of the risk.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`group relative rounded-2xl border border-gray-200 p-8 bg-gradient-to-br ${card.gradient} backdrop-blur-sm overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300`}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon container with animation */}
                <motion.div
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white mb-6 group-hover:shadow-lg transition-shadow duration-300"
                  whileHover={{ rotate: 6, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {card.icon}
                </motion.div>

                {/* Text content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{card.description}</p>

                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-teal-600"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            Start analyzing your portfolio in seconds. No signup required.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-teal-500/30 transition-all duration-300"
          >
            Analyze Your Portfolio Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
