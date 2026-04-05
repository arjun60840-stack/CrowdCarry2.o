"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, MapPin, Calendar, Weight, 
  IndianRupee, ArrowRight, CheckCircle, Info, 
  AlertTriangle, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CITIES } from "@/lib/utils";

export default function NewPackagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        fromCity: formData.get("fromCity"),
        toCity: formData.get("toCity"),
        weight: formData.get("weight"),
        preferredDate: formData.get("preferredDate"),
        urgency: formData.get("urgency") || "MEDIUM",
        description: formData.get("description"),
      };

      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to post package");

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      alert("Error posting package! Please make sure you are logged in.");
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
          <h2 className="text-3xl font-bold mb-2 text-green-700 dark:text-green-400">Package Posted!</h2>
          <p className="text-gray-500 dark:text-gray-400">Matchmakers are now looking for travelers...</p>
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
          <Plus className="h-8 w-8 text-orange-500" />
          Send a Package
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Tell us about your package and we&apos;ll match you with a verified traveler
        </p>
      </motion.div>

      <div className="grid gap-8">
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600" />
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              Package Information
            </CardTitle>
            <CardDescription>Enter details about the item you want to send</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    Pickup City
                  </label>
                  <select name="fromCity" className="flex h-11 w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800/50" required>
                    <option value="">Select departure city</option>
                    {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    Destination City
                  </label>
                  <select name="toCity" className="flex h-11 w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800/50" required>
                    <option value="">Select arrival city</option>
                    {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Weight className="h-4 w-4 text-teal-600" />
                    Weight (kg)
                  </label>
                  <Input name="weight" type="number" placeholder="e.g. 2.5" step="0.1" min="0.1" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-teal-600" />
                    Preferred Delivery Date
                  </label>
                  <Input name="preferredDate" type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Urgency Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {["LOW", "MEDIUM", "HIGH", "EXPRESS"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:border-orange-500 hover:text-orange-600 transition-all focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  name="description"
                  placeholder="e.g. Box of sweets from Jaipur, well packed. Needs careful handling."
                  className="flex min-h-[100px] w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800/50"
                  required
                />
              </div>

              <div className="rounded-xl bg-orange-50 dark:bg-orange-900/10 p-4 border border-orange-100 dark:border-orange-800/30 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  <strong>Safety Notice:</strong> Ensure you are not sending any prohibited items (flammables, illegal substances, liquids). All packages may be inspected by the traveler.
                </p>
              </div>

              <Button type="submit" disabled={loading} variant="secondary" className="w-full h-12 text-lg gap-2">
                {loading ? "Posting..." : "Post Package Request"}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
