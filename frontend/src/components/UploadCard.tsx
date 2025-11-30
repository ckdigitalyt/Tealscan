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
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      <div className="glass-card bg-dark-card rounded-3xl p-8 shadow-card hover-lift border border-white/10">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/30 mb-3">
            <span className="text-lg">🔒</span>
            <span className="text-xs font-medium text-neon-green">Secure Mode: Processed Locally</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Upload CAS Statement</h3>
          <p className="text-sm text-gray-300 mt-1">
            Data stays on your device. No files uploaded to servers.
          </p>
        </motion.div>

        <motion.div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            backgroundColor: isDragOver ? "rgba(0, 255, 148, 0.05)" : "transparent",
            borderColor: isDragOver ? "#00FF94" : file ? "#00FF94" : "rgba(255, 255, 255, 0.2)",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`relative border-2 border-dashed rounded-2xl p-6 cursor-pointer`}
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center"
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <FileText className="w-5 h-5 text-neon-green" />
                  </motion.div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white truncate max-w-[180px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4 text-slate-400" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="upload-prompt"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <motion.div 
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-green to-accent mx-auto flex items-center justify-center mb-3"
                  animate={{ y: isDragOver ? -2 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Upload className="w-6 h-6 text-dark-bg" />
                </motion.div>
                <p className="text-sm font-medium text-white">
                  Drop your PDF here or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Only PDF files accepted
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-200 mb-2">
            PDF Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter CAS password"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-neon-green focus:ring-2 focus:ring-neon-green/20 outline-none transition-all text-sm"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Usually your PAN (lowercase) + DOB (DDMMYYYY). E.g., abcde1234f12121990
          </p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-neon-orange">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={handleSubmit}
          disabled={!file || !password || isLoading}
          whileHover={file && password && !isLoading ? { scale: 1.03 } : {}}
          whileTap={file && password && !isLoading ? { scale: 0.97 } : {}}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`
            w-full mt-6 py-3.5 rounded-xl font-semibold text-dark-bg flex items-center justify-center gap-2
            transition-all duration-300
            ${
              file && password && !isLoading
                ? "bg-gradient-to-r from-neon-green to-accent shadow-lg shadow-neon-green/30 hover:shadow-xl hover:shadow-neon-green/40 cursor-pointer"
                : "bg-gray-600 cursor-not-allowed opacity-60"
            }
          `}
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-5 h-5" />
              </motion.div>
              Analyzing Portfolio...
            </>
          ) : (
            <>
              Run Audit
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Rocket className="w-5 h-5" />
              </motion.div>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
