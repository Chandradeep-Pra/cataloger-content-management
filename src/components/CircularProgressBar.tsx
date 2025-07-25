"use client";

import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";

interface CircularProgressProps {
  value: number;
  size?: number; // e.g. 24, 32, 48
  className?: string;
}

export function CircularProgress({ value, size = 24, className }: CircularProgressProps) {
  return (
    <div
      className={`relative`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <AnimatedCircularProgressBar
        value={value}
        min={0}
        max={100}
        gaugePrimaryColor="rgb(15 23 42)" // Tailwind slate-900
        gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
        className="w-full h-full" // ensures it respects outer `size`
      />
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-slate-800 leading-none">
        {value}%
      </div>
    </div>
  );
}
