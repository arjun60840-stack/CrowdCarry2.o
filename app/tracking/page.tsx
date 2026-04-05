"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package, MapPin, ArrowRight, CheckCircle,
  Clock, Train, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const deliveries = [
  {
    id: "DEL-1234",
    from: "Delhi",
    to: "Jaipur",
    package: "Handloom Sarees",
    weight: "3 kg",
    status: "IN_TRANSIT",
    price: 450,
    sender: "Amit Patel",
    date: "Today",
    eta: "06:00 PM",
  },
  {
    id: "DEL-1235",
    from: "Delhi",
    to: "Agra",
    package: "Electronics",
    weight: "5 kg",
    status: "ACCEPTED",
    price: 600,
    sender: "Neha Singh",
    date: "Apr 3",
    eta: "02:00 PM",
  },
  {
    id: "DEL-1236",
    from: "Jaipur",
    to: "Delhi",
    package: "Rajasthani Sweets",
    weight: "2 kg",
    status: "PENDING",
    price: 400,
    sender: "Rahul Sharma",
    date: "Apr 8",
    eta: "Awaiting pickup",
  },
  {
    id: "DEL-1101",
    from: "Delhi",
    to: "Jaipur",
    package: "Official Documents",
    weight: "0.5 kg",
    status: "DELIVERED",
    price: 350,
    sender: "Priya Gupta",
    date: "Mar 28",
    eta: "Completed",
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", icon: Clock },
  ACCEPTED: { label: "Accepted", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", icon: CheckCircle },
  IN_TRANSIT: { label: "In Transit", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300", icon: Train },
  DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300", icon: CheckCircle },
};

export default function TrackingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-8 w-8 text-teal-600" />
          My Deliveries
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track all your active and past deliveries</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: deliveries.length, color: "text-gray-700 dark:text-gray-200", bg: "bg-gray-100 dark:bg-gray-800" },
          { label: "In Transit", value: deliveries.filter(d => d.status === "IN_TRANSIT").length, color: "text-orange-700", bg: "bg-orange-50 dark:bg-orange-900/20" },
          { label: "Pending", value: deliveries.filter(d => d.status === "PENDING").length, color: "text-yellow-700", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
          { label: "Delivered", value: deliveries.filter(d => d.status === "DELIVERED").length, color: "text-green-700", bg: "bg-green-50 dark:bg-green-900/20" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className={`border-0 shadow-md ${s.bg}`}>
              <CardContent className="p-4 text-center">
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {deliveries.map((delivery, i) => {
          const cfg = statusConfig[delivery.status] ?? statusConfig.PENDING;
          const StatusIcon = cfg.icon;
          return (
            <motion.div
              key={delivery.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono font-bold text-gray-400">{delivery.id}</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${cfg.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-lg font-bold mb-1">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        {delivery.from}
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        {delivery.to}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Package className="h-3.5 w-3.5" />
                          {delivery.package} • {delivery.weight}
                        </span>
                        <span>From: {delivery.sender}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          ETA: {delivery.eta}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-xl font-bold text-teal-700 dark:text-teal-400">₹{delivery.price}</p>
                      <Link href={`/tracking/${delivery.id}`} id={`track-btn-${delivery.id}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          Track Live <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
