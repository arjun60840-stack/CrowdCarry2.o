"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Dynamically import the Leaflet Map to avoid SSR errors
const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[450px] bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse flex items-center justify-center">
      <p className="text-gray-400 font-bold">Initializing Tracking Map...</p>
    </div>
  ),
});

interface TrackingMapProps {
  fromCity: string;
  toCity: string;
  progress: number; // 0-100
}

// Fallback coordinate lookup for common Indian cities
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "Delhi": { lat: 28.6139, lng: 77.2090 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Agra": { lat: 27.1767, lng: 78.0081 },
};

export default function TrackingMap({ fromCity, toCity, progress }: TrackingMapProps) {
  const origin = useMemo(() => cityCoordinates[fromCity] || cityCoordinates["Delhi"], [fromCity]);
  const destination = useMemo(() => cityCoordinates[toCity] || cityCoordinates["Jaipur"], [toCity]);

  // Calculate current traveler position based on progress
  const travelerPos = useMemo(() => {
    const lat = origin.lat + (destination.lat - origin.lat) * (progress / 100);
    const lng = origin.lng + (destination.lng - origin.lng) * (progress / 100);
    return { lat, lng };
  }, [origin, destination, progress]);

  return (
    <div className="w-full h-full min-h-[450px] relative">
      <div className="absolute top-4 left-4 z-[1000] px-4 py-2 bg-teal-600/90 backdrop-blur-md text-white rounded-xl text-[10px] uppercase tracking-widest font-black shadow-lg flex items-center gap-2 border border-white/20">
        <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        Live GPS Tracking
      </div>
      
      <LeafletMap 
        origin={origin} 
        destination={destination} 
        travelerPos={travelerPos} 
      />
    </div>
  );
}
