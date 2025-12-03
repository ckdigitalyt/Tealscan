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
        background: 'linear-gradient(90deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)',
        transformOrigin: '0%',
        zIndex: 9999
      }}
    />
  );
};
