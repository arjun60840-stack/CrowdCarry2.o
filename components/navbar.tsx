"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Package,
  Train,
  User,
  LogIn,
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Map,
  Wallet,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: Map },
  { href: "/trips", label: "Trips", icon: Train },
  { href: "/packages", label: "Packages", icon: Package },
  { href: "/earnings", label: "Earnings", icon: Wallet },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/help", label: "Help", icon: HelpCircle },
];

export function Navbar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredLinks = navLinks.filter(link => {
    if (["Dashboard", "Earnings", "Profile"].includes(link.label)) {
      return !!session;
    }
    return true;
  });

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/70 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-950/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg shadow-teal-500/30 transition-transform group-hover:scale-110">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-700 to-teal-500 bg-clip-text text-transparent dark:from-teal-400 dark:to-teal-300">
              CrowdCarry
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                      : "text-gray-600 hover:text-teal-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-teal-400 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-teal-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-teal-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {session ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden sm:flex gap-1.5 text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <Button size="sm" className="gap-1.5 rounded-xl shadow-lg shadow-teal-500/10">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-gray-200/50 dark:border-gray-700/50">
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            
            {session ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2 text-xs font-bold text-gray-500 hover:text-red-500"
                onClick={() => {
                  setMobileOpen(false);
                  signOut();
                }}
              >
                Sign Out
              </Button>
            ) : (
              <Link href="/login" className="block mt-2 px-3" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full gap-1.5 rounded-xl">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
