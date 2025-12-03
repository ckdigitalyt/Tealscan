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
    <div className="relative bg-gray-50 min-h-screen">
      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-teal-100 border border-teal-300 rounded-full backdrop-blur-sm shadow-sm">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Demo Data</span>
          </div>
        </motion.div>
      )}
      <DashboardTabs data={data} />
    </div>
  );
}
