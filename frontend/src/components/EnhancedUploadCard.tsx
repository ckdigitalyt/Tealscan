"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
  HelpCircle,
  CheckCircle2,
  RefreshCw,
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

const LOADING_MESSAGES = [
  "Decrypting your portfolio...",
  "Analyzing fund performance...",
  "Calculating XIRR returns...",
  "Detecting overlaps...",
  "Finding hidden charges...",
  "Generating recommendations...",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  uploadLog.debug('Component rendered', { isLoading, hasError: !!error, hasFile: !!file });

  useEffect(() => {
    if (!isLoading) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isLoading]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateFile = (fileToValidate: File): boolean => {
    setFileError(null);
    
    if (fileToValidate.size > MAX_FILE_SIZE) {
      setFileError("File is too large. Maximum size: 10MB. Try a smaller date range.");
      return false;
    }

    const validTypes = [
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    
    const fileName = fileToValidate.name.toLowerCase();
    const isValidExtension = fileName.endsWith('.pdf') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');
    
    if (!validTypes.includes(fileToValidate.type) && !isValidExtension) {
      setFileError("This doesn't look like a CAMS/Karvy statement. Please upload PDF, Excel, or CSV file.");
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
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
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTryAgain = () => {
    clearFile();
    setFileError(null);
  };

  const displayError = fileError || error;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-100 border border-teal-300 w-fit mx-auto"
        >
          <Lock className="w-4 h-4 text-teal-700" />
          <span className="text-sm font-medium text-teal-700">
            Your data never leaves your browser
          </span>
        </motion.div>

        <motion.div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          animate={{
            backgroundColor: isDragOver
              ? "rgba(20, 184, 166, 0.1)"
              : "rgba(255, 255, 255, 0.9)",
            borderColor: isDragOver
              ? "#14b8a6"
              : file
                ? "#14b8a6"
                : "#e5e7eb",
            scale: isDragOver ? 1.02 : 1,
          }}
          transition={{ duration: 0.3 }}
          className={`bg-white rounded-2xl border-2 border-dashed p-12 transition-all shadow-sm ${
            isLoading ? 'cursor-wait' : 'cursor-pointer hover:border-teal-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.xlsx,.xls,.csv"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4"
              >
                <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full mx-auto mb-4 animate-spin" />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMessageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-teal-700 font-medium text-lg"
                  >
                    {LOADING_MESSAGES[loadingMessageIndex]}
                  </motion.p>
                </AnimatePresence>
                <div className="flex justify-center gap-1 mt-4">
                  {LOADING_MESSAGES.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === loadingMessageIndex ? 'bg-teal-600 w-4' : 'bg-teal-200'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            ) : file ? (
              <motion.div
                key="file-selected"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 font-medium truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
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
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-all"
                >
                  <X className="w-5 h-5 text-red-500" />
                </motion.button>
              </motion.div>
            ) : isDragOver ? (
              <motion.div
                key="drag-over"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <Upload className="w-16 h-16 text-teal-600" />
                </motion.div>
                <p className="text-teal-700 font-bold text-xl">
                  Drop your file here!
                </p>
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
                  <Upload className="w-12 h-12 text-teal-400" />
                </motion.div>
                <p className="text-gray-900 font-semibold mb-2 text-lg">
                  Drag and drop your CAS/Karvy statement
                </p>
                <p className="text-gray-500 mb-4">
                  Supports PDF, Excel (.xlsx, .xls), and CSV files
                </p>
                <div className="inline-block px-4 py-2 bg-teal-100 text-teal-700 text-sm font-medium rounded-lg">
                  Click to browse
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Supported: CAMS/Karvy PDF, Excel (.xlsx), or CSV files (Max 10MB)</p>
          <p className="flex items-center justify-center gap-1">
            <HelpCircle className="w-3 h-3" />
            Where to get this? Login to CAMS/Karvy → Download Consolidated Statement
          </p>
        </div>

        <AnimatePresence>
          {file && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <label className="block text-sm font-medium text-gray-700">
                CAS File Password (if encrypted)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (optional)"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading || !file}
                className="w-full py-4 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 min-h-[52px] bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40"
              >
                <FileUp className="w-5 h-5" />
                Start Analysis
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-lg bg-red-50 border border-red-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-600 mb-3">{displayError}</p>
                  <button
                    onClick={handleTryAgain}
                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid sm:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSampleData}
            disabled={isLoading}
            className="bg-white rounded-xl p-4 border border-gray-200 hover:border-teal-300 transition-all disabled:opacity-50 min-h-[88px] shadow-sm"
          >
            <Zap className="w-5 h-5 text-teal-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Try Sample Data</p>
            <p className="text-xs text-gray-500">See demo portfolio</p>
          </motion.button>

          <motion.button
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            disabled
            className="bg-white rounded-xl p-4 border border-gray-200 opacity-50 cursor-not-allowed min-h-[88px] shadow-sm"
          >
            <FileText className="w-5 h-5 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Manual Entry</p>
            <p className="text-xs text-gray-500">Coming soon</p>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-xl p-4 border border-gray-100"
        >
          <p className="text-xs text-gray-500 text-center">
            We don't store, transmit, or access any of your financial data. All analysis happens locally on your device using open-source logic.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
