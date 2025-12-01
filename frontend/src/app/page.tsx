"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import EnhancedLandingPage from "@/components/EnhancedLandingPage";
import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import { ScanResponse, UploadState } from "@/types";

const pageLog = {
  info: (msg: string, data?: any) => {
    console.log(`[PAGE] INFO: ${msg}`, data !== undefined ? data : '');
  },
  error: (msg: string, error?: any) => {
    console.error(`[PAGE] ERROR: ${msg}`, error !== undefined ? error : '');
    if (error?.stack) console.error(`[PAGE] Stack:`, error.stack);
  },
  debug: (msg: string, data?: any) => {
    console.log(`[PAGE] DEBUG: ${msg}`, data !== undefined ? data : '');
  }
};

export default function Home() {
  const [view, setView] = useState<"landing" | "app">("landing");
  const [state, setState] = useState<UploadState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const handleScan = async (file: File, password: string) => {
    pageLog.info('=== handleScan started ===');
    pageLog.info('Input details', { 
      fileName: file.name, 
      fileSize: file.size, 
      fileType: file.type,
      passwordLength: password.length 
    });
    
    setState({ isLoading: true, error: null, data: null });
    pageLog.debug('State set to loading');

    try {
      pageLog.debug('Starting simulated progress delay...');
      for (let i = 0; i <= 100; i += 15) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      pageLog.debug('Simulated progress complete');

      pageLog.info('Importing pdfParser module...');
      const { parseCASFile } = await import("@/lib/pdfParser");
      pageLog.info('pdfParser module imported successfully');
      
      pageLog.info('Calling parseCASFile...');
      const parsed = await parseCASFile(file, password);
      pageLog.info('parseCASFile returned successfully', { 
        fundsCount: parsed.funds.length,
        totalValue: parsed.totalValue,
        totalInvested: parsed.totalInvested
      });
      
      pageLog.debug('Transforming parsed data to ScanResponse format...');
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

      pageLog.info('=== handleScan completed successfully ===');
      pageLog.debug('Setting state with data', { fundsCount: mockData.funds_count });
      setState({ isLoading: false, error: null, data: mockData });
    } catch (error: any) {
      pageLog.error('=== handleScan failed ===');
      pageLog.error('Error caught in handleScan', error);
      pageLog.error('Error details', {
        name: error?.name,
        message: error?.message,
        isError: error instanceof Error
      });
      
      const errorMessage = error instanceof Error ? error.message : "Failed to parse CAS file";
      pageLog.info('Setting error state', { errorMessage });
      
      setState({
        isLoading: false,
        error: errorMessage,
        data: null,
      });
    }
  };

  const handleSampleData = async () => {
    setState({ isLoading: true, error: null, data: null });

    try {
      // Simulate processing with progress
      for (let i = 0; i <= 100; i += 15) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const { SAMPLE_PORTFOLIO } = await import("@/lib/sampleData");
      setState({ isLoading: false, error: null, data: SAMPLE_PORTFOLIO as ScanResponse });
    } catch (error) {
      setState({
        isLoading: false,
        error: "Failed to load sample data",
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
            <EnhancedLandingPage onStartAudit={handleStartAudit} />
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
              <Hero onScan={handleScan} onSampleData={handleSampleData} isLoading={state.isLoading} error={state.error} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
