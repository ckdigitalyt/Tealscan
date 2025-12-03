"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Sparkles } from "lucide-react";
import { AnimatedNumber, FadeInSection } from "./animations";

export default function SavingsComparison() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-6 border border-teal-200">
            <Sparkles className="w-4 h-4" />
            The Math Behind Your Savings
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Regular vs <span className="text-teal-600">Direct</span> Plans
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how much you could save by switching from Regular to Direct mutual fund plans
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <FadeInSection direction="left" delay={0.2}>
            <div className="bg-white rounded-2xl p-8 border-2 border-red-200 relative overflow-hidden h-full shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl" />
              <div className="relative">
                <div className="inline-block bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  Regular Plans
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <TrendingDown className="w-8 h-8 text-red-500" />
                  <h3 className="text-xl font-bold text-gray-900">Hidden Costs Add Up</h3>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Investment</span>
                    <span className="text-gray-900 font-semibold">₹<AnimatedNumber value={1000000} /></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Expense Ratio</span>
                    <span className="text-red-600 font-semibold">2.5%</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                    <span className="text-gray-600">Annual Fees</span>
                    <span className="text-red-600 font-bold text-xl">₹<AnimatedNumber value={25000} />/yr</span>
                  </div>
                </div>

                <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-sm text-gray-600 mb-1">30-Year Cost</p>
                  <p className="text-2xl font-bold text-red-600">₹<AnimatedNumber value={750000} />+</p>
                </div>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection direction="right" delay={0.4}>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 border-2 border-teal-300 relative overflow-hidden h-full shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/50 rounded-full blur-3xl" />
              <div className="relative">
                <div className="inline-block bg-teal-600 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                  Direct Plans
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-8 h-8 text-teal-600" />
                  <h3 className="text-xl font-bold text-gray-900">Keep More of Your Returns</h3>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Investment</span>
                    <span className="text-gray-900 font-semibold">₹<AnimatedNumber value={1000000} /></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Expense Ratio</span>
                    <span className="text-teal-700 font-semibold">0.5%</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-teal-200 pt-4">
                    <span className="text-gray-700">Annual Fees</span>
                    <span className="text-teal-700 font-bold text-xl">₹<AnimatedNumber value={5000} />/yr</span>
                  </div>
                </div>

                <div className="text-center p-4 bg-white/70 rounded-xl border border-teal-200">
                  <p className="text-sm text-gray-600 mb-1">30-Year Cost</p>
                  <p className="text-2xl font-bold text-teal-700">₹<AnimatedNumber value={150000} /></p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>

        <FadeInSection delay={0.6} fullWidth>
          <div className="mt-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-8 text-white text-center shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Your Potential Savings</h3>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div>
                <p className="text-sm text-teal-100">Annual</p>
                <p className="text-3xl font-bold">₹<AnimatedNumber value={20000} /></p>
              </div>
              <motion.div 
                className="text-4xl text-teal-200"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
              <div>
                <p className="text-sm text-teal-100">30-Year Impact</p>
                <p className="text-4xl font-bold">₹<AnimatedNumber value={1500000} duration={2500} />+</p>
              </div>
            </div>
            <p className="text-sm text-teal-100 mt-4">*Based on ₹10L investment with compound growth</p>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
