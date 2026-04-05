"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Phone, Mail, ArrowRight, Package, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp" | "role">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (phone.length === 10) {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/auth/otp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });
        const data = await res.json();
        if (data.success) {
          setStep("otp");
        } else {
          setError(data.error || "Failed to send OTP");
        }
      } catch (err) {
        setError("Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length === 4) {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/auth/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, otp }),
        });
        const data = await res.json();
        if (data.success) {
          setStep("role");
        } else {
          setError(data.error || "Invalid OTP");
        }
      } catch (err) {
        setError("Verification failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleComplete = async () => {
    if (selectedRole) {
      setLoading(true);
      try {
        // Call NextAuth signIn with credentials provider
        await signIn("credentials", {
          phone,
          otp,
          role: selectedRole,
          redirect: true,
          callbackUrl: "/dashboard",
        });
      } catch (err) {
        console.error("Login failed:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg shadow-teal-500/30">
              <Package className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-2xl">
              {step === "phone" && "Welcome to CrowdCarry"}
              {step === "otp" && "Verify Your Phone"}
              {step === "role" && "Choose Your Role"}
            </CardTitle>
            <CardDescription>
              {step === "phone" && "Login with your phone number to get started"}
              {step === "otp" && `Enter the 4-digit OTP sent to +91 ${phone}`}
              {step === "role" && "How do you want to use CrowdCarry?"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs text-center animate-shake">
                {error}
              </div>
            )}
            {step === "phone" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-20"
                    maxLength={10}
                  />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-400 border-r border-gray-100 dark:border-gray-800 pr-2">
                    +91
                  </span>
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={phone.length < 10 || loading}
                  className="w-full gap-2"
                >
                  {loading ? "Sending..." : "Send OTP"}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                      or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => signIn("google")}
                >
                  <Mail className="h-4 w-4" />
                  Sign in with Google
                </Button>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                  <Lock className="h-3 w-3 inline mr-1" />
                  Demo mode: Enter any 10-digit number, any 4-digit OTP
                </p>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={otp[i] || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        const newOtp = otp.split("");
                        newOtp[i] = val;
                        setOtp(newOtp.join("").slice(0, 4));
                        // Auto-focus next
                        if (val && i < 3) {
                          const next = e.target.parentElement?.children[i + 1] as HTMLInputElement;
                          next?.focus();
                        }
                      }}
                      className="h-14 w-14 rounded-xl border-2 border-gray-200 bg-white text-center text-2xl font-bold focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white transition-all"
                    />
                  ))}
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  disabled={otp.length < 4 || loading}
                  className="w-full gap-2"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                  <Shield className="h-4 w-4" />
                </Button>

                <button
                  onClick={() => setStep("phone")}
                  className="w-full text-center text-sm text-teal-600 hover:underline dark:text-teal-400"
                >
                  ← Change phone number
                </button>
              </motion.div>
            )}

            {step === "role" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {[
                  {
                    role: "TRAVELER",
                    title: "🚂 Traveler",
                    desc: "I travel regularly and want to earn by carrying packages",
                  },
                  {
                    role: "SENDER",
                    title: "📦 Sender",
                    desc: "I want to send packages affordably via travelers",
                  },
                  {
                    role: "BOTH",
                    title: "🔄 Both",
                    desc: "I want to both send and carry packages",
                  },
                ].map((option) => (
                  <button
                    key={option.role}
                    onClick={() => setSelectedRole(option.role)}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                      selectedRole === option.role
                        ? "border-teal-500 bg-teal-50 dark:border-teal-400 dark:bg-teal-900/20"
                        : "border-gray-200 hover:border-teal-300 dark:border-gray-700 dark:hover:border-teal-600"
                    }`}
                  >
                    <p className="font-semibold">{option.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {option.desc}
                    </p>
                  </button>
                ))}

                <Button
                  onClick={handleComplete}
                  disabled={!selectedRole}
                  className="w-full gap-2 mt-2"
                >
                  Continue to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Step indicator */}
            <div className="flex justify-center gap-2 pt-2">
              {["phone", "otp", "role"].map((s, i) => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all ${
                    s === step ? "w-8 bg-teal-500" : "w-2 bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
