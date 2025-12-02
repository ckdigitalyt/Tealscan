"use client";

import { ScanResponse } from "@/types";
import DashboardTabs from "./DashboardTabs";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface DashboardProps {
  data: ScanResponse;
  isDemoMode?: boolean;
}

export default function Dashboard({ data, isDemoMode = false }: DashboardProps) {
  return (
    <div className="relative">
      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/40 rounded-full backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Demo Data</span>
          </div>
        </motion.div>
      )}
      <DashboardTabs data={data} />
    </div>
  );
}
