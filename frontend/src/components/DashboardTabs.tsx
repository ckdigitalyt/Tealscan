"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanResponse } from "@/types";
import { BarChart3, Zap, Search, Leaf, TrendingUp, Lightbulb } from "lucide-react";
import OverviewTab from "./tabs/OverviewTab";
import ExpenseAnalysisTab from "./tabs/ExpenseAnalysisTab";
import OverlapTab from "./tabs/OverlapTab";
import TaxTab from "./tabs/TaxTab";
import PerformanceTab from "./tabs/PerformanceTab";
import RecommendationsTab from "./tabs/RecommendationsTab";

interface DashboardTabsProps {
  data: ScanResponse;
}

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "expense", label: "Expense Analysis", icon: Zap },
  { id: "overlap", label: "Overlap Detection", icon: Search },
  { id: "tax", label: "Tax Optimizer", icon: Leaf },
  { id: "performance", label: "Performance", icon: TrendingUp },
  { id: "recommendations", label: "Recommendations", icon: Lightbulb },
];

export default function DashboardTabs({ data }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab data={data} />;
      case "expense":
        return <ExpenseAnalysisTab data={data} />;
      case "overlap":
        return <OverlapTab data={data} />;
      case "tax":
        return <TaxTab data={data} />;
      case "performance":
        return <PerformanceTab data={data} />;
      case "recommendations":
        return <RecommendationsTab data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex overflow-x-auto gap-2 pb-4 mb-4 scrollbar-hide">
            {tabs.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-neon-green to-accent text-dark-bg shadow-lg shadow-neon-green/30"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 border border-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
