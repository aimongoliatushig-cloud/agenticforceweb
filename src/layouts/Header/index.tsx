"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { normalizeLocale } from "@/lib/i18n";
import { Logo, DesktopNav, MobileNav } from "./components";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const locale = normalizeLocale(pathname?.split("/")[1]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 flex items-center px-3 pt-3 transition-all duration-200 sm:px-5 md:pt-5",
        scrolled ? "translate-y-0" : "translate-y-0"
      )}
    >
      <div
        className={cn(
          "premium-header-shell relative mx-auto flex h-16 w-full max-w-[1320px] items-center justify-between overflow-visible rounded-[18px] border border-white/[0.05] bg-[rgba(10,10,10,0.72)] px-5 backdrop-blur-[12px] transition-all duration-200 sm:px-7 lg:px-9",
          scrolled
            ? "bg-[rgba(10,10,10,0.80)]"
            : "bg-[rgba(10,10,10,0.72)]"
        )}
      >
        <div className="pointer-events-none absolute inset-x-[22%] -bottom-8 h-12 bg-amber-500/10 blur-3xl" />

        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <DesktopNav />

        <div className="relative z-10 flex items-center gap-2 xl:hidden">
          <LanguageSwitcher compact />
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="premium-icon-button h-10 w-10 rounded-xl border border-white/[0.05] bg-white/[0.035] text-white hover:border-white/10 hover:bg-white/[0.055] focus-visible:ring-2 focus-visible:ring-amber-500/60"
            aria-label="Account"
          >
            <Link href={`/${locale}#newsletter`}>
              <UserRound className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="premium-icon-button h-10 w-10 rounded-xl border border-white/[0.05] bg-white/[0.035] text-white hover:border-white/10 hover:bg-white/[0.055] focus-visible:ring-2 focus-visible:ring-amber-500/60"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileNav isOpen={isMenuOpen} />
    </header>
  );
}

export default Header;
