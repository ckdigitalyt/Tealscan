"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Lock,
  FileText,
  X,
  AlertCircle,
  Loader2,
  Zap,
  FileUp,
} from "lucide-react";

const uploadLog = {
  info: (msg: string, data?: any) => {
    console.log(`[UPLOAD-CARD] INFO: ${msg}`, data !== undefined ? data : '');
  },
  error: (msg: string, error?: any) => {
    console.error(`[UPLOAD-CARD] ERROR: ${msg}`, error !== undefined ? error : '');
  },
  debug: (msg: string, data?: any) => {
    console.log(`[UPLOAD-CARD] DEBUG: ${msg}`, data !== undefined ? data : '');
  }
};

interface EnhancedUploadCardProps {
  onScan: (file: File, password: string) => Promise<void>;
  onSampleData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function EnhancedUploadCard({
  onScan,
  onSampleData,
  isLoading,
  error,
}: EnhancedUploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  uploadLog.debug('Component rendered', { isLoading, hasError: !!error, hasFile: !!file });

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
    if (droppedFile) {
      const validTypes = [
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
      if (validTypes.includes(droppedFile.type)) {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    uploadLog.info('handleSubmit called', { hasFile: !!file, passwordLength: password.length });
    if (file) {
      uploadLog.info('Starting scan...', { fileName: file.name, fileSize: file.size, hasPassword: password.length > 0 });
      try {
        await onScan(file, password || '');
        uploadLog.info('onScan completed');
      } catch (err: any) {
        uploadLog.error('onScan threw error', err);
      }
    } else {
      uploadLog.debug('Submit blocked - no file selected');
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="space-y-6">
        {/* Privacy Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-green/10 border border-neon-green/30 w-fit mx-auto"
        >
          <Lock className="w-4 h-4 text-neon-green" />
          <span className="text-sm font-medium text-neon-green">
            🔒 Your data never leaves your browser
          </span>
        </motion.div>

        {/* Main Upload Card */}
        <motion.div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            backgroundColor: isDragOver
              ? "rgba(0, 255, 148, 0.05)"
              : "transparent",
            borderColor: isDragOver
              ? "#00FF94"
              : file
                ? "#00FF94"
                : "rgba(255, 255, 255, 0.2)",
          }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-2xl border-2 border-dashed p-12 cursor-pointer hover:border-neon-green/50 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.xlsx,.xls,.csv"
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
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-neon-green" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="p-2 rounded-lg bg-neon-orange/10 hover:bg-neon-orange/20 transition-all"
                >
                  <X className="w-5 h-5 text-neon-orange" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="no-file"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <Upload className="w-12 h-12 text-neon-green/50" />
                </motion.div>
                <p className="text-white font-semibold mb-2 text-lg">
                  Drag and drop your CAS/Karvy statement
                </p>
                <p className="text-gray-400 mb-4">
                  Supports PDF, Excel (.xlsx, .xls), and CSV files
                </p>
                <div className="inline-block px-4 py-2 bg-neon-green/10 text-neon-green text-sm font-medium rounded-lg">
                  Click to browse
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Password Input (show only if file is selected) */}
        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <label className="block text-sm font-medium text-gray-300">
                CAS File Password (if encrypted)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (optional)"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-neon-green/50 focus:outline-none transition-all"
              />

              {/* Start Analysis Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading || !file}
                className={`w-full py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  isLoading || !file
                    ? "bg-white/10 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-neon-green to-accent text-dark-bg hover:shadow-lg hover:shadow-neon-green/40"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileUp className="w-5 h-5" />
                    Start Analysis
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-3 p-4 rounded-lg bg-neon-orange/10 border border-neon-orange/30"
            >
              <AlertCircle className="w-5 h-5 text-neon-orange flex-shrink-0 mt-0.5" />
              <p className="text-sm text-neon-orange">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alternative Options */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Try Sample Data */}
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSampleData}
            disabled={isLoading}
            className="glass-card rounded-xl p-4 border border-white/10 hover:border-accent/30 transition-all disabled:opacity-50"
          >
            <Zap className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="text-sm font-medium text-white">Try Sample Data</p>
            <p className="text-xs text-gray-400">See demo portfolio</p>
          </motion.button>

          {/* Manual Entry (Placeholder) */}
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            disabled
            className="glass-card rounded-xl p-4 border border-white/10 opacity-50 cursor-not-allowed"
          >
            <FileText className="w-5 h-5 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-white">Manual Entry</p>
            <p className="text-xs text-gray-400">Coming soon</p>
          </motion.button>
        </div>

        {/* Privacy Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-4 border border-white/5 bg-white/[0.02]"
        >
          <p className="text-xs text-gray-400 text-center">
            We don't store, transmit, or access any of your financial data. All analysis happens locally on your device using open-source logic.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
