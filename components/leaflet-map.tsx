"use client";

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";

// Fix for default Leaflet icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Traveler Icon (Lucide-inspired)
const travelerIcon = L.divIcon({
  className: "custom-traveler-icon",
  html: `<div style="background-color: #14b8a6; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; display: flex; items-center; justify-center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

interface LeafletMapProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  travelerPos: { lat: number; lng: number };
}

// Helper to auto-center and bounds
function MapAutoRefresher({ travelerPos }: { travelerPos: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(travelerPos, map.getZoom());
  }, [travelerPos, map]);
  return null;
}

export default function LeafletMap({ origin, destination, travelerPos }: LeafletMapProps) {
  const originArr: [number, number] = [origin.lat, origin.lng];
  const destArr: [number, number] = [destination.lat, destination.lng];
  const travelerArr: [number, number] = [travelerPos.lat, travelerPos.lng];

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl">
      <MapContainer 
        center={travelerArr} 
        zoom={6} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Origin */}
        <Marker position={originArr}>
        </Marker>

        {/* Destination */}
        <Marker position={destArr}>
        </Marker>

        {/* Path */}
        <Polyline 
          positions={[originArr, destArr]} 
          pathOptions={{ color: "#2dd4bf", weight: 4, opacity: 0.6, dashArray: "10, 10" }} 
        />

        {/* Traveler Live Position */}
        <Marker position={travelerArr} icon={travelerIcon}>
        </Marker>

        <MapAutoRefresher travelerPos={travelerArr} />
      </MapContainer>
    </div>
  );
}
