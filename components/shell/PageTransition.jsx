"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

/**
 * PageTransition — subtle enter animation on each route change.
 * Keyed by pathname so navigating re-mounts and re-plays the fade/slide.
 * Enter-only (no exit) to stay robust with the App Router's immediate
 * content swap.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      style={{ minHeight: "100%" }}
    >
      {children}
    </motion.div>
  );
}
