"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Shield } from "lucide-react";

export default function Footer() {
  const links = [
    {
      title: "Product",
      items: [
        { name: "Features", href: "#" },
        { name: "Security", href: "#" },
        { name: "How It Works", href: "#how-it-works" },
      ],
    },
    {
      title: "Legal",
      items: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Disclaimer", href: "#" },
      ],
    },
    {
      title: "Support",
      items: [
        { name: "FAQ", href: "#faq" },
        { name: "Contact", href: "#" },
        { name: "Help Center", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-teal-900 to-teal-800 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-500 shadow-lg shadow-teal-500/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-teal-100">TealScan</span>
            </div>
            <p className="text-sm text-teal-200 mb-2 font-medium">
              Privacy-First Portfolio Analyzer
            </p>
            <p className="text-sm text-teal-300 mb-6">
              Your data never leaves your browser. All analysis happens locally on your device.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
                { Icon: Github, href: "#", label: "GitHub" },
                { Icon: Mail, href: "mailto:hello@tealscan.io", label: "Email" },
              ].map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.1 }}
                  className="text-teal-300 hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {links.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
            >
              <h3 className="text-sm font-semibold text-teal-100 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-teal-200 hover:text-white transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-teal-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-teal-300">
              © 2024 TealScan. All rights reserved.
            </p>
            <p className="text-xs text-teal-400 text-center md:text-right max-w-lg">
              Not financial advice. Please consult a SEBI-registered investment advisor before making any investment decisions. For informational purposes only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
