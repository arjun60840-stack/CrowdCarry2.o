"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  Package, MapPin, Calendar, Weight, 
  ArrowRight, CheckCircle, AlertTriangle, 
  Loader2, Save, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CITIES } from "@/lib/utils";
import PackagePhotoUpload from "@/components/package-photo-upload";
import { useToast } from "@/components/toast-provider";

export default function EditPackagePage() {
  const router = useRouter();
  const params = useParams();
  const pkgId = params.id as string;
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [urgency, setUrgency] = useState("MEDIUM");
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`/api/packages/${pkgId}`);
        if (!res.ok) {
          toast("Failed to load package data", "error");
          router.push("/dashboard");
          return;
        }
        const data = await res.json();
        setInitialData(data);
        setImageUrl(data.imageUrl || "");
        setUrgency(data.urgency);
      } catch (err) {
        console.error(err);
        toast("An error occurred while fetching package", "error");
      } finally {
        setLoading(false);
      }
    };

    if (pkgId) fetchPackage();
  }, [pkgId, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const pkgData = {
        fromCity: formData.get("fromCity"),
        toCity: formData.get("toCity"),
        weight: formData.get("weight"),
        preferredDate: formData.get("preferredDate"),
        urgency: urgency,
        description: formData.get("description"),
        imageUrl: imageUrl || null,
      };

      const res = await fetch(`/api/packages/${pkgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pkgData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update package");
      }

      toast("✅ Package updated successfully!", "success");
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      toast(err.message || "Error updating package", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this package request? This action cannot be undone.")) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/packages/${pkgId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete package");
      }

      toast("🗑️ Package deleted successfully", "success");
      router.push("/dashboard");
    } catch (err: any) {
      toast(err.message || "Error deleting package", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        <p className="font-bold text-gray-500">Loading package details...</p>
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold mb-2 text-green-700 dark:text-green-400">Package Updated!</h2>
          <p className="text-gray-500 dark:text-gray-400">Your changes have been saved.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-start"
      >
        <div>
          <Link href="/dashboard" className="text-sm text-teal-600 hover:underline mb-2 block">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gradient">
            <Package className="h-8 w-8 text-orange-500" />
            Edit Package Request
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Update your package details or cancel the request.
          </p>
        </div>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          disabled={saving}
          className="gap-2 rounded-xl"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </motion.div>

      <div className="grid gap-8">
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-teal-400 to-teal-600" />
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-teal-500" />
              Package Information
            </CardTitle>
            <CardDescription>Update details about the item you want to send</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6 p-4 bg-gray-50/50 dark:bg-gray-900/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <label className="text-sm font-bold mb-2 block text-center uppercase tracking-wider text-gray-400">Package Image</label>
              <PackagePhotoUpload 
                value={imageUrl} 
                onChange={(url) => setImageUrl(url)}
                onRemove={() => setImageUrl("")}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    Pickup City
                  </label>
                  <select 
                    name="fromCity" 
                    defaultValue={initialData.fromCity}
                    className="flex h-11 w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800/50" 
                    required
                  >
                    <option value="">Select departure city</option>
                    {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    Destination City
                  </label>
                  <select 
                    name="toCity" 
                    defaultValue={initialData.toCity}
                    className="flex h-11 w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800/50" 
                    required
                  >
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
                  <Input 
                    name="weight" 
                    type="number" 
                    placeholder="e.g. 2.5" 
                    step="0.1" 
                    min="0.1" 
                    defaultValue={initialData.weight}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-teal-600" />
                    Preferred Delivery Date
                  </label>
                  <Input 
                    name="preferredDate" 
                    type="date" 
                    defaultValue={initialData.preferredDate ? new Date(initialData.preferredDate).toISOString().split('T')[0] : ""}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Urgency Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {["LOW", "MEDIUM", "HIGH", "EXPRESS"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all focus:ring-2 focus:ring-orange-500 focus:outline-none ${
                        urgency === level 
                        ? "bg-orange-500 border-orange-600 text-white shadow-lg" 
                        : "border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:text-orange-600 bg-white/50 dark:bg-gray-800/50"
                      }`}
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
                  defaultValue={initialData.description}
                  placeholder="e.g. Box of sweets from Jaipur, well packed. Needs careful handling."
                  className="flex min-h-[100px] w-full rounded-xl border border-gray-300 bg-white/50 px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800/50"
                  required
                />
              </div>

              <div className="rounded-xl bg-orange-50 dark:bg-orange-900/10 p-4 border border-orange-100 dark:border-orange-800/30 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  Changing weight may affect calculated pricing if the package is already listed. Significant changes might require reposting.
                </p>
              </div>

              <Button type="submit" disabled={saving} className="w-full h-12 text-lg gap-2 rounded-xl shadow-xl shadow-teal-500/10">
                {saving ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="h-5 w-5" /> Save Changes</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
