"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Train, Package, MapPin, Star,
  Clock, ArrowRight,
  Plus, CheckCircle,
  Calendar, Loader2, Zap,
  X, Weight, Edit, Trash2
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/toast-provider";
import { createDeliveryRequest } from "@/lib/actions";

interface Trip {
  id: string;
  fromCity: string;
  toCity: string;
  departureDate: string;
  departureTime: string;
  transportMode: string;
  pricePerKg: number;
  availableWeight: number;
  userId: string;
  user: {
    nameCode?: string;
    name: string;
    trustScore: number;
  };
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [requestModal, setRequestModal] = useState<Trip | null>(null);
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  // Package form state
  const [packageWeight, setPackageWeight] = useState("5");
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch("/api/trips");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
    
    // Background polling every 10 seconds
    const interval = setInterval(fetchTrips, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteTrip = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this trip?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/trips/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete trip");
      toast("Trip deleted successfully", "success");
      setTrips(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      toast("Error deleting trip", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRequest = async () => {
    if (!requestModal) return;
    setLoadingId(requestModal.id);
    
    try {
      // Need a package ID to create a delivery request. 
      const pkgRes = await fetch("/api/packages");
      const packages = await pkgRes.json();
      
      if (!packages || packages.length === 0) {
        toast("❌ You need to post a Package first before you can request a traveler!", "error");
        setLoadingId(null);
        return;
      }
      
      await createDeliveryRequest(requestModal.id, packages[0].id, Number(packageWeight) * requestModal.pricePerKg);
      toast(`📦 Delivery request sent to ${requestModal.user?.name}!`, "success");
      
      setRequestedIds((prev) => [...prev, requestModal.id]);
      setRequestModal(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send request";
      toast(errorMessage, "error");
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = trips.filter((t) => {
    if (filterFrom && !t.fromCity.toLowerCase().includes(filterFrom.toLowerCase())) return false;
    if (filterTo && !t.toCity.toLowerCase().includes(filterTo.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 relative">
      {/* Request Modal */}
      <AnimatePresence>
        {requestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setRequestModal(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-950 rounded-[2.5rem] shadow-2xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black flex items-center gap-3">
                  <Package className="h-6 w-6 text-orange-500" />
                   Send Package
                </h2>
                <button onClick={() => setRequestModal(null)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6 p-5 rounded-3xl bg-gray-50/50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 space-y-3">
                <div className="flex items-center gap-3 font-black text-lg">
                  <MapPin className="h-4 w-4 text-teal-600" />
                  {requestModal.fromCity}
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  {requestModal.toCity}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{new Date(requestModal.departureDate).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{requestModal.departureTime}</span>
                  <span className="flex items-center gap-1.5 capitalize"><Train className="h-3.5 w-3.5" />{requestModal.transportMode}</span>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-black text-[10px]">
                    {requestModal.user?.name?.slice(0,2).toUpperCase() || "CC"}
                  </div>
                  <div>
                    <p className="font-bold text-xs">{requestModal.user?.name || "Verified Traveler"}</p>
                    <div className="flex items-center gap-1 text-[10px] text-orange-500">
                      <Star className="h-2.5 w-2.5 fill-current" />
                      {requestModal.user?.trustScore || 95} Trust Score
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-black flex items-center gap-2 text-gray-500 mb-1 tracking-widest uppercase text-[10px]">
                    <Weight className="h-3 w-3" /> Estimate Package Weight (kg)
                  </label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="1" 
                      max={requestModal.availableWeight} 
                      value={packageWeight} 
                      onChange={(e) => setPackageWeight(e.target.value)}
                      className="flex-1 accent-orange-600"
                    />
                    <span className="font-black text-xl w-14 text-center text-orange-600">{packageWeight}kg</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-800/30">
                  <div className="flex items-center justify-between font-black">
                     <span className="text-xs text-orange-600 uppercase tracking-widest">Total Earnings</span>
                     <span className="text-2xl text-orange-700 dark:text-orange-400">₹{Number(packageWeight) * requestModal.pricePerKg}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-14 rounded-2xl text-lg font-black gap-3 shadow-xl bg-orange-600 hover:bg-orange-700 shadow-orange-600/20"
                onClick={handleRequest}
                disabled={loadingId === requestModal.id}
              >
                {loadingId === requestModal.id ? (
                  <><Loader2 className="h-6 w-6 animate-spin" /> Processing...</>
                ) : (
                  <><CheckCircle className="h-5 w-5" /> Confirm Request</>
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-5xl font-black tracking-tight text-gray-900 dark:text-white">Marketplace</h1>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest animate-pulse px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/20 mt-2">
              <div className="h-1.5 w-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
              Marketplace Live
            </div>
          </div>
          <p className="text-gray-500 dark:text-teal-100 font-bold flex items-center gap-2">
            <Zap className="h-4 w-4 text-teal-600" />
            Discover {trips.length} active routes for your package
          </p>
        </div>
        <Link href="/trips/new">
          <Button className="h-14 px-8 rounded-2xl font-black gap-3 shadow-xl shadow-teal-500/10">
            <Plus className="h-5 w-5" />
            Post My Trip
          </Button>
        </Link>
      </motion.div>

      {/* Modern Filters */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
          <Input
            placeholder="From city..."
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            className="h-14 pl-12 rounded-2xl border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-teal-500 font-bold"
          />
        </div>
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
          <Input
            placeholder="To city..."
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
            className="h-14 pl-12 rounded-2xl border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-orange-500 font-bold"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => { setFilterFrom(""); setFilterTo(""); }} 
          className="h-14 rounded-2xl border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-lg font-bold hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Reset Filters
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
          <p className="font-bold text-gray-400 animate-pulse">Scanning routes...</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((trip, i) => {
            const isRequested = requestedIds.includes(trip.id);
            const canRequest = trip.availableWeight > 0;

            return (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`group relative h-full rounded-[2.5rem] border-0 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${isRequested ? "ring-4 ring-teal-500" : "bg-white dark:bg-gray-900"}`}>
                  <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 w-full" />
                  
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-teal-500/20">
                          {trip.user?.name?.slice(0,2).toUpperCase() || "CC"}
                        </div>
                        <div>
                          <p className="font-black text-lg leading-tight">{trip.user?.name || "Verified Traveler"}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-3.5 w-3.5 text-orange-500 fill-current" />
                            <span className="text-xs font-black text-orange-500">{trip.user?.trustScore || 95}</span>
                            <Badge variant="outline" className="text-[9px] uppercase tracking-tighter px-2 border-gray-200">ID Verified</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        {trip.userId === currentUserId && (
                          <div className="flex gap-1 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 hover:bg-teal-100"
                              onClick={() => router.push(`/trips/${trip.id}/edit`)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100"
                              onClick={(e) => handleDeleteTrip(e, trip.id)}
                              disabled={deletingId === trip.id}
                            >
                              {deletingId === trip.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                        )}
                        <div>
                          <p className="text-2xl font-black text-orange-600">
                            ₹{trip.pricePerKg}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">per kg</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4 px-5 py-4 rounded-3xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-teal-500 shadow-sm shadow-teal-500/50" />
                          <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-700 my-1" />
                          <div className="h-2 w-2 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <p className="text-sm font-black flex justify-between">{trip.fromCity} <span className="font-bold text-[10px] text-gray-400 uppercase">Start</span></p>
                          <p className="text-sm font-black flex justify-between">{trip.toCity} <span className="font-bold text-[10px] text-gray-400 uppercase">End</span></p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-teal-600" />
                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Departure</p>
                            <p className="text-xs font-black">{new Date(trip.departureDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center gap-3">
                          <Clock className="h-4 w-4 text-teal-600" />
                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">Time</p>
                            <p className="text-xs font-black">{trip.departureTime}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className="font-bold text-[10px] rounded-lg px-2">
                            {trip.transportMode.toUpperCase()}
                           </Badge>
                           <span className="text-[10px] font-black text-gray-400 italic">
                             {trip.availableWeight}kg left
                           </span>
                        </div>
                        <Button
                          size="sm"
                          variant={isRequested ? "default" : "secondary"}
                          className={`rounded-[1.25rem] h-10 px-6 font-black text-xs gap-2 transition-all ${isRequested ? "bg-green-600 text-white" : "hover:bg-teal-600 hover:text-white"}`}
                          onClick={() => !isRequested && canRequest && setRequestModal(trip)}
                          disabled={isRequested || !canRequest}
                        >
                          {isRequested ? (
                            <><CheckCircle className="h-3.5 w-3.5" /> Booked</>
                          ) : !canRequest ? (
                            "Sold Out"
                          ) : (
                            <>Request Space <ArrowRight className="h-3.5 w-3.5" /></>
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
      )}

      {trips.length === 0 && !loading && (
        <div className="text-center py-32">
          <div className="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Train className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-black mb-2">No routes found</h3>
          <p className="text-gray-500 font-bold max-w-xs mx-auto">
            Be the first one traveling this route and start earning today!
          </p>
          <Link href="/trips/new" className="mt-8 inline-block">
             <Button variant="outline" className="rounded-2xl font-black h-12 px-8">Post Your Route</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
