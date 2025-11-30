"use client";

import { motion } from "framer-motion";
import { Scan, Sparkles } from "lucide-react";

interface NavbarProps {
  onReset?: () => void;
  showReset?: boolean;
}

export default function Navbar({ onReset, showReset }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-lg border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green to-accent shadow-lg shadow-neon-green/30">
              <Scan className="w-5 h-5 text-dark-bg" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Wealth Health Check</span>
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-neon-green/10 text-neon-green rounded-full">
                <Sparkles className="w-3 h-3" />
                Beta
              </span>
            </div>
          </div>
          
          {showReset && onReset && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onReset}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-neon-green transition-colors"
            >
              ← Back
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
