"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Lock, Rocket, FileText, X, AlertCircle, Loader2 } from "lucide-react";

interface UploadCardProps {
  onScan: (file: File, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function UploadCard({ onScan, isLoading, error }: UploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (file && password) {
      await onScan(file, password);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-md"
    >
      <div className="glass-card rounded-3xl p-8 shadow-card hover-lift">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Upload CAS Statement</h3>
          <p className="text-sm text-slate-500 mt-1">
            Get your Consolidated Account Statement from CAMS/Karvy
          </p>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all duration-300
            ${isDragOver ? "border-primary bg-accent/10" : "border-slate-200 hover:border-primary/50"}
            ${file ? "border-primary bg-accent/5" : ""}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file-selected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-slate-900 truncate max-w-[180px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-teal mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  Drop your PDF here or click to browse
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Only PDF files accepted
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            PDF Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter CAS password"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            Usually your PAN followed by DOB (e.g., ABCDE1234F01011990)
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleSubmit}
          disabled={!file || !password || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full mt-6 py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2
            transition-all duration-300
            ${
              file && password && !isLoading
                ? "bg-gradient-teal shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
                : "bg-slate-300 cursor-not-allowed"
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Portfolio...
            </>
          ) : (
            <>
              Run Audit
              <Rocket className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
