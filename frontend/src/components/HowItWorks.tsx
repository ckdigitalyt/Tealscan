"use client";

import { motion } from "framer-motion";
import { CloudUpload, Zap, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: CloudUpload,
    title: "Upload Your Statement",
    description: "CAMS/Karvy PDF, Excel, or CSV. 100% local processing.",
    number: "01",
  },
  {
    icon: Zap,
    title: "AI Analyzes in Seconds",
    description: "Advanced calculations run right in your browser.",
    number: "02",
  },
  {
    icon: BarChart3,
    title: "Get Recommendations",
    description: "Actionable insights to optimize your portfolio.",
    number: "03",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-dark-card/50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-neon-green/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Simple, fast, and transparent. Three steps to portfolio insights.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <div className="relative">
                  {/* Number Badge */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-green to-accent shadow-lg shadow-neon-green/30 mb-6">
                    <span className="text-2xl font-bold text-dark-bg">
                      {step.number}
                    </span>
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="glass-card rounded-xl p-8 border border-white/10 h-full"
                  >
                    <Icon className="w-12 h-12 text-neon-green mb-4" />
                    <h3 className="text-xl font-bold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>

                  {/* Arrow */}
                  {i < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="hidden md:flex absolute -right-4 top-1/3 z-10"
                    >
                      <ArrowRight className="w-8 h-8 text-neon-green/50" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-300 mb-6">
            Ready to get started? Upload your portfolio in seconds.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-neon-green to-accent text-dark-bg font-bold rounded-xl shadow-lg shadow-neon-green/30 hover:shadow-neon-green/50 transition-all"
          >
            Start Free Analysis
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
