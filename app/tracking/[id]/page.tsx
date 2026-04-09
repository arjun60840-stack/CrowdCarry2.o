"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Shield, Clock, 
  CheckCircle, 
  Map as MapIcon, MessageSquare, 
  Navigation, Info, ChevronRight,
  Loader2, Send, Package
} from "lucide-react";
import { useSession } from "next-auth/react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import TrackingMap from "@/components/tracking-map";
import { updateDeliveryStatus, sendMessage } from "@/lib/actions";
import { useToast } from "@/components/toast-provider";
import PackagePhotoUpload from "@/components/package-photo-upload";
import Image from "next/image";

interface TrackingDelivery {
  id: string;
  status: string;
  price: number;
  pickupOtp: string;
  deliveryOtp: string;
  travelerId: string;
  senderId: string;
  package: {
    fromCity: string;
    toCity: string;
    description: string;
    weight: number;
    imageUrl?: string;
  };
  traveler: {
    id: string;
    name: string;
    image?: string;
    trustScore: number;
    phone: string;
  };
  sender: {
    id: string;
    name: string;
    image?: string;
    trustScore: number;
    phone: string;
  };
  messages: Array<{
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
  }>;
  pickupImageUrl?: string;
  deliveryImageUrl?: string;
}

export default function TrackingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [delivery, setDelivery] = useState<TrackingDelivery | null>(null); 
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"map" | "chat" | "details">("map");
  const [otpInput, setOtpInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [statusImageUrl, setStatusImageUrl] = useState("");
  const { toast } = useToast();

  const currentUserId = session?.user?.id;
  const isTraveler = delivery && currentUserId === delivery.travelerId;
  const isSender = delivery && currentUserId === delivery.senderId;

  const fetchDelivery = async () => {
    try {
      const res = await fetch(`/api/deliveries/${id}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details || data.error || "Failed to load tracking data");
      }
      
      setDelivery(data);
    } catch (err) {
      console.error("Tracking Fetch Error:", err);
      const errorMessage = err instanceof Error ? err.message : "Error loading delivery details";
      toast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchDelivery();
    // Poll for status updates
    const timer = setInterval(fetchDelivery, 5000);
    return () => clearInterval(timer);
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    try {
      setIsSending(true);
      await updateDeliveryStatus(id, status, otpInput, statusImageUrl);
      toast(`✅ Status updated to ${status}!`, "success");
      setOtpInput("");
      setStatusImageUrl("");
      fetchDelivery();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast(errorMessage, "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !delivery || !currentUserId) return;
    try {
      setIsSending(true);
      // If current user is traveler, send to sender. Else send to traveler.
      const receiverId = isTraveler ? delivery.senderId : delivery.travelerId;
      await sendMessage(id, messageInput, receiverId);
      setMessageInput("");
      fetchDelivery();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      toast(errorMessage, "error");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Delivery Not Found</h2>
        <Link href="/dashboard" className="text-teal-600 underline">Return to Dashboard</Link>
      </div>
    );
  }

  const progress = 
    delivery.status === "PENDING" ? 10 : 
    delivery.status === "ACCEPTED" ? 30 : 
    delivery.status === "PICKED_UP" ? 50 : 
    delivery.status === "IN_TRANSIT" ? 80 : 
    delivery.status === "DELIVERED" ? 100 : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/dashboard" className="hover:text-teal-600 underline-offset-4 hover:underline">Dashboard</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-bold text-teal-600">Track #{id.slice(-6)}</span>
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Navigation className="h-8 w-8 text-teal-600 animate-pulse" />
            Live Tracking
          </h1>
        </div>
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-4 py-1.5 text-sm font-bold">
          {delivery.status.replace("_", " ")}
        </Badge>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tracking Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
            <button 
              onClick={() => setActiveTab("map")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "map" ? "bg-white dark:bg-gray-700 shadow-md text-teal-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <MapIcon className="h-4 w-4 inline mr-2" />
              Live Map
            </button>
            <button 
              onClick={() => setActiveTab("chat")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "chat" ? "bg-white dark:bg-gray-700 shadow-md text-teal-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Chat
            </button>
            <button 
              onClick={() => setActiveTab("details")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "details" ? "bg-white dark:bg-gray-700 shadow-md text-teal-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Info className="h-4 w-4 inline mr-2" />
              Details
            </button>
          </div>

          {/* Real Google Map Tracking */}
          {activeTab === "map" && (
            <div className="h-[450px] w-full">
              <TrackingMap 
                fromCity={delivery.package.fromCity}
                toCity={delivery.package.toCity}
                progress={progress}
              />
            </div>
          )}

          {/* Real Chat */}
          {activeTab === "chat" && (
            <Card className="border-0 shadow-xl overflow-hidden h-[450px] flex flex-col">
              <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
                    {delivery.traveler.name.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{delivery.traveler.name}</p>
                    <p className="text-[10px] text-green-600 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      Active Context
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950/50">
                {delivery.messages.map((msg: { id: string; senderId: string; content: string; createdAt: string }) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm border ${!isMe ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 rounded-tl-none" : "bg-teal-600 text-white border-teal-500 rounded-tr-none"}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-[10px] mt-2 ${!isMe ? "text-gray-400" : "text-teal-100"}`}>
                          {mounted ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "..."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t dark:border-gray-800 flex gap-2">
                <Input 
                  placeholder="Type a message..." 
                  className="rounded-xl" 
                  value={messageInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessageInput(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent) => e.key === "Enter" && handleSendMessage()}
                />
                <Button size="icon" className="rounded-xl flex-shrink-0" onClick={handleSendMessage} disabled={isSending}>
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </Card>
          )}

          {activeTab === "details" && (
            <Card className="border-0 shadow-xl overflow-hidden p-6 space-y-8">
              <div>
                <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-teal-700">
                  <Package className="h-5 w-5" />
                  Package Manifest
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</p>
                      <p className="text-sm font-semibold">{delivery.package.description}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Weight</p>
                        <p className="text-sm font-semibold">{delivery.package.weight} kg</p>
                      </div>
                      <div className="flex-1 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Route</p>
                        <p className="text-sm font-semibold text-teal-600">{delivery.package.fromCity} ➔ {delivery.package.toCity}</p>
                      </div>
                    </div>
                  </div>
                  
                  {delivery.package.imageUrl && (
                    <div className="relative aspect-square md:aspect-auto h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 dark:border-gray-800">
                      <Image 
                        src={delivery.package.imageUrl} 
                        alt="Initial Package Proof" 
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-md p-2 text-center">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Posted Photo</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {(delivery.pickupImageUrl || delivery.deliveryImageUrl) && (
                <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-orange-600">
                    <Shield className="h-5 w-5" />
                    Chain of Custody
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {delivery.pickupImageUrl ? (
                      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-teal-500/20">
                        <Image 
                          src={delivery.pickupImageUrl} 
                          alt="Pickup Proof" 
                          fill 
                          className="object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-teal-600/90 backdrop-blur-md p-2 text-center text-white">
                          <p className="text-[10px] font-black uppercase tracking-widest">Pickup Verified</p>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-4 text-center">
                        <Clock className="h-6 w-6 text-gray-300 mb-2" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Awaiting Pickup Proof</p>
                      </div>
                    )}

                    {delivery.deliveryImageUrl ? (
                      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-green-500/20">
                        <Image 
                          src={delivery.deliveryImageUrl} 
                          alt="Delivery Proof" 
                          fill 
                          className="object-cover"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-green-600/90 backdrop-blur-md p-2 text-center text-white">
                          <p className="text-[10px] font-black uppercase tracking-widest">Delivery Confirmed</p>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-4 text-center">
                        <Clock className="h-6 w-6 text-gray-300 mb-2" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Awaiting Delivery Proof</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar Status & Actions */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-teal-700 text-white pb-6">
              <CardTitle className="text-lg">Delivery Dashboard</CardTitle>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-3xl font-black">{progress}%</p>
                  <p className="text-[10px] uppercase tracking-wider text-teal-100">Progress</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₹{delivery.price}</p>
                  <p className="text-[10px] uppercase tracking-wider text-teal-100">{isTraveler ? "Earnings" : "Cost"}</p>
                </div>
              </div>
              <Progress value={progress} className="h-2 mt-4 bg-teal-800/50" />
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Security Controls */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-500" />
                    Security Controls
                  </h3>
                </div>
                
                {/* SENDER VIEW: Show OTPs to give to traveler */}
                {isSender && (
                  <div className="space-y-4">
                    {delivery.status === "ACCEPTED" && (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-500">Give this OTP to the traveler when they pick up the package.</p>
                        <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30 text-center">
                           <p className="text-xs text-teal-600 mb-1">PICKUP OTP</p>
                           <p className="text-2xl font-black tracking-[0.5em] text-teal-700">{delivery.pickupOtp}</p>
                        </div>
                      </div>
                    )}
                    {(delivery.status === "PICKED_UP" || delivery.status === "IN_TRANSIT") && (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-500">Give this OTP to the traveler only when the package is delivered.</p>
                        <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 text-center">
                           <p className="text-xs text-orange-600 mb-1">DELIVERY OTP</p>
                           <p className="text-2xl font-black tracking-[0.5em] text-orange-700">{delivery.deliveryOtp}</p>
                        </div>
                      </div>
                    )}
                    {delivery.status === "PENDING" && (
                       <p className="text-xs text-gray-400 italic">Waiting for traveler to accept...</p>
                    )}
                  </div>
                )}

                {/* TRAVELER VIEW: Show inputs to enter OTPs */}
                {isTraveler && (
                  <div className="space-y-4">
                    {delivery.status === "ACCEPTED" && (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-500">Enter the pickup OTP provided by the sender.</p>
                        <Input 
                          placeholder="Enter Pickup OTP" 
                          value={otpInput} 
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtpInput(e.target.value)} 
                        />
                        <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                          <p className="text-xs font-bold mb-3 uppercase tracking-wider text-gray-400">Pickup Photo Proof</p>
                          <PackagePhotoUpload 
                            value={statusImageUrl} 
                            onChange={(url) => setStatusImageUrl(url)}
                            onRemove={() => setStatusImageUrl("")}
                          />
                        </div>
                        <Button 
                          className="w-full bg-teal-600 hover:bg-teal-700 h-12 rounded-xl font-black gap-2 shadow-lg shadow-teal-500/20" 
                          onClick={() => handleUpdateStatus("PICKED_UP")}
                          disabled={isSending || !statusImageUrl}
                        >
                          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Pickup & Start"}
                        </Button>
                      </div>
                    )}

                    {delivery.status === "PICKED_UP" && (
                      <div className="space-y-3">
                         <p className="text-xs text-gray-500">You have picked up the package. Start transit when ready.</p>
                         <Button 
                          className="w-full bg-orange-600 hover:bg-orange-700 h-10" 
                          onClick={() => handleUpdateStatus("IN_TRANSIT")}
                          disabled={isSending}
                        >
                          Mark as In Transit
                        </Button>
                      </div>
                    )}

                    {delivery.status === "IN_TRANSIT" && (
                       <div className="space-y-3">
                          <p className="text-xs text-gray-500">Destination reached? Enter delivery OTP from recipient.</p>
                          <Input 
                            placeholder="Enter Delivery OTP" 
                            value={otpInput} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtpInput(e.target.value)} 
                          />
                          <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                            <p className="text-xs font-bold mb-3 uppercase tracking-wider text-gray-400">Delivery Photo Proof</p>
                            <PackagePhotoUpload 
                              value={statusImageUrl} 
                              onChange={(url) => setStatusImageUrl(url)}
                              onRemove={() => setStatusImageUrl("")}
                            />
                          </div>
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700 h-12 rounded-xl font-black gap-2 shadow-lg shadow-green-500/20" 
                            onClick={() => handleUpdateStatus("DELIVERED")}
                            disabled={isSending || !statusImageUrl}
                          >
                            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Complete Delivery"}
                          </Button>
                       </div>
                    )}
                  </div>
                )}

                {delivery.status === "DELIVERED" && (
                  <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-green-800">Delivered Successfully!</p>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-2">
                <p className="text-xs text-gray-400">Traveler: <strong>{delivery.traveler.name}</strong></p>
                <p className="text-xs text-gray-400">Sender: <strong>{delivery.sender.name}</strong></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
