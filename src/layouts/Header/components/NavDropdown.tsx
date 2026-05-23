"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type NavDropdownProps = {
  label: string;
  items: string[];
  id: string;
  isMobile?: boolean;
  className?: string;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
};

export default function NavDropdown({
  label,
  items,
  id,
  isMobile = false,
  className,
  activeDropdown,
  setActiveDropdown,
}: NavDropdownProps) {
  const isOpen = activeDropdown === id;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any pending timeout when component unmounts or dropdown state changes
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeDropdown]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setActiveDropdown]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDropdown();
    } else if (e.key === "Escape" && isOpen) {
      setActiveDropdown(null);
    }
  };

  // For desktop only - hover functionality with improved handling
  const handleMouseEnter = () => {
    if (isMobile) return;

    // Clear any pending close timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Set this dropdown as active immediately
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a small delay before closing to allow movement to another dropdown
    timeoutRef.current = setTimeout(() => {
      // Only close if we're the currently active dropdown
      // This prevents closing a newly opened dropdown
      if (activeDropdown === id) {
        setActiveDropdown(null);
      }
    }, 150);
  };

  const toggleDropdown = () => {
    setActiveDropdown(isOpen ? null : id);
  };

  const mobileStyles = isMobile
    ? {
        wrapper: "border-b border-white/10 pb-2",
        button:
          "flex items-center justify-between w-full py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 rounded-xl px-3 text-white/85 transition-all duration-300 hover:bg-amber-400/8 hover:text-amber-100",
        content: "pl-2 mt-1 space-y-1 animate-fadeIn",
        item: "block py-2 px-3 text-white/70 hover:text-white hover:bg-amber-400/8 rounded-lg transition-all duration-300 active:bg-white/15",
      }
    : {
        wrapper: "relative",
        button:
          "premium-nav-link premium-nav-active relative flex items-center gap-1 rounded-xl px-1 py-2 text-[15px] font-medium text-[#d1d1d1] transition-all duration-200 hover:-translate-y-px hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60",
        content:
          "absolute top-full left-0 mt-4 w-64 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/85 p-3 shadow-[0_18px_48px_rgba(0,0,0,0.45),0_8px_24px_rgba(245,158,11,0.08)] backdrop-blur-xl animate-fadeIn",
        item: "flex items-center rounded-xl px-4 py-2.5 text-white/75 transition-all duration-200 hover:translate-x-1 hover:bg-white/[0.055] hover:text-white",
      };

  return (
    <div
      className={cn(mobileStyles.wrapper, className)}
      onMouseEnter={isMobile ? undefined : handleMouseEnter}
      onMouseLeave={isMobile ? undefined : handleMouseLeave}
    >
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        className={mobileStyles.button}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={isMobile ? "font-medium" : ""}>{label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-180" : "",
            isMobile ? "" : "ml-1"
          )}
        />
      </button>

      {isOpen && (
        <div ref={dropdownRef} className={mobileStyles.content}>
          {!isMobile && (
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
          )}
          {items.map((item) => (
            <Link key={item} href="#" className={mobileStyles.item}>
              <span className={cn("font-medium", "text-sm")}>{item}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
