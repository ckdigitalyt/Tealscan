"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  TrendingUp,
  Leaf,
  BarChart3,
  Target,
  Search,
  Clock,
} from "lucide-react";
import { FadeInSection, StaggerContainer, StaggerItem } from "./animations";

const features = [
  {
    icon: Zap,
    title: "Portfolio X-Ray",
    description: "Deep dive analysis of your complete portfolio composition",
  },
  {
    icon: Shield,
    title: "Expense Optimizer",
    description: "Find hidden fees and calculate exact switching benefits",
  },
  {
    icon: Search,
    title: "Overlap Detector",
    description: "Identify duplicate holdings and concentration risks",
  },
  {
    icon: Leaf,
    title: "Tax-Loss Harvesting",
    description: "Maximize LTCG benefits and minimize tax liabilities",
  },
  {
    icon: BarChart3,
    title: "Performance Benchmark",
    description: "Compare your funds against category and index benchmarks",
  },
  {
    icon: Target,
    title: "Goal-Based Rebalancing",
    description: "Optimize allocation to reach your financial goals",
  },
  {
    icon: TrendingUp,
    title: "Fund Recommendations",
    description: "AI-powered suggestions for better alternatives",
  },
  {
    icon: Clock,
    title: "SIP Optimizer",
    description: "Optimal monthly investment distribution strategy",
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto">
        <FadeInSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful <span className="text-teal-600">Features</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Everything you need to master your mutual fund investments
          </p>
        </FadeInSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.08}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title}>
                <motion.div
                  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(20, 184, 166, 0.15)" }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-teal-300 group cursor-pointer h-full shadow-sm"
                >
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-teal-100 group-hover:bg-teal-600 transition-all">
                    <Icon className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
