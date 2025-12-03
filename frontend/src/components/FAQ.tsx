"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FadeInSection, StaggerContainer, StaggerItem } from "./animations";

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
    <section id="faq" className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <FadeInSection className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-6 border border-teal-200">
            <HelpCircle className="w-4 h-4" />
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-teal-600">Questions</span>
          </h2>
          <p className="text-gray-600">
            Everything you need to know about TealScan
          </p>
        </FadeInSection>

        <StaggerContainer className="space-y-4">
          {faqs.map((faq, index) => (
            <StaggerItem key={index}>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-teal-300 transition-all shadow-sm">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-teal-600" />
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
                    <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
