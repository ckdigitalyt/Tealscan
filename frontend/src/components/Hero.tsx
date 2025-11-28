"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Award } from "lucide-react";
import UploadCard from "./UploadCard";

interface HeroProps {
  onScan: (file: File, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Hero({ onScan, isLoading, error }: HeroProps) {
  return (
    <section className="min-h-screen pt-24 pb-12 px-4 flex items-center relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse opacity-50" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 hover:bg-primary/20 cursor-pointer transition-colors"
            >
              <Shield className="w-4 h-4" />
              Trusted by 10,000+ Investors
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6"
            >
              The Truth About
              <br />
              <span className="gradient-text">Your Wealth</span>
              <br />
              Totally Naked
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Hidden commissions eat{" "}
              <span className="font-semibold text-red-500">40% of your corpus</span>.
              Audit your mutual fund portfolio in 30 seconds.
            </motion.p>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-6 justify-center lg:justify-start mb-8"
            >
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 hover-lift group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-slate-900">100 Cr+</p>
                  <p className="text-xs text-slate-500">Assets Analyzed</p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 hover-lift group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-slate-900">5 Lac+</p>
                  <p className="text-xs text-slate-500">Scans Completed</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <UploadCard onScan={onScan} isLoading={isLoading} error={error} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
