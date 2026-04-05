"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Train, MapPin, Calendar, Clock, Weight, 
  IndianRupee, ArrowRight, CheckCircle, Info,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CITIES } from "@/lib/utils";

export default function NewTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [weight, setWeight] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        fromCity: formData.get("from"),
        toCity: formData.get("to"),
        departureDate: formData.get("date"),
        departureTime: formData.get("time"),
        transportMode: formData.get("transport") || "train",
        availableWeight: formData.get("availableWeight"),
        pricePerKg: formData.get("pricePerKg"),
        description: formData.get("note"),
      };

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to post trip");

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      alert("Error posting trip! Please make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-green-700 dark:text-green-400">Trip Posted Successfully!</h2>
          <p className="text-gray-500 dark:text-gray-400">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link href="/dashboard" className="text-sm text-teal-600 hover:underline mb-2 block">← Back to Dashboard</Link>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Plus className="h-8 w-8 text-teal-600" />
          Post a New Trip
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Share your travel details to start earning from empty luggage space
        </p>
      </motion.div>

      <div className="grid gap-8">
        <Card className="border-0 shadow-xl">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Train className="h-5 w-5 text-teal-600" />
              Travel Details
            </CardTitle>
            <CardDescription>Enter your route and schedule information</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    From City
                  </label>
                  <select
                    name="from"
                    required
                    className="flex h-11 w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800/50"
                  >
                    <option value="">Select city</option>
                    {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    To City
                  </label>
                  <select
                    name="to"
                    required
                    className="flex h-11 w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800/50"
                  >
                    <option value="">Select city</option>
                    {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-teal-600" />
                    Departure Date
                  </label>
                  <Input type="date" name="date" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-teal-600" />
                    Departure Time
                  </label>
                  <Input type="time" name="time" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Transport Mode</label>
                <select
                  name="transport"
                  required
                  className="flex h-11 w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800/50"
                >
                  <option value="">Select transport</option>
                  <option value="train">Train</option>
                  <option value="bus">Bus</option>
                  <option value="car">Car / Cab</option>
                  <option value="flight">Flight</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <CardTitle className="text-xl flex items-center gap-2 mb-1">
                  <Weight className="h-5 w-5 text-teal-600" />
                  Capacity &amp; Pricing
                </CardTitle>
                <CardDescription className="mb-4">How much can you carry and at what price?</CardDescription>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Available Weight (kg)</label>
                      <Badge variant="secondary">Max 20kg</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="flex-1 accent-teal-600"
                        name="availableWeight"
                      />
                      <span className="font-bold text-lg w-14 text-center text-teal-700 dark:text-teal-400">{weight}kg</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-green-600" />
                      Price per kg (₹)
                    </label>
                    <Input type="number" name="pricePerKg" placeholder="e.g. 150" min="50" required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Note (Optional)</label>
                <textarea 
                  name="note"
                  placeholder="e.g. Traveling via Shatabdi, can carry fragile items carefully."
                  className="flex min-h-[100px] w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800/50 resize-none"
                />
              </div>

              <div className="rounded-xl bg-teal-50 dark:bg-teal-900/10 p-4 border border-teal-100 dark:border-teal-800/30 flex gap-3">
                <Info className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-teal-800 dark:text-teal-300">
                  <strong>Traveler Tip:</strong> Trips with lower prices and higher weight capacity usually match faster with premium package requests.
                </p>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 text-lg gap-2" id="post-trip-submit-btn">
                {loading ? "Posting..." : "Post Trip to Marketplace"}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
