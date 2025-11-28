"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Dashboard from "@/components/Dashboard";
import { ScanResponse, UploadState } from "@/types";

export default function Home() {
  const [state, setState] = useState<UploadState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const handleScan = async (file: File, password: string) => {
    setState({ isLoading: true, error: null, data: null });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to scan portfolio");
      }

      const data: ScanResponse = await response.json();
      setState({ isLoading: false, error: null, data });
    } catch (error) {
      setState({
        isLoading: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        data: null,
      });
    }
  };

  const handleReset = () => {
    setState({ isLoading: false, error: null, data: null });
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar onReset={handleReset} showReset={!!state.data} />
      
      <AnimatePresence mode="wait">
        {state.data ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard data={state.data} />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onScan={handleScan} isLoading={state.isLoading} error={state.error} />
            <Features />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
