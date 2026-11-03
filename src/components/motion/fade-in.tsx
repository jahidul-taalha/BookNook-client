"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "cn";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 18,
  once = true,
}: FadeInProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
