'use client';

import { motion, useScroll } from 'framer-motion';

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'linear-gradient(90deg, #00FF94 0%, #2DD4BF 50%, #00FF94 100%)',
        transformOrigin: '0%',
        zIndex: 9999
      }}
    />
  );
};
