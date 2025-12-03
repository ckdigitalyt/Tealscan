'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

export const FadeInSection = ({ 
  children, 
  delay = 0, 
  direction = 'up',
  fullWidth = false,
  className = ''
}: FadeInSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px" 
  });

  const directionOffset = {
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 },
    left: { x: 50, y: 0 },
    right: { x: -50, y: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        x: directionOffset[direction].x,
        y: directionOffset[direction].y
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0 
      } : {
        opacity: 0,
        x: directionOffset[direction].x,
        y: directionOffset[direction].y
      }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};
