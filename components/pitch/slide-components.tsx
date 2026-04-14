"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, Shield, Zap, Globe, 
  MapPin, Clock, IndianRupee, 
  Cpu, Rocket, CheckCircle2,
  AlertCircle, Package, Train
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function HeroSlide() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="h-24 w-24 bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-teal-500/30 animate-float">
          <Train className="h-12 w-12 text-white" />
        </div>
      </motion.div>
      <motion.h1 
        {...fadeInUp}
        className="text-6xl md:text-8xl font-black mb-6 tracking-tight bg-gradient-to-r from-teal-600 to-orange-500 bg-clip-text text-transparent"
      >
        CrowdCarry
      </motion.h1>
      <motion.p 
        {...fadeInUp}
        transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl font-medium"
      >
        Turning India's <span className="text-teal-600 font-bold italic">23 Million Daily Passengers</span> into a distributed logistics network.
      </motion.p>
    </div>
  );
}

export function ProblemSlide() {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center px-8 max-w-6xl mx-auto">
      <motion.div {...fadeInUp}>
        <Badge className="mb-4 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200">The Problem</Badge>
        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Logistics is Broken.</h2>
        <div className="space-y-6">
          {[
            { icon: Clock, title: "Slow Delivery", desc: "Inter-city courier takes 48-72 hours for small packages." },
            { icon: IndianRupee, title: "High Costs", desc: "Last-mile and sorting center overheads double the price." },
            { icon: AlertCircle, title: "Zero Trust", desc: "Unreliable local transporters and lack of tracking." }
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative aspect-square glass-dark rounded-3xl overflow-hidden border-2 border-orange-500/20 flex flex-col items-center justify-center p-12 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
        <div className="text-8xl font-black text-orange-500 mb-4 tracking-tighter">₹25B</div>
        <p className="text-xl font-bold uppercase tracking-widest text-gray-400">Total Addressable Market</p>
        <p className="mt-4 text-sm text-gray-400">Inefficiency in small-parcel inter-city logistics in India.</p>
      </motion.div>
    </div>
  );
}

export function SolutionSlide() {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-8">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 uppercase tracking-widest">The Solution</Badge>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight">P2P Rail Logistics.</h2>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: "Same-Day", desc: "Packages travel on Shatabdi/Rajdhani speeds. Delivered in < 12 hours." },
          { icon: Shield, title: "Secure", desc: "Social verification + Aadhaar + OTP handover = 100% Security." },
          { icon: Globe, title: "Scalable", desc: "India has the world's largest rail network. 7,000+ stations accessible." }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Card className="border-0 shadow-2xl glass-dark hover:border-teal-500/50 transition-all group h-full">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500 mb-6 group-hover:scale-110 transition-transform bg-gradient-to-br from-teal-500/20 to-transparent">
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function TechStackSlide() {
  return (
    <div className="flex flex-col items-center justify-center px-8 text-center max-w-5xl mx-auto">
      <Badge className="mb-8 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200">The 2026 Stack</Badge>
      <h2 className="text-5xl font-black mb-12 tracking-tight">Built for Speed & Scale</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {[
          { label: "Next.js 15", sub: "App Router", icon: Cpu },
          { label: "React 19", sub: "Server Comp", icon: Rocket },
          { label: "Prisma", sub: "Type-safe DB", icon: BarChart3 },
          { label: "Auth.js", sub: "OTP Security", icon: Shield }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <item.icon className="h-8 w-8 mx-auto mb-4 text-teal-500" />
            <h4 className="font-bold text-lg">{item.label}</h4>
            <p className="text-xs text-gray-500 font-medium">{item.sub}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 p-8 rounded-3xl border border-dashed border-teal-500/30 w-full bg-teal-500/5">
        <p className="text-teal-600 font-black tracking-widest uppercase text-xs mb-4">Highlights</p>
        <div className="flex flex-wrap justify-center gap-6">
          <span className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="h-4 w-4 text-green-500" /> Real-time Tracking</span>
          <span className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="h-4 w-4 text-green-500" /> AI Matching Engine</span>
          <span className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="h-4 w-4 text-green-500" /> Razorpay Integration</span>
        </div>
      </div>
    </div>
  );
}

export function RoadmapSlide() {
  return (
    <div className="grid md:grid-cols-2 gap-16 px-8 max-w-6xl mx-auto items-center">
      <motion.div {...fadeInUp}>
        <h2 className="text-5xl font-black mb-8 leading-tight">The Vision for <span className="text-gradient">Tomorrow</span></h2>
        <div className="space-y-8 relative">
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-teal-500 via-orange-500 to-transparent opacity-20" />
          
          {[
            { phase: "Phase 1: Foundation", items: ["Aadhaar-based Deep Verification", "Platform Launch (Delhi-Jaipur)"] },
            { phase: "Phase 2: Trust", items: ["Crowd Insurance (₹25k Coverage)", "Community Ratings v2"] },
            { phase: "Phase 3: Scale", items: ["Automated Kiosk Pickups", "Nationwide Rail Expansion"] }
          ].map((item, i) => (
            <div key={i} className="relative pl-16">
              <div className={`absolute left-4 top-1 h-5 w-5 rounded-full border-4 border-white dark:border-gray-950 ${i === 0 ? "bg-teal-500" : "bg-gray-200"}`} />
              <h4 className="font-black text-xl mb-3 text-teal-600 uppercase tracking-tight">{item.phase}</h4>
              <ul className="space-y-2">
                {item.items.map((li, j) => (
                  <li key={j} className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-gray-400" /> {li}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
      
      <div className="space-y-6">
         <Card className="border-0 shadow-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white overflow-hidden p-8 relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield className="h-32 w-32" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Coming Q3 2026</p>
            <h3 className="text-3xl font-black mb-4">DeepTrust™ AI Verification</h3>
            <p className="text-teal-50 text-sm leading-relaxed mb-6">
              Integrating Indian Government's Aadhaar DigiLocker for 100% verified traveler identity. No anonymous deliveries. Ever.
            </p>
            <Button className="bg-white text-teal-700 hover:bg-teal-50 font-bold rounded-xl w-full py-6">
              View Prototype
            </Button>
         </Card>
         <div className="flex gap-4">
            <div className="flex-1 p-6 rounded-3xl bg-orange-500/10 border border-orange-500/20 text-center">
              <p className="text-4xl font-black text-orange-600 mb-1">98%</p>
              <p className="text-[10px] font-black text-orange-700/60 uppercase tracking-widest">Safety Projection</p>
            </div>
            <div className="flex-1 p-6 rounded-3xl bg-teal-500/10 border border-teal-500/20 text-center">
              <p className="text-4xl font-black text-teal-600 mb-1">₹5.2Cr</p>
              <p className="text-[10px] font-black text-teal-700/60 uppercase tracking-widest">Projected GMV</p>
            </div>
         </div>
      </div>
    </div>
  );
}

function Button({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-bold transition-all active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}
