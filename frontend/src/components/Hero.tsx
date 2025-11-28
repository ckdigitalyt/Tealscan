"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Award } from "lucide-react";
import UploadCard from "./UploadCard";

interface HeroProps {
  onScan: (file: File, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function Hero({ onScan, isLoading, error }: HeroProps) {
  return (
    <section className="min-h-screen pt-24 pb-12 px-4 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Shield className="w-4 h-4" />
              Trusted by 10,000+ Investors
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              The Truth About
              <br />
              <span className="gradient-text">Your Wealth</span>
              <br />
              Totally Naked
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Hidden commissions eat{" "}
              <span className="font-semibold text-red-500">40% of your corpus</span>.
              Audit your mutual fund portfolio in 30 seconds.
            </p>

            <div className="flex flex-wrap gap-6 justify-center lg:justify-start mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-slate-900">100 Cr+</p>
                  <p className="text-xs text-slate-500">Assets Analyzed</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-slate-900">5 Lac+</p>
                  <p className="text-xs text-slate-500">Scans Completed</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <UploadCard onScan={onScan} isLoading={isLoading} error={error} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
