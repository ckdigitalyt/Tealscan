"use client";

import { motion } from "framer-motion";
import { Search, Calculator, HeartPulse } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Commission Hunter",
    description:
      "Instantly detect hidden commissions in Regular plans eating your returns. Switch to Direct and save 1-1.5% annually.",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-50",
  },
  {
    icon: Calculator,
    title: "True XIRR Engine",
    description:
      "Calculate your actual returns using XIRR methodology. No more misleading absolute returns - get the real picture.",
    color: "from-primary to-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: HeartPulse,
    title: "Portfolio Health",
    description:
      "Get a health score for each fund based on performance. Identify underperformers and make informed decisions.",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            X-Ray Your Portfolio
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Powerful analysis tools to uncover the truth about your mutual fund investments
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card rounded-2xl p-6 h-full hover-lift cursor-default">
                <div
                  className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon
                    className={`w-7 h-7 bg-gradient-to-r ${feature.color} bg-clip-text`}
                    style={{
                      color:
                        feature.color === "from-primary to-accent"
                          ? "#0F766E"
                          : feature.color === "from-red-500 to-orange-500"
                          ? "#ef4444"
                          : "#10b981",
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
