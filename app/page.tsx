"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Shield, Star, Package, IndianRupee, MapPin, 
  Clock, TrendingUp, Calendar, ArrowRight,
  TrendingUp as Navigation, Train, Users, Zap, ChevronRight,
  CheckCircle, LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 flex items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-400/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-400/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="outline" className="mb-6 py-1.5 px-4 rounded-full border-teal-200 bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400 font-bold tracking-wide uppercase text-xs">
                ✨ India's First Peer-to-Peer Logistics Marketplace
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                Turn Your Next{" "}
                <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                  Trip
                </span>{" "}
                Into{" "}
                <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                  Extra Income
                </span>
              </h1>

              <p className="mt-8 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                Traveling Delhi → Jaipur → Agra? Carry packages along your route
                and earn ₹500–₹2000 per trip. Safe, verified & instant payouts
                via UPI.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/trips/new">
                  <Button className="h-16 px-10 rounded-2xl text-lg font-black gap-3 shadow-2xl shadow-teal-500/20 bg-teal-600 hover:bg-teal-700 transition-all hover:scale-105 active:scale-95">
                    Start Earning Now <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/packages/new">
                  <Button variant="outline" className="h-16 px-10 rounded-2xl text-lg font-black border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">
                    Send a Package
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-60">
                {[
                  { icon: Shield, label: "ID Verified Users" },
                  { icon: CheckCircle, label: "Secure Payments" },
                  { icon: Star, label: "Rated Marketplace" },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 font-bold text-sm">
                    <badge.icon className="h-4 w-4 text-teal-600" />
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Cities / Live Trips Preview */}
      <section className="py-24 bg-gray-50/50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                <Zap className="h-8 w-8 text-orange-500" />
                Live Routes
              </h2>
              <p className="text-gray-500 font-bold">Travelers active right now across India</p>
            </div>
            <Link href="/trips">
              <Button variant="ghost" className="font-black gap-2 hover:bg-transparent hover:text-teal-600 group">
                Browse Marketplace <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { from: "Delhi", to: "Jaipur", date: "April 15", mode: "Train", prize: "₹450/kg", traveler: "Arjun S.", rating: 4.9 },
              { from: "Mumbai", to: "Pune", date: "April 16", mode: "Car", prize: "₹300/kg", traveler: "Priya K.", rating: 4.8 },
              { from: "Bangalore", to: "Chennai", date: "April 18", mode: "Train", prize: "₹400/kg", traveler: "Rahul M.", rating: 5.0 },
            ].map((route, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-xl border border-transparent hover:border-teal-500/30 transition-all pointer-events-none"
              >
                <div className="flex justify-between items-start mb-6">
                  <Badge className="bg-teal-50 text-teal-600 border-teal-100 px-3 py-1 font-bold">{route.mode}</Badge>
                  <span className="text-xl font-black text-orange-600">{route.prize}</span>
                </div>
                <div className="flex items-center gap-3 mb-6 font-black text-lg">
                  {route.from} <ArrowRight className="h-4 w-4 text-gray-300" /> {route.to}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">{route.traveler[0]}</div>
                    <div>
                      <p className="text-xs font-black">{route.traveler}</p>
                      <div className="flex items-center gap-1 text-[10px] text-orange-500">
                        <Star className="h-2 w-2 fill-current" /> {route.rating} Verified
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">{route.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-4xl font-black mb-16 tracking-tight">Simple. Secure. Smart.</h2>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: MapPin, title: "Post Your Route", text: "Tell us where and when you're traveling." },
              { icon: IndianRupee, title: "Earn On The Go", text: "Accept package requests and set your price." },
              { icon: Shield, title: "Build Trust", text: "Get rated and grow your logistics business." },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="h-20 w-20 bg-teal-50 dark:bg-teal-900/20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <step.icon className="h-10 w-10 text-teal-600" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{step.title}</h3>
                <p className="text-gray-500 font-medium">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
