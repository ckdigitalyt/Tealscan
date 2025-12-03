"use client";

import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { FadeInSection, StaggerContainer, StaggerItem } from "./animations";

const testimonials = [
  {
    name: "Rajesh Kumar",
    title: "Software Engineer",
    avatar: "🧑‍💼",
    text: "Found out I was losing ₹47,000 annually to regular plans. Switched to direct plans in 2 hours thanks to this tool.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    title: "Business Owner",
    avatar: "👩‍💼",
    text: "The overlap detector showed I had Reliance in 4 different funds. This platform helped me consolidate and reduce risk.",
    rating: 5,
  },
  {
    name: "Amit Verma",
    title: "Freelancer",
    avatar: "👨‍💻",
    text: "Love the tax-aware switching logic. It helped me optimize my portfolio without triggering unnecessary capital gains.",
    rating: 5,
  },
  {
    name: "Neha Gupta",
    title: "Finance Professional",
    avatar: "💼",
    text: "The privacy aspect is impressive—no files uploaded, everything processed locally. Finally a tool I trust with my data.",
    rating: 5,
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % testimonials.length);
  const prev = () =>
    setCurrent((current - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 px-4 bg-dark-bg relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        <FadeInSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trusted by Smart Investors
          </h2>
          <p className="text-gray-400 text-lg">
            Join 10,000+ investors who've optimized their portfolios
          </p>
        </FadeInSection>

        <div className="relative max-w-4xl mx-auto">
          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, i) => (
              <StaggerItem key={testimonial.name}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className={`glass-card rounded-xl p-8 border border-white/10 h-full ${
                    i === current ? "ring-2 ring-neon-green" : ""
                  }`}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: j * 0.1 }}
                      >
                        <Star className="w-5 h-5 fill-neon-green text-neon-green" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-12">
            {testimonials.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current
                    ? "bg-neon-green w-8"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
