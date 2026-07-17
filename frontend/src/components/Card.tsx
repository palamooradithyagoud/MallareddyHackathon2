import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  glow = false,
  animate = true,
  onClick,
}) => {
  const baseClasses = `glass-panel rounded-2xl p-6 shadow-sm ${glow ? "glow-card" : ""} ${
    onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
  }`;

  if (!animate) {
    return (
      <div onClick={onClick} className={`${baseClasses} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
};
