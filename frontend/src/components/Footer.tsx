"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Lock } from "lucide-react";

export default function Footer() {
  const links = [
    {
      title: "Product",
      items: ["Features", "Pricing", "Security", "Changelog"],
    },
    {
      title: "Resources",
      items: ["Blog", "Documentation", "FAQ", "Contact"],
    },
    {
      title: "Company",
      items: ["About", "Team", "Privacy Policy", "Terms of Service"],
    },
  ];

  return (
    <footer className="bg-dark-bg border-t border-white/10 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green to-accent shadow-lg shadow-neon-green/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-dark-bg" />
              </div>
              <span className="text-lg font-bold text-white">
                Wealth Health Check
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Privacy-first portfolio analyzer. Your data never leaves your browser.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Linkedin, href: "#" },
                { Icon: Github, href: "#" },
                { Icon: Mail, href: "mailto:hello@wealthcheck.io" },
              ].map(({ Icon }, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, color: "#00FF94" }}
                  className="text-gray-400 hover:text-neon-green transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {links.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
            >
              <h3 className="text-sm font-semibold text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-neon-green transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2025 Wealth Health Check. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 text-center md:text-right mt-4 md:mt-0 max-w-md">
            Disclaimer: For informational purposes only. Not investment advice. Consult professionals before making financial decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
