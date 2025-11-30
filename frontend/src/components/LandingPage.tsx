"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Zap } from "lucide-react";

interface LandingPageProps {
  onStartAudit: () => void;
}

export default function LandingPage({ onStartAudit }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card flex items-center justify-center px-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-4 text-balance">
            Stop Losing Money to{" "}
            <span className="gradient-text">Hidden Commissions</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-lg mx-auto text-balance">
            The only privacy-first portfolio auditor.<br />
            Your data never leaves your device.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 255, 148, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartAudit}
          className="inline-block px-8 py-4 bg-neon-green text-dark-bg font-bold text-lg rounded-xl shadow-lg shadow-neon-green/30 hover:shadow-neon-green/50 transition-all mb-12"
        >
          Audit My Portfolio Now
        </motion.button>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Lock,
              title: "100% Privacy",
              description: "Client-side processing. No files uploaded.",
              color: "neon-green",
            },
            {
              icon: Zap,
              title: "Tax-Aware Logic",
              description: "Considers LTCG impact on switching decisions.",
              color: "primary",
            },
            {
              icon: Shield,
              title: "Overlap Detection",
              description: "Finds hidden concentration risks in your portfolio.",
              color: "accent",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-card rounded-xl p-6 border border-white/10 hover:border-neon-green/30"
            >
              <motion.div
                className={`w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-4 mx-auto`}
                whileHover={{ scale: 1.1 }}
              >
                <feature.icon className={`w-6 h-6 text-${feature.color}`} />
              </motion.div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-gray-500 mt-12"
        >
          Disclaimer: For informational purposes only. Not investment advice. Consult professionals before decisions.
        </motion.p>
      </div>
    </div>
  );
}
