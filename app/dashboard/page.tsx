"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Train, Package, MapPin, IndianRupee, Star,
  TrendingUp, Clock, ArrowRight, Shield,
  Users, Plus, CheckCircle, Navigation,
  ChevronRight, Calendar, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/toast-provider";
import { useCallback } from "react";
import Image from "next/image";

interface DashboardPackage {
  id: string;
  description: string;
  weight: number;
  fromCity: string;
  toCity: string;
  imageUrl?: string;
}

interface DashboardTrip {
  id: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  departureTime: string;
  status: string;
  pricePerKg: number;
}

interface DashboardDelivery {
  id: string;
  status: string;
  price: number;
  createdAt: string;
  package?: {
    description: string;
    imageUrl?: string;
  };
  trip?: {
    fromCity: string;
    toCity: string;
  };
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200",
  ACCEPTED: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200",
  PICKED_UP: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200",
  IN_TRANSIT: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200",
  COMPLETED: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200",
};

export default function DashboardPage() {
  const [packages, setPackages] = useState<DashboardPackage[]>([]);
  const [trips, setTrips] = useState<DashboardTrip[]>([]);
  const [deliveries, setDeliveries] = useState<DashboardDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [pkgRes, tripRes, delRes] = await Promise.all([
        fetch("/api/packages"),
        fetch("/api/trips"),
        fetch("/api/deliveries")
      ]);
      
      const pkgData = await pkgRes.json();
      const tripData = await tripRes.json();
      const delData = await delRes.json();
      
      setPackages(pkgData || []);
      setTrips(tripData || []);
      setDeliveries(delData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 10 seconds for real-time feel
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const totalEarnings = deliveries
    .filter(d => d.status === "DELIVERED")
    .reduce((acc, d) => acc + d.price, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
      >
        <div>
          <h1 className="text-5xl font-black tracking-tight text-gradient mb-2">My Dashboard</h1>
          <p className="text-gray-500 font-bold flex items-center gap-2">
            <Shield className="h-4 w-4 text-teal-600" />
            Managing {deliveries.length} active delivery requests
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-3">
            <Link href="/trips/new">
              <Button className="h-12 px-6 rounded-2xl font-bold gap-2 shadow-xl shadow-teal-500/20">
                <Plus className="h-5 w-5" /> Post Trip
              </Button>
            </Link>
            <Link href="/packages/new">
              <Button variant="secondary" className="h-12 px-6 rounded-2xl font-bold gap-2 shadow-xl">
                <Package className="h-5 w-5" /> Send Package
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-teal-600/50 uppercase tracking-widest animate-pulse px-2 py-0.5 rounded-full bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/20">
            <div className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
            Live Sync Active
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Earnings", value: `₹${totalEarnings}`, icon: IndianRupee, color: "text-green-600", bg: "bg-green-50/50 dark:bg-green-950/20" },
          { label: "Active Trips", value: trips.length, icon: Navigation, color: "text-teal-600", bg: "bg-teal-50/50 dark:bg-teal-950/20" },
          { label: "Packages", value: packages.length, icon: Package, color: "text-orange-600", bg: "bg-orange-50/50 dark:bg-orange-950/20" },
          { label: "Trust Score", value: "94", icon: Shield, color: "text-purple-600", bg: "bg-purple-50/50 dark:bg-purple-950/20" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="rounded-3xl border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all group overflow-hidden">
              <CardContent className="p-8">
                <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-3xl font-black">{stat.value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
             <h2 className="text-lg font-black text-orange-600">Active Deliveries ({deliveries.length})</h2>
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                <p className="font-bold text-gray-400">Loading history...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {deliveries.length === 0 ? (
                  <EmptyState icon={Package} label="No active deliveries" href="/packages" buttonText="Find items to carry" />
                ) : (
                  deliveries.map((del) => <DeliveryCard key={del.id} del={del} />)
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-xl p-8">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3">
              <Navigation className="h-5 w-5 text-teal-600" />
              Upcoming Trips
            </h2>
            <div className="space-y-4">
              {trips.length === 0 ? (
                <p className="text-sm font-bold text-gray-400 text-center py-8">No trips scheduled.</p>
              ) : (
                trips.map((trip) => (
                  <div key={trip.id} className="p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-teal-500/50 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                       <Badge variant="outline" className={`${statusColors[trip.status] || "bg-gray-100"} border-0 text-[10px] font-black uppercase tracking-widest px-2 py-0.5`}>
                         {trip.status}
                       </Badge>
                       <p className="text-xs font-black text-teal-700">₹{trip.pricePerKg}/kg</p>
                    </div>
                    <div className="flex items-center gap-2 font-black text-sm mb-1">
                      {trip.fromCity} <ArrowRight className="h-3 w-3 text-gray-400" /> {trip.toCity}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                      <Calendar className="h-3 w-3" /> {new Date(trip.departureDate).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link href="/trips/new" className="mt-6 block">
              <Button variant="outline" className="w-full rounded-2xl h-12 font-black gap-2">
                <Plus className="h-4 w-4" /> Add Trip
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DeliveryCard({ del }: { del: DashboardDelivery }) {
  return (
    <Link href={`/tracking/${del.id}`}>
      <Card className="rounded-3xl border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all group overflow-hidden">
        <div className="flex flex-col md:flex-row gap-0">
          {del.package?.imageUrl && (
            <div className="relative w-full md:w-32 h-32 md:h-auto shrink-0 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800">
               <Image 
                 src={del.package.imageUrl} 
                 alt="Package" 
                 fill 
                 className="object-cover group-hover:scale-110 transition-transform duration-500"
               />
            </div>
          )}
          <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between gap-4 p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={`${statusColors[del.status]} border font-black text-[10px] px-3`}>
                  {del.status.replace("_", " ")}
                </Badge>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order CC#{del.id.slice(-6)}</span>
              </div>
              <div className="flex items-center gap-3 font-black text-xl">
                <MapPin className="h-5 w-5 text-teal-600" />
                {del.trip?.fromCity}
                <ArrowRight className="h-5 w-5 text-gray-400" />
                {del.trip?.toCity}
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                <span className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5 text-orange-500" /> {del.package?.description.slice(0,25)}...</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(del.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
              <p className="text-2xl font-black text-teal-700">₹{del.price}</p>
              <Button size="sm" className="rounded-xl h-10 px-6 font-black text-xs gap-2">
                Track <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function EmptyState({ icon: Icon, label, href, buttonText }: { icon: any; label: string; href: string; buttonText: string }) {
  return (
    <Card className="p-16 text-center border-dashed border-2 rounded-[2.5rem] bg-gray-50/30 dark:bg-gray-900/20">
      <div className="h-16 w-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
        <Icon className="h-8 w-8 text-gray-300" />
      </div>
      <p className="text-xl font-black tracking-tight mb-2 tracking-wide uppercase italic text-gray-300">{label}</p>
      <Link href={href}>
        <Button variant="outline" className="mt-4 rounded-xl h-12 px-8 font-black">
          {buttonText}
        </Button>
      </Link>
    </Card>
  );
}
