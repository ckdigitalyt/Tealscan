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
      pageLog.debug('Getting backend domain...');
      const domain = process.env.NEXT_PUBLIC_DOMAIN || window.location.origin;
      const backendUrl = `${domain.includes('localhost') || domain.includes('127.0.0.1') ? 'http://localhost:8000' : domain.replace(/https?:\/\//, 'https://').split(':')[0] + ':8000'}/api/scan`;
      pageLog.debug('Backend URL:', { backendUrl });

      pageLog.debug('Creating FormData...');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('password', password);
      
      pageLog.info('Sending request to backend...');
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
      });

      pageLog.debug('Response received', { status: response.status, statusText: response.statusText });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.detail || `Server error: ${response.statusText}`;
        pageLog.error('Backend error response', { status: response.status, detail: errorMessage });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      pageLog.info('Backend response received successfully', { 
        fundsCount: data.funds_count,
        netWorth: data.net_worth,
        totalInvested: data.total_invested
      });

      pageLog.info('=== handleScan completed successfully ===');
      pageLog.debug('Setting state with data', { fundsCount: data.funds_count });
      setState({ isLoading: false, error: null, data });
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
