"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Is this really free?",
    answer: "Yes, 100% free. No hidden costs, no premium plans. We believe every investor deserves access to portfolio insights.",
  },
  {
    question: "Is my data safe? Do you store my portfolio information?",
    answer: "Your data never leaves your browser. All PDF parsing and analysis happens client-side in your browser. We never upload, store, or see your portfolio data. Check our Privacy Policy for details.",
  },
  {
    question: "What file formats do you support?",
    answer: "We support CAMS/Karvy consolidated statements in PDF format (with or without password), Excel files (.xlsx), and CSV files.",
  },
  {
    question: "How accurate are the calculations?",
    answer: "We use industry-standard formulas for XIRR, expense ratio calculations, and overlap detection. Our data comes from official AMC disclosures. However, this tool is for informational purposes only - not financial advice.",
  },
  {
    question: "Can I use this for stocks, bonds, or ETFs?",
    answer: "Currently, we only support Indian mutual funds. Stock portfolio analysis is coming soon!",
  },
  {
    question: "What should I do with the recommendations?",
    answer: "Our recommendations are insights, not advice. We suggest consulting a SEBI-registered investment advisor before making any switches or changes to your portfolio.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 bg-dark-bg">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 text-neon-green text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400">
            Everything you need to know about TealScan
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-card rounded-xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-white pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-neon-green" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
