"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, display: reduceMotion ? "none" : undefined }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-brand"
      aria-hidden="true"
    />
  );
}
