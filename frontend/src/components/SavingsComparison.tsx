"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Sparkles } from "lucide-react";

export default function SavingsComparison() {
  return (
    <section className="py-20 px-4 bg-dark-bg">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 text-neon-green text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            The Math Behind Your Savings
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Regular vs Direct Plans
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See how much you could save by switching from Regular to Direct mutual fund plans
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="glass-card rounded-2xl p-8 border border-neon-orange/30 bg-neon-orange/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-orange/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <TrendingDown className="w-8 h-8 text-neon-orange" />
                <h3 className="text-xl font-bold text-white">Regular Plans</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Investment</span>
                  <span className="text-white font-semibold">Rs.10,00,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Expense Ratio</span>
                  <span className="text-neon-orange font-semibold">2.5%</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-4">
                  <span className="text-gray-400">Annual Fees</span>
                  <span className="text-neon-orange font-bold text-xl">Rs.25,000/yr</span>
                </div>
              </div>

              <div className="text-center p-4 bg-neon-orange/10 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">30-Year Cost</p>
                <p className="text-2xl font-bold text-neon-orange">Rs.7,50,000+</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-neon-green/30 bg-neon-green/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-neon-green" />
                <h3 className="text-xl font-bold text-white">Direct Plans</h3>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Investment</span>
                  <span className="text-white font-semibold">Rs.10,00,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Expense Ratio</span>
                  <span className="text-neon-green font-semibold">0.5%</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-4">
                  <span className="text-gray-400">Annual Fees</span>
                  <span className="text-neon-green font-bold text-xl">Rs.5,000/yr</span>
                </div>
              </div>

              <div className="text-center p-4 bg-neon-green/10 rounded-xl">
                <p className="text-sm text-gray-400 mb-1">30-Year Cost</p>
                <p className="text-2xl font-bold text-neon-green">Rs.1,50,000</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 glass-card rounded-2xl p-8 border border-neon-green/50 bg-gradient-to-r from-neon-green/10 to-accent/10 text-center"
        >
          <p className="text-gray-300 mb-2">Your Potential Savings</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div>
              <p className="text-sm text-gray-400">Annual</p>
              <p className="text-3xl font-bold text-neon-green">Rs.20,000</p>
            </div>
            <div className="text-4xl text-gray-600">→</div>
            <div>
              <p className="text-sm text-gray-400">30-Year Impact</p>
              <p className="text-4xl font-bold text-neon-green">Rs.15,00,000+</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">*Based on Rs.10L investment with compound growth</p>
        </motion.div>
      </div>
    </section>
  );
}
