"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Package, MapPin, Train, Shield, Clock, 
  CheckCircle, ArrowRight, Phone, MessageSquare, 
  Map as MapIcon, Navigation, Info, ChevronRight,
  User, IndianRupee, Star, Plus, Loader2, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { updateDeliveryStatus, sendMessage } from "@/lib/actions";
import { useToast } from "@/components/toast-provider";

export default function TrackingDetailPage({ params }: { params: { id: string } }) {
  const [delivery, setDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"map" | "chat" | "details">("map");
  const [otpInput, setOtpInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const fetchDelivery = async () => {
    try {
      const res = await fetch(`/api/deliveries/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDelivery(data);
    } catch (err) {
      console.error(err);
      toast("Error loading delivery details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelivery();
    // Poll for status updates
    const timer = setInterval(fetchDelivery, 5000);
    return () => clearInterval(timer);
  }, [params.id]);

  const handleUpdateStatus = async (status: string) => {
    try {
      setIsSending(true);
      await updateDeliveryStatus(params.id, status, otpInput);
      toast(`✅ Status updated to ${status}!`, "success");
      setOtpInput("");
      fetchDelivery();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    try {
      setIsSending(true);
      const receiverId = delivery.travelerId === delivery.traveler.id ? delivery.sender.id : delivery.traveler.id;
      await sendMessage(params.id, messageInput, receiverId);
      setMessageInput("");
      fetchDelivery();
    } catch (err: any) {
      toast("Failed to send message", "error");
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
            <span className="font-bold text-teal-600">Track #{delivery.id.slice(-6)}</span>
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

          {/* Map Simulation */}
          {activeTab === "map" && (
            <Card className="border-0 shadow-2xl overflow-hidden relative min-h-[450px]">
              <div className="absolute inset-0 bg-[#f8f9fa] dark:bg-[#1a1c1e] bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white/20 dark:bg-black/20 backdrop-blur-sm">
                <p className="text-lg font-bold text-teal-800 dark:text-teal-200 mb-2">{delivery.package.fromCity} → {delivery.package.toCity}</p>
                <Badge variant="secondary" className="mb-4">In Transit</Badge>
                <div className="w-full max-w-sm h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden relative">
                   <motion.div 
                     className="h-full bg-teal-500" 
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     transition={{ duration: 1 }}
                   />
                   <div className="absolute top-1/2 left-[50%] -translate-y-1/2 -translate-x-1/2 h-4 w-4 bg-white border-2 border-teal-600 rounded-full shadow-lg" />
                </div>
                <p className="text-xs text-gray-500 mt-4">Simulated GPS Tracking Active</p>
              </div>
            </Card>
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
                {delivery.messages.map((msg: any) => (
                   <div key={msg.id} className={`flex ${msg.senderId === delivery.traveler.id ? "justify-start" : "justify-end"}`}>
                     <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm border ${msg.senderId === delivery.traveler.id ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-800 rounded-tl-none" : "bg-teal-600 text-white border-teal-500 rounded-tr-none"}`}>
                       <p className="text-sm">{msg.content}</p>
                       <p className={`text-[10px] mt-2 ${msg.senderId === delivery.traveler.id ? "text-gray-400" : "text-teal-100"}`}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                     </div>
                   </div>
                ))}
              </div>

              <div className="p-4 border-t dark:border-gray-800 flex gap-2">
                <Input 
                  placeholder="Type a message..." 
                  className="rounded-xl" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button size="icon" className="rounded-xl flex-shrink-0" onClick={handleSendMessage} disabled={isSending}>
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </Card>
          )}

          {/* Detailed Info */}
          {activeTab === "details" && (
            <Card className="border-0 shadow-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">Shipment Progress</h3>
                  <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
                    {["PENDING", "ACCEPTED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"].map((step, i) => {
                      const isActive = delivery.status === step;
                      const isCompleted = progress > (i * 20 + 20);
                      return (
                        <div key={i} className="relative">
                          <div className={`absolute -left-8 top-1 h-6 w-6 rounded-full border-4 border-white dark:border-gray-900 z-10 flex items-center justify-center ${
                            isCompleted ? "bg-teal-500" : isActive ? "bg-orange-500 animate-pulse" : "bg-gray-300 dark:bg-gray-700"
                          }`}>
                            {isCompleted && <CheckCircle className="h-3 w-3 text-white" />}
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${!isActive && !isCompleted ? "text-gray-400" : ""}`}>{step.replace("_", " ")}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">Order Specs</h3>
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Weight</span>
                      <span className="text-xs font-bold">{delivery.package.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Price</span>
                      <span className="text-xs font-bold text-teal-600">₹{delivery.price}</span>
                    </div>
                    <div className="pt-2 border-t border-dashed border-gray-300 dark:border-gray-700">
                      <p className="text-[10px] text-gray-500 italic">&ldquo;{delivery.package.description}&rdquo;</p>
                    </div>
                  </div>
                </div>
              </div>
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
                  <p className="text-[10px] uppercase tracking-wider text-teal-100">Earnings</p>
                </div>
              </div>
              <Progress value={progress} className="h-2 mt-4 bg-teal-800/50" />
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Traveler Status Controls */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-500" />
                    Security Controls
                  </h3>
                </div>
                
                {delivery.status === "ACCEPTED" && (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">Provide Pickup OTP to traveler to start delivery.</p>
                    <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/30 text-center">
                       <p className="text-xs text-teal-600 mb-1">PICKUP OTP</p>
                       <p className="text-2xl font-black tracking-[0.5em] text-teal-700">{delivery.pickupOtp}</p>
                    </div>
                  </div>
                )}

                {delivery.status === "ACCEPTED" && (
                  <div className="space-y-3 pt-4 border-t dark:border-gray-800 mt-4">
                    <p className="text-xs font-bold uppercase text-gray-400">Traveler Controls</p>
                    <Input 
                      placeholder="Enter Pickup OTP" 
                      value={otpInput} 
                      onChange={(e) => setOtpInput(e.target.value)} 
                    />
                    <Button 
                      className="w-full bg-teal-600 hover:bg-teal-700 h-10" 
                      onClick={() => handleUpdateStatus("PICKED_UP")}
                      disabled={isSending}
                    >
                      {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Pickup & Start"}
                    </Button>
                  </div>
                )}

                {(delivery.status === "PICKED_UP" || delivery.status === "IN_TRANSIT") && (
                   <div className="space-y-3">
                      <Button className="w-full bg-orange-600 h-10" onClick={() => handleUpdateStatus("IN_TRANSIT")}>Mark as In Transit</Button>
                      <Input placeholder="Enter Delivery OTP from Sender" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} />
                      <Button className="w-full bg-green-600 h-10" onClick={() => handleUpdateStatus("DELIVERED")}>Complete Delivery</Button>
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
