"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, Star, Package, IndianRupee, MapPin, 
  Clock, TrendingUp, Calendar, ArrowRight,
  Navigation, Train
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/toast-provider";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({ totalEarnings: 0, deliveries: 0, trips: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUser(data.user);
        setStats(data.stats);
      } catch (err) {
        console.error(err);
        toast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [toast]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-8 mb-16"
      >
        <div className="relative group">
          <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-4xl font-black shadow-2xl transition-transform group-hover:scale-105">
            {user?.name?.slice(0, 2).toUpperCase() || "CC"}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
            <CheckCircleIcon className="h-5 w-5 text-teal-600" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 tracking-wide uppercase italic text-gray-400">My Profile</h1>
          <p className="text-gray-500 font-bold flex items-center gap-2">
            <Shield className="h-4 w-4 text-teal-600" />
            Verified Logistics Partner since 2024
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Stats Section */}
        <div className="lg:col-span-2 space-y-10">
          <div className="grid sm:grid-cols-4 gap-6">
            {[
              { label: "Earnings", value: `₹${stats.totalEarnings}`, icon: IndianRupee, color: "text-green-600", bg: "bg-green-50/50 dark:bg-green-950/20" },
              { label: "Deliveries", value: stats.deliveries, icon: Package, color: "text-orange-600", bg: "bg-orange-50/50 dark:bg-orange-950/20" },
              { label: "Trips", value: stats.trips, icon: Navigation, color: "text-teal-600", bg: "bg-teal-50/50 dark:bg-teal-950/20" },
              { label: "Rating", value: "4.9", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50/50 dark:bg-yellow-950/20" }
            ].map((stat, i) => (
              <Card key={i} className="rounded-3xl border-0 shadow-lg p-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm group hover:scale-105 transition-transform cursor-default">
                <div className={`h-10 w-10 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 transition-transform group-hover:rotate-12`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">{stat.label}</p>
              </Card>
            ))}
          </div>

          <Card className="rounded-[2.5rem] border-0 shadow-xl p-10 bg-white dark:bg-gray-950">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
               <TrendingUp className="h-5 w-5 text-teal-600" />
               Performance Tracking
            </h3>
            <div className="space-y-8">
              {[
                { label: "On-time Delivery Rate", value: "98%", progress: 98, color: "bg-teal-500" },
                { label: "Handling Quality Score", value: "95%", progress: 95, color: "bg-orange-500" },
                { label: "Community Trust Level", value: "Expert", progress: 92, color: "bg-purple-500" }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-black">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px]">{item.label}</span>
                    <span className="text-teal-600">{item.value}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      className={`h-full ${item.color} shadow-lg shadow-teal-500/20`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
           <Card className="rounded-[2.5rem] border-0 shadow-xl p-8 bg-gradient-to-br from-teal-600 to-teal-800 text-white">
              <h3 className="text-xl font-black mb-4 tracking-tight">Active Traveler</h3>
              <p className="text-teal-100 font-bold text-sm mb-6 leading-relaxed">Your routes are verified and active on the marketplace. Keep carrying packages to increase your trust score.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-black">
                  <Badge className="bg-white/20 text-white border-0">Level 4</Badge>
                  <span>Elite Logistics Partner</span>
                </div>
              </div>
           </Card>

           <Card className="rounded-[2.5rem] border-0 shadow-xl p-8 bg-white dark:bg-gray-950">
              <h3 className="text-lg font-black mb-6 tracking-tight">Personal Details</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Verified</p>
                    <p className="font-bold text-sm">{user?.phone || "+91 98765 43210"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base City</p>
                    <p className="font-bold text-sm">{user?.city || "New Delhi"}</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-8 rounded-2xl h-12 font-black border-2">Edit Settings</Button>
           </Card>
        </div>
      </div>
    </div>
  );
}

function CheckCircleIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}
