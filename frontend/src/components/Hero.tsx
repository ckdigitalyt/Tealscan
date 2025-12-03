"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import EnhancedUploadCard from "./EnhancedUploadCard";

interface HeroProps {
  onScan: (file: File, password: string) => Promise<void>;
  onSampleData: () => Promise<void>;
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
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export default function Hero({ onScan, onSampleData, isLoading, error }: HeroProps) {
  return (
    <section className="min-h-screen pt-24 pb-12 px-4 flex items-center relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-60 pointer-events-none" />
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl animate-pulse opacity-40" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-7xl mx-auto w-full relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-6 border border-teal-200"
            >
              <Shield className="w-4 h-4" />
              Open Source Logic - Client-Side Privacy
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            >
              Stop Losing{" "}
              <span className="text-teal-600">₹75K</span>
              <br />
              to Hidden Charges
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              The world's first privacy-first portfolio analyzer.{" "}
              <span className="font-semibold text-teal-600">Your data never leaves your browser.</span>
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm border border-teal-200">
                ✓ 100% Privacy Guaranteed
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm border border-teal-200">
                ✓ Your Data Never Uploaded
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm border border-teal-200">
                ✓ Tax-Aware Logic
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
            className="flex justify-center lg:justify-end"
          >
            <EnhancedUploadCard onScan={onScan} onSampleData={onSampleData} isLoading={isLoading} error={error} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
