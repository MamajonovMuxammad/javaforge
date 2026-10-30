"use client";

import React, { useState, useRef, useCallback } from "react";

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
  scale?: number;
  onClick?: () => void;
}

export function Tilt3DCard({
  children,
  className = "",
  glowColor = "rgba(251, 146, 60, 0.25)",
  maxTilt = 8,
  scale = 1.015,
  onClick,
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (rotateX is inverted for natural tilt)
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTransformStyle(
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
      );

      // Specular glare effect moving with cursor
      setGlareStyle({
        opacity: 0.18,
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 80%)`,
      });
    },
    [maxTilt, scale]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlareStyle({ opacity: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: isHovered
          ? "transform 0.08s ease-out, box-shadow 0.2s ease-out"
          : "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease-out",
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900/70 p-5 shadow-lg backdrop-blur-md transition-shadow hover:border-white/20 hover:shadow-2xl ${className}`}
    >
      {/* Specular glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={glareStyle}
      />

      {/* Subtle ambient border glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at 50% 0%, ${glowColor}, transparent 70%)`,
        }}
      />

      {/* Content wrapper with stereoscopic depth */}
      <div className="relative z-20 h-full flex flex-col [transform:translateZ(18px)]">
        {children}
      </div>
    </div>
  );
}

