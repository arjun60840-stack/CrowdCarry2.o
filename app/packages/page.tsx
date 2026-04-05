"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Package, MapPin, Calendar, Weight, 
  IndianRupee, ArrowRight, Filter, Info, 
  Star, Shield, Clock, Users, Plus,
  CheckCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/toast-provider";
import { createDeliveryRequest } from "@/lib/actions";

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPackages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleAccept = async (pkg: any) => {
    if (acceptedIds.includes(pkg.id)) return;
    setLoadingId(pkg.id);
    try {
      const tripRes = await fetch("/api/trips");
      const trips = await tripRes.json();
      
      if (!trips || trips.length === 0) {
        toast("❌ You need to post a Trip first before you can accept packages!", "error");
        return;
      }

      await createDeliveryRequest(trips[0].id, pkg.id, pkg.weight * 150);
      setAcceptedIds((prev) => [...prev, pkg.id]);
      toast(`✅ You accepted ${pkg.user?.name || "the"}'s package!`, "success");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err) {
      toast("Failed to accept package", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = packages.filter((p) => {
    if (filterFrom && !p.fromCity.toLowerCase().includes(filterFrom.toLowerCase())) return false;
    if (filterTo && !p.toCity.toLowerCase().includes(filterTo.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gradient">
            <Package className="h-8 w-8 text-orange-500" />
            Pick Up Packages
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Browse requests matching your next travel route
          </p>
        </div>
        <Link href="/packages/new">
          <Button variant="secondary" className="gap-2">
            <Plus className="h-4 w-4" />
            Post a Package
          </Button>
        </Link>
      </motion.div>

      {/* Filters */}
      <Card className="mb-6 border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pickup city..."
                value={filterFrom}
                onChange={(e) => setFilterFrom(e.target.value)}
                className="pl-10"
              />
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 hidden sm:block" />
            <div className="relative flex-1 w-full">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Destination city..."
                value={filterTo}
                onChange={(e) => setFilterTo(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => { setFilterFrom(""); setFilterTo(""); }}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {acceptedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/40 flex items-center gap-3"
        >
          <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-teal-800 dark:text-teal-200">
            You have accepted <strong>{acceptedIds.length}</strong> package{acceptedIds.length > 1 ? "s" : ""}.{" "}
            <Link href="/dashboard" className="underline hover:no-underline">View in Dashboard →</Link>
          </p>
        </motion.div>
      )}

      {/* Packages List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {loading ? (
             <div className="col-span-full py-20 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-teal-600" /></div>
        ) : filtered.map((pkg, i) => {
          const isAccepted = acceptedIds.includes(pkg.id);
          const isLoading = loadingId === pkg.id;
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden border-teal-100/50 dark:border-teal-900/20 ${isAccepted ? "ring-2 ring-teal-500 ring-offset-2" : ""}`}>
                <div className="absolute top-0 right-0 p-3">
                  <Badge variant={pkg.urgency === "HIGH" || pkg.urgency === "EXPRESS" ? "destructive" : "secondary"}>
                    {pkg.urgency}
                  </Badge>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {pkg.user?.name?.slice(0,2).toUpperCase() || "CC"}
                    </div>
                    <div>
                      <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base">
                        {pkg.user?.name || "Anonymous Sender"}
                        <Shield className="h-3.5 w-3.5 text-teal-600" />
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Star className="h-3 w-3 text-orange-400 fill-orange-400" />
                        Trust Score: {pkg.user?.trustScore || 85}
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xl font-black text-teal-700 dark:text-teal-400">₹{pkg.weight * 150}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase">Earnings</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-teal-500" />
                        <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-800" />
                        <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold flex justify-between">
                          {pkg.fromCity}
                          <span className="text-xs text-gray-400 font-normal">Pickup</span>
                        </p>
                        <div className="h-3" />
                        <p className="text-sm font-bold flex justify-between">
                          {pkg.toCity}
                          <span className="text-xs text-gray-400 font-normal">Dropoff</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-gray-100 dark:border-gray-800">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Package Info</p>
                        <p className="text-sm font-medium flex items-center gap-1.5">
                          <Weight className="h-3.5 w-3.5 text-teal-600" />
                          {pkg.weight} kg
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Preferred Date</p>
                        <p className="text-sm font-medium flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-teal-600" />
                          {new Date(pkg.preferredDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Package Description</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 italic">
                        &ldquo;{pkg.description}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800/30">
                        <Users className="h-3.5 w-3.5 text-teal-600" />
                        <span className="text-xs font-bold text-teal-700 dark:text-teal-400">Route Match</span>
                      </div>
                      <Button
                        size="sm"
                        className={`gap-1.5 shadow-lg transition-all ${isAccepted ? "bg-green-600 hover:bg-green-700 shadow-green-500/20" : "shadow-teal-500/20"}`}
                        onClick={() => handleAccept(pkg)}
                        disabled={isAccepted || isLoading}
                        id={`accept-btn-${pkg.id}`}
                      >
                        {isLoading ? (
                          <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Accepting...</>
                        ) : isAccepted ? (
                          <><CheckCircle className="h-3.5 w-3.5" /> Accepted</>
                        ) : (
                          <>Accept & Carry <ArrowRight className="h-3.5 w-3.5" /></>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <Package className="h-16 w-16 mx-auto mb-4 text-gray-300 animate-pulse" />
          <h3 className="text-xl font-bold">No packages found</h3>
          <p className="text-gray-500">Try searching for other cities or post your trip for visibility.</p>
        </div>
      )}
    </div>
  );
}
