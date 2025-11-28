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
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-teal shadow-lg">
              <Scan className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900">TealScan</span>
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-accent/10 text-primary rounded-full">
                <Sparkles className="w-3 h-3" />
                Beta v1.0
              </span>
            </div>
          </div>
          
          {showReset && onReset && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onReset}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              Scan Another File
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
