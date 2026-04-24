import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast-provider";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/components/session-provider";
import { auth } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CrowdCarry — Peer-to-Peer Delivery Platform",
  description:
    "Turn your next trip into extra income. India's first peer-to-peer package delivery platform for train travelers.",
  keywords: ["delivery", "peer-to-peer", "travel", "India", "train", "packages"],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Blocking script: applies dark class before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('crowdcarry-theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <Navbar session={session} />
              <main className="min-h-[calc(100vh-4rem)]">{children}</main>
              {/* Footer */}
              <footer className="border-t border-gray-200/50 bg-white/50 backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-950/50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div>
                      <h3 className="text-lg font-bold text-teal-700 dark:text-teal-400">CrowdCarry</h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        India&apos;s first peer-to-peer package delivery platform. Turn travel into earnings.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Platform</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <li><a href="/trips" className="hover:text-teal-600 transition-colors">Browse Trips</a></li>
                        <li><a href="/packages" className="hover:text-teal-600 transition-colors">Send Package</a></li>
                        <li><a href="/dashboard" className="hover:text-teal-600 transition-colors">Dashboard</a></li>
                        <li><a href="/tracking" className="hover:text-teal-600 transition-colors">Track Delivery</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Support</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <li><a href="/help" className="hover:text-teal-600 transition-colors">Help Center</a></li>
                        <li><a href="/help#safety" className="hover:text-teal-600 transition-colors">Safety Guide</a></li>
                        <li><a href="/help#terms" className="hover:text-teal-600 transition-colors">Terms of Service</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Connect</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                        <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">Twitter</a></li>
                        <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">LinkedIn</a></li>
                        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600 transition-colors">Instagram</a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-8 border-t border-gray-200/50 pt-6 text-center text-sm text-gray-400 dark:border-gray-800/50">
                    © 2026 CrowdCarry. All rights reserved. Made with ❤️ in India
                  </div>
                </div>
              </footer>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
