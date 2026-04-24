"use client";

import { motion } from "framer-motion";
import { 
  IndianRupee, TrendingUp, ArrowUpRight, 
  ArrowDownLeft, Clock, History, Wallet, 
  CreditCard, ChevronRight, Download, Filter,
  ArrowRight, CheckCircle, Package, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EarningsPage() {
  const stats = [
    { label: "Total Earned", value: "₹12,450", sub: "+₹2,100 this month", icon: IndianRupee, color: "text-green-600" },
    { label: "Available for Payout", value: "₹1,850", sub: "Withdraw to UPI", icon: Wallet, color: "text-teal-600" },
    { label: "Completed Trips", value: "18", sub: "4.9★ Average Rating", icon: Package, color: "text-orange-500" },
    { label: "Pending Payouts", value: "₹450", sub: "Processing...", icon: Clock, color: "text-purple-500" },
  ];

  const transactions = [
    { id: "TXN-7890", type: "PAYOUT", amount: 405, status: "COMPLETED", date: "Today, 12:45 PM", desc: "Delivery #DEL-1234 Payout", method: "rahul@upi" },
    { id: "TXN-7889", type: "PAYOUT", amount: 750, status: "COMPLETED", date: "Mar 28, 2026", desc: "Delivery #DEL-1192 Payout", method: "rahul@upi" },
    { id: "TXN-7888", type: "REFUND", amount: 150, status: "FAILED", date: "Mar 25, 2026", desc: "Canceled Trip Refund", method: "Back to Wallet" },
    { id: "TXN-7887", type: "PAYOUT", amount: 940, status: "COMPLETED", date: "Mar 20, 2026", desc: "Delivery #DEL-1045 Payout", method: "rahul@upi" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gradient">Earnings & Payouts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your income and withdraw funds</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-xl">
            <Download className="h-4 w-4" />
            Statements
          </Button>
          <Button className="gap-2 rounded-xl shadow-teal-500/20 shadow-lg">
            <CreditCard className="h-4 w-4" />
            Instant Payout
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-bold">+12% vs LY</Badge>
                  </div>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</p>
                  <p className="text-[10px] text-green-600 mt-2 font-bold">{stat.sub}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Transaction History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="h-5 w-5 text-teal-600" />
              Recent Transactions
            </h2>
            <Button variant="ghost" size="sm" className="gap-1 text-teal-600">
              Filter <Filter className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-3">
            {transactions.map((txn, i) => (
              <motion.div
                key={txn.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:border-l-4 hover:border-l-teal-500 overflow-hidden">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center ${
                      txn.type === "PAYOUT" ? "bg-green-50 text-green-600 dark:bg-green-900/20" : "bg-red-50 text-red-600 dark:bg-red-900/20"
                    }`}>
                      {txn.type === "PAYOUT" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-sm">{txn.desc}</p>
                        <Badge variant={txn.status === "COMPLETED" ? "default" : "destructive"} className="text-[9px] px-1.5 py-0">
                          {txn.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 font-medium">Txn ID: {txn.id} • {txn.date}</p>
                      <p className="text-[10px] text-teal-600 mt-1 font-bold italic">via {txn.method}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-black text-lg ${txn.type === "PAYOUT" ? "text-green-600" : "text-red-500"}`}>
                        {txn.type === "PAYOUT" ? "+" : "-"} ₹{txn.amount}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <Button variant="outline" className="w-full h-12 rounded-xl text-gray-500 hover:text-teal-600 mt-4 border-dashed border-2">
            Load More Transactions
          </Button>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-teal-100 font-bold uppercase tracking-widest">Performance</p>
                  <p className="font-bold">Earning Growth</p>
                </div>
              </div>
              <p className="text-sm text-teal-50 mb-6 italic">
                You earned ₹2,100 more this month compared to February. Keep carrying high-urgency packages to boost daily income!
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span>Daily Avg</span>
                  <span className="font-bold">₹450</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white" 
                    initial={{ width: 0 }} 
                    animate={{ width: "75%" }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-500" />
                Safe Payouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
                <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Default UPI ID</p>
                  <p className="text-sm font-bold">rahul@okaxis</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto p-0 h-auto text-teal-600 text-[10px] font-bold">Edit</Button>
              </div>
              <p className="text-[10px] text-gray-400 text-center">
                All payouts are processed securely and instantly for verified travelers.
              </p>
              <Button className="w-full gap-2 rounded-xl" variant="outline">
                Manage Bank Accounts
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
