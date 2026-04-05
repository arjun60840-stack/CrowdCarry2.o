"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, Search, MessageSquare, Mail,
  Phone, ChevronDown, ChevronUp, Send,
  CheckCircle, Shield, IndianRupee, Package,
  Train, AlertTriangle, Loader2, Bot, User,
  FileText, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    category: "Getting Started",
    icon: Star,
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    questions: [
      {
        q: "How do I start earning as a traveler on CrowdCarry?",
        a: "Sign up, verify your Aadhaar, then post your upcoming trips with your route, date, and available luggage capacity. Senders in your area will request to match with you. Accept requests, pick up packages, and earn money after verified delivery!"
      },
      {
        q: "How does the matching system work?",
        a: "Our AI matching engine compares your trip route with open package requests. It calculates a Match Score based on route overlap, timing, capacity, and trust scores. Higher match scores mean more earnings and faster approvals."
      },
      {
        q: "Is CrowdCarry safe to use?",
        a: "Yes! We verify all users via Aadhaar, maintain Trust Scores based on delivery history, use OTP-based handover verification, and offer buyer protection on all insured packages. We also have a dedicated safety support team."
      },
    ]
  },
  {
    category: "Payments & Earnings",
    icon: IndianRupee,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
    questions: [
      {
        q: "When do I get paid after a delivery?",
        a: "Payment is released to your UPI/bank account within 2 hours of the recipient confirming delivery via OTP. You can track earnings in real-time on the Earnings page."
      },
      {
        q: "What are the platform fees?",
        a: "CrowdCarry charges a 10% platform fee on each completed delivery. This covers insurance, support, and the trust verification system. There are no hidden charges or subscription fees."
      },
      {
        q: "How do I withdraw my earnings?",
        a: "Go to your Earnings page and tap 'Withdraw to UPI'. Withdrawals process instantly to registered UPI IDs. Bank transfers take 1-2 business days."
      },
    ]
  },
  {
    category: "Packages & Delivery",
    icon: Package,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    questions: [
      {
        q: "What items are allowed to be sent?",
        a: "You can send everyday items like clothes, documents, electronics, food, and gifts. Prohibited items include cash, illegal goods, explosives, liquids over 500ml, and animals. Always declare contents honestly."
      },
      {
        q: "What if a package is lost or damaged?",
        a: "CrowdCarry provides insurance coverage up to ₹5,000 for all standard deliveries, and up to ₹25,000 for premium insured packages. File a claim through the app within 24 hours of delivery for fastest resolution."
      },
      {
        q: "How is the handover process verified?",
        a: "Each delivery uses a unique 4-digit OTP system. The sender shares the pickup OTP with the traveler, and the recipient shares the delivery OTP. Both must be correctly entered to mark a delivery as complete and release payment."
      },
    ]
  },
  {
    category: "Account & Verification",
    icon: Shield,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    questions: [
      {
        q: "How do I verify my Aadhaar?",
        a: "Go to Profile > Identity Badges > Verify Aadhaar. Enter your 12-digit Aadhaar number and OTP sent to your registered mobile. Verification typically takes under 2 minutes and is encrypted end-to-end."
      },
      {
        q: "What is the Trust Score and how do I improve it?",
        a: "Your Trust Score (0-100) reflects your reliability. It improves with successful deliveries, positive reviews, on-time pickups, complete profile, and verified identity badges. A higher score means better package matching and higher earning potential."
      },
    ]
  },
];

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  time: string;
};

const botReplies: Record<string, string> = {
  default: "Thanks for reaching out! Our support team will respond within 2 hours. For urgent matters, please call +91 1800-CARRY-00.",
  payment: "For payment issues, please check the Earnings tab first. If the issue persists, we'll resolve it within 4 business hours. Please share your transaction ID.",
  damaged: "We're sorry to hear about package damage! Please file a claim via Profile > My Deliveries > [Delivery ID] > Report Issue. You'll hear back within 24 hours.",
  verify: "Aadhaar verification issues are usually resolved by retrying after 30 minutes. If it still fails, our team can manually verify you within 1 business day.",
  refund: "Refund requests are processed within 3-5 business days. Please share the delivery ID and reason and we'll expedite your case.",
  cancel: "Trip or package cancellations can be done from the Dashboard. Cancellations made 2+ hours before pickup incur no penalty. After that, a small fee may apply.",
};

function getBotReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("pay") || lower.includes("earn") || lower.includes("money") || lower.includes("upi")) return botReplies.payment;
  if (lower.includes("damage") || lower.includes("lost") || lower.includes("broken") || lower.includes("missing")) return botReplies.damaged;
  if (lower.includes("verify") || lower.includes("aadhaar") || lower.includes("kyc")) return botReplies.verify;
  if (lower.includes("refund")) return botReplies.refund;
  if (lower.includes("cancel") || lower.includes("cancell")) return botReplies.cancel;
  return botReplies.default;
}

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "bot",
      text: "👋 Hi! I'm CrowdCarry's support assistant. To help you better, could you please start by telling me your name?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatStep, setChatStep] = useState<"name" | "phone" | "issue" | "resolve">("name");
  const [userData, setUserData] = useState({ name: "", phone: "", issue: "" });
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 500));
    setIsTyping(false);

    let botText = "";
    if (chatStep === "name") {
      setUserData(prev => ({ ...prev, name: userMsg.text }));
      botText = `Nice to meet you, ${userMsg.text}! Could you please share your registered mobile number?`;
      setChatStep("phone");
    } else if (chatStep === "phone") {
      setUserData(prev => ({ ...prev, phone: userMsg.text }));
      botText = "Got it. Now, please describe your issue or what you need help with.";
      setChatStep("issue");
    } else if (chatStep === "issue") {
      setUserData(prev => ({ ...prev, issue: userMsg.text }));
      const resolution = getBotReply(userMsg.text);
      botText = `Thanks for the details. ${resolution}\n\nI have logged your request under ticket #${Math.floor(Math.random() * 100000)}. Our team will call you at ${userMsg.text.match(/\d+/) ? userMsg.text : userData.phone} if needed.`;
      setChatStep("resolve");
    } else {
      botText = "Is there anything else I can help you with today?";
    }

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "bot",
      text: botText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setContactLoading(false);
    setContactSent(true);
  };

  const filteredFaqs = faqs.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        !search ||
        q.q.toLowerCase().includes(search.toLowerCase()) ||
        q.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => !search || cat.questions.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-2xl shadow-teal-500/30 mb-6">
          <HelpCircle className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-black mb-3">Help Center</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
          Find answers, chat with support, or send us a message. We&apos;re here 24/7.
        </p>
        {/* Search */}
        <div className="relative max-w-lg mx-auto mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search help articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 rounded-2xl text-base shadow-lg"
            id="help-search"
          />
        </div>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { icon: IndianRupee, label: "Payments", color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
          { icon: Package, label: "Deliveries", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
          { icon: Shield, label: "Safety", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
          { icon: FileText, label: "Policies", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSearch(item.label)}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl ${item.bg} border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg`}
              id={`quick-link-${item.label.toLowerCase()}`}
            >
              <Icon className={`h-7 w-7 ${item.color}`} />
              <span className="font-semibold text-sm">{item.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          {filteredFaqs.map((cat, ci) => {
            const CatIcon = cat.icon;
            return (
              <motion.div
                key={ci}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.1 }}
              >
                <div className={`flex items-center gap-3 p-3 rounded-xl ${cat.bg} mb-3`}>
                  <CatIcon className={`h-5 w-5 ${cat.color}`} />
                  <span className="font-bold text-sm">{cat.category}</span>
                </div>
                <div className="space-y-2">
                  {cat.questions.map((item, qi) => {
                    const key = `${ci}-${qi}`;
                    const isOpen = openFaq === key;
                    return (
                      <Card key={qi} className="border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <button
                          className="w-full text-left p-5 flex items-center justify-between gap-4"
                          onClick={() => setOpenFaq(isOpen ? null : key)}
                          id={`faq-${ci}-${qi}`}
                        >
                          <span className="font-semibold text-sm leading-snug">{item.q}</span>
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3 leading-relaxed">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No results for &ldquo;{search}&rdquo;. Try the live chat below!</p>
              <Button variant="outline" className="mt-4" onClick={() => setSearch("")}>Clear Search</Button>
            </div>
          )}
        </div>

        {/* Right Panel: Chat + Contact */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Chat */}
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-800 text-white pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-5 w-5" />
                Live Support Chat
                <Badge className="ml-auto bg-green-400/20 text-green-200 border-green-400/30 text-[10px]">● Online</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-72 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "bot" ? "bg-teal-600" : "bg-gray-200 dark:bg-gray-700"}`}>
                      {msg.role === "bot" ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "bot"
                        ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm"
                        : "bg-teal-600 text-white"
                    }`}>
                      {msg.text}
                      <div className={`text-[9px] mt-1 opacity-60`}>{msg.time}</div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="h-7 w-7 rounded-full bg-teal-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl px-3 py-2 shadow-sm">
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-gray-400"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              {/* Input */}
              <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                  className="rounded-xl text-sm"
                  id="chat-input"
                />
                <Button
                  size="sm"
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || isTyping}
                  className="rounded-xl px-3"
                  id="chat-send-btn"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-teal-600" />
                Send a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contactSent ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-6"
                >
                  <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg">Message Sent!</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    We&apos;ll reply to {contactForm.email} within 2 hours.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => { setContactSent(false); setContactForm({ name: "", email: "", message: "" }); }}
                  >
                    Send Another
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Your Name</label>
                      <Input
                        placeholder="Rahul Sharma"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        id="contact-name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Email</label>
                      <Input
                        type="email"
                        placeholder="you@email.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        id="contact-email"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Message</label>
                    <textarea
                      placeholder="Describe your issue in detail..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      rows={4}
                      className="flex w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                      id="contact-message"
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={contactLoading} id="contact-submit-btn">
                    {contactLoading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="h-4 w-4" /> Send Message</>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-5 space-y-3">
              <p className="font-bold text-sm">Other ways to reach us</p>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4 text-teal-600 flex-shrink-0" />
                <span>+91 1800-CARRY-00 <span className="text-xs text-gray-400">(Free, 24/7)</span></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 text-teal-600 flex-shrink-0" />
                <span>support@crowdcarry.in</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <MessageSquare className="h-4 w-4 text-teal-600 flex-shrink-0" />
                <span>Avg. response time: <strong className="text-teal-600">2 hours</strong></span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
