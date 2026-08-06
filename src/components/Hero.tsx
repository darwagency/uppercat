"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    // IntersectionObserver to auto-play when visible and pause when out of view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Fallback for browser autoplay restrictions
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black select-none flex flex-col items-center justify-start p-0 m-0"
    >
      {/* Video Container in Original Aspect Ratio & Resolution (Flush to Header) */}
      <div className="relative w-full max-w-[1920px] flex items-center justify-center bg-black overflow-hidden">
        <video
          ref={videoRef}
          src="/assets/video-hero.mp4"
          className="w-full h-auto max-h-[88vh] object-contain block m-0 p-0 pointer-events-none"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          aria-label="Uppercat Hero Video"
        />
      </div>

      {/* Floating Candy/Bubble Asset 1 (Top-Left Edge - Levitation Only) */}
      <div className="absolute top-[20%] -left-12 sm:-left-18 md:-left-24 lg:-left-30 z-30 pointer-events-none">
        <div className="animate-float-slow">
          <div className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-[240px] lg:h-[240px] filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]">
            <Image
              src="/assets/caramelo-1.png"
              alt="Candy decoration 1"
              fill
              sizes="(max-width: 768px) 150px, 250px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Floating Candy/Bubble Asset 2 (Bottom-Right Edge - Levitation Only) */}
      <div className="absolute -bottom-6 -right-12 sm:-bottom-10 sm:-right-20 md:-bottom-14 md:-right-28 lg:-bottom-16 lg:-right-34 z-30 pointer-events-none">
        <div className="animate-float-delayed">
          <div className="relative w-24 h-24 sm:w-40 sm:h-40 md:w-[220px] md:h-[220px] lg:w-[270px] lg:h-[270px] filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]">
            <Image
              src="/assets/caramelo-2.png"
              alt="Candy decoration 2"
              fill
              sizes="(max-width: 768px) 180px, 300px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
