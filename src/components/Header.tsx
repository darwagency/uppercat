"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-28 sm:h-32 flex items-center justify-between relative">
        
        {/* Left Actions: Hamburger Menu & Instagram (50% Larger) */}
        <div className="flex items-center gap-6 sm:gap-8 z-10">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl text-white hover:text-amber-400 hover:bg-white/5 transition-all cursor-pointer focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-white hover:text-amber-400 hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Visit Instagram"
          >
            <svg
              className="w-9 h-9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>

        {/* Center: Brand Logo (50% Larger) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center pointer-events-auto">
          <Link href="/" className="group flex items-center justify-center">
            <Image
              src="/assets/logo-uppercat.png"
              alt="THE UPPER CAT"
              width={240}
              height={75}
              priority
              className="h-15 sm:h-18 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Right CTA: Trabajemos Juntos (50% Larger) */}
        <div className="z-10 flex items-center">
          <Link
            href="#contacto"
            className="text-sm sm:text-base md:text-lg font-semibold tracking-widest uppercase text-white hover:text-amber-400 transition-colors py-2 px-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-400 hover:after:w-full after:transition-all after:duration-300"
          >
            TRABAJEMOS JUNTOS
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu (Collapsible) */}
      {menuOpen && (
        <div className="w-full bg-[#0d0d0d] border-b border-white/10 px-6 py-6 transition-all duration-300">
          <nav className="flex flex-col gap-4 text-center max-w-md mx-auto">
            <Link
              href="#portafolio"
              onClick={() => setMenuOpen(false)}
              className="text-xl font-medium text-white/90 hover:text-amber-400 transition-colors py-2"
            >
              PORTAFOLIO
            </Link>
            <Link
              href="#servicios"
              onClick={() => setMenuOpen(false)}
              className="text-xl font-medium text-white/90 hover:text-amber-400 transition-colors py-2"
            >
              SERVICIOS
            </Link>
            <Link
              href="#nosotros"
              onClick={() => setMenuOpen(false)}
              className="text-xl font-medium text-white/90 hover:text-amber-400 transition-colors py-2"
            >
              NOSOTROS
            </Link>
            <Link
              href="#contacto"
              onClick={() => setMenuOpen(false)}
              className="text-xl font-semibold text-amber-400 hover:text-amber-300 transition-colors py-2"
            >
              TRABAJEMOS JUNTOS
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
