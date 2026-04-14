"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HeroSlide, 
  ProblemSlide, 
  SolutionSlide, 
  TechStackSlide, 
  RoadmapSlide 
} from "@/components/pitch/slide-components";
import { ChevronDown, ChevronUp, PlayCircle } from "lucide-react";
import Link from "next/link";

const slides = [
  { id: "hero", component: HeroSlide },
  { id: "problem", component: ProblemSlide },
  { id: "solution", component: SolutionSlide },
  { id: "tech", component: TechStackSlide },
  { id: "roadmap", component: RoadmapSlide },
];

export default function PitchDeckPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1 && !isScrolling) {
      setIsScrolling(true);
      setCurrentSlide(prev => prev + 1);
      setTimeout(() => setIsScrolling(false), 800);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0 && !isScrolling) {
      setIsScrolling(true);
      setCurrentSlide(prev => prev - 1);
      setTimeout(() => setIsScrolling(false), 800);
    }
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) nextSlide();
      else if (e.deltaY < 0) prevSlide();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") nextSlide();
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") prevSlide();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSlide, isScrolling]);

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-950 overflow-hidden z-[100]">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse-soft" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full animate-pulse-soft" />
      </div>

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-black group-hover:rotate-12 transition-transform shadow-lg shadow-teal-500/20">
            CC
          </div>
          <span className="font-black text-xl tracking-tighter">CrowdCarry</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="text-sm font-bold text-gray-500 hover:text-teal-600 transition-colors">Skip to Platform</button>
          </Link>
          <button className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-teal-500/20 hover:-translate-y-0.5 transition-all">
            <PlayCircle className="h-4 w-4" />
            Watch Trailer
          </button>
        </div>
      </div>

      {/* Main Slide Content */}
      <div ref={containerRef} className="relative h-full w-full flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full flex items-center justify-center"
          >
            <CurrentSlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(i)}
            className={`group relative flex items-center justify-end gap-4`}
          >
            <span className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${currentSlide === i ? "opacity-100 translate-x-0 text-teal-600" : "opacity-0 translate-x-4 text-gray-400 group-hover:opacity-50"}`}>
              {slide.id}
            </span>
            <div className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? "w-12 bg-teal-600 shadow-[0_0_15px_rgba(13,148,136,0.5)]" : "w-1.5 bg-gray-300 dark:bg-gray-800 group-hover:bg-gray-400"}`} />
          </button>
        ))}
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50">
        <div className="flex gap-2 mb-2">
            <button 
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`p-2 rounded-lg border transition-all ${currentSlide === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-teal-500 hover:text-white hover:border-teal-500"}`}
            >
                <ChevronUp className="h-5 w-5" />
            </button>
            <button 
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
                className={`p-2 rounded-lg border transition-all ${currentSlide === slides.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-teal-500 hover:text-white hover:border-teal-500"}`}
            >
                <ChevronDown className="h-5 w-5" />
            </button>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse-soft">
          Scroll or Use Arrow Keys
        </p>
      </div>

      {/* Progress Bar (Bottom) */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 dark:bg-gray-800 w-full z-50">
        <motion.div 
          className="h-full bg-teal-600"
          initial={{ width: "20%" }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </div>
  );
}
