"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import LandingPage from "@/components/LandingPage";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import { ScanResponse, UploadState } from "@/types";

export default function Home() {
  const [view, setView] = useState<"landing" | "app">("landing");
  const [state, setState] = useState<UploadState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const handleScan = async (file: File, password: string) => {
    setState({ isLoading: true, error: null, data: null });

    try {
      const { parseCASFile } = await import("@/lib/pdfParser");
      const parsed = await parseCASFile(file, password);
      
      // Transform parsed data to ScanResponse format
      const mockData: ScanResponse = {
        net_worth: parsed.totalValue,
        total_invested: parsed.totalInvested,
        total_gain: parsed.totalValue - parsed.totalInvested,
        total_gain_percent: parsed.totalInvested > 0 
          ? ((parsed.totalValue - parsed.totalInvested) / parsed.totalInvested) * 100 
          : 0,
        total_commission_loss: parsed.funds.reduce((sum, f) => 
          sum + (f.planType === 'Regular' ? f.value * 0.01 : 0), 0),
        portfolio_health_score: 75,
        funds_count: parsed.funds.length,
        direct_funds_count: parsed.funds.filter(f => f.planType === 'Direct').length,
        regular_funds_count: parsed.funds.filter(f => f.planType === 'Regular').length,
        asset_allocation: { Equity: 65, Debt: 30, Gold: 5 },
        funds: parsed.funds.map(f => ({
          name: f.name,
          category: 'Equity',
          value: f.value,
          invested: f.invested,
          plan_type: f.planType,
          xirr: null,
          xirr_status: 'Data needed',
          rating: 'On-Track',
          annual_commission_loss: f.planType === 'Regular' ? f.value * 0.01 : 0,
          amc: f.amc,
          folio: f.folio,
        })),
      };

      setState({ isLoading: false, error: null, data: mockData });
    } catch (error) {
      setState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to parse CAS file",
        data: null,
      });
    }
  };

  const handleReset = () => {
    setState({ isLoading: false, error: null, data: null });
    setView("landing");
  };

  const handleStartAudit = () => {
    setView("app");
  };

  return (
    <main className="min-h-screen bg-dark-bg">
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onStartAudit={handleStartAudit} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar onReset={handleReset} showReset={!!state.data} />
            {state.data ? (
              <Dashboard data={state.data} />
            ) : (
              <Hero onScan={handleScan} isLoading={state.isLoading} error={state.error} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
