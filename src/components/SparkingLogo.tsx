import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface SparkingLogoProps {
  text?: string;
  className?: string;
  isHero?: boolean;
}

export default function SparkingLogo({ text = "Bob Kelin", className = "", isHero = false }: SparkingLogoProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger step to spin the name
  const triggerSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setAnimationKey(prev => prev + 1);
  };

  // Automatically spin once on load after a brief beautiful delay
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerSpin();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // When animation finishes, reset the spinning state to allow subsequent clicks
  const handleAnimationComplete = () => {
    setIsSpinning(false);
  };

  return (
    <div 
      className="relative flex items-center justify-center select-none py-1 px-3"
      style={{ perspective: 1000 }}
    >
      <motion.span
        key={animationKey}
        initial={{ rotateY: 0 }}
        animate={isSpinning ? {
          rotateY: 360, // Elegant 3D y-axis spin
        } : { rotateY: 0 }}
        onAnimationComplete={handleAnimationComplete}
        transition={{ 
          duration: isHero ? 1.6 : 1.2, 
          ease: "easeInOut" 
        }}
        className={`${className} inline-block select-none`}
      >
        {text}
      </motion.span>
    </div>
  );
}
