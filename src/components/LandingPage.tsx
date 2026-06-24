import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  ArrowUpRight, 
  Zap, 
  Cpu, 
  Compass,
  CheckCircle2,
  Lock
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (view: string) => void;
  darkMode: boolean;
}

export default function LandingPage({ onNavigate, darkMode }: LandingPageProps) {
  // Testimonials
  const successSwaps = [
    {
      name: "Sarah & Alex",
      skills: "Python ⇄ Figma UX",
      quote: "No payments or tokens. Just real knowledge exchange. Sarah debugged my ML models in return for structured wireframing tutorials. Incredible!"
    },
    {
      name: "Elena & Devon",
      skills: "Agile PM ⇄ React Frontend",
      quote: "As a product manager, I desperately wanted to learn react to understand my devs. Devon taught me hooks, and I guided his startup roadmap. Highly recommended!"
    }
  ];

  const features = [
    {
      title: "Interactive Skill Marketplace",
      description: "Search and filter skills by detailed category tags, expertise depth (Beginner to Advanced), and user reputations.",
      icon: Compass,
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "AI Connections Matcher",
      description: "Our server-side Gemini intelligence analyses learning patterns to recommend ideal local mentors and career plans.",
      icon: Cpu,
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Encrypted Peer Chat",
      description: "Direct real-time conversations to negotiate trading schedules, review deliverables, and arrange swap sessions.",
      icon: MessageSquare,
      color: "from-pink-500 to-purple-500"
    },
    {
      title: "Reputation & Badges",
      description: "Earn experience points (XP) and unlock verified badges as you help others, raising your search authority tier.",
      icon: Award,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden ${darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-slate-50 text-slate-800"}`}>
      
      {/* Decorative Blur Background Circles */}
      <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[10%] w-[450px] h-[450px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] animate-float-slow" />
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] animate-float-reverse" />
        <div className="absolute bottom-[0%] left-[30%] w-[350px] h-[350px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 z-10">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-8 max-w-4xl mx-auto pt-8 md:pt-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs font-semibold text-indigo-400"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>The Peer-to-Peer Peer Education Movement</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-display font-bold tracking-tight leading-tight text-white"
          >
            Trade Your <span className="text-indigo-400 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Expertise</span>.<br />
            Learn Any Skill. <span className="relative">Zero Cost.<span className="absolute left-0 bottom-0.5 h-1.5 w-full bg-indigo-500/20 rounded-md"></span></span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-base sm:text-xl max-w-2xl mx-auto leading-relaxed ${darkMode ? "text-neutral-400" : "text-slate-600"}`}
          >
            SkillSwap AI is a modern full-stack ecosystem where passionate creators teach what they master in exchange for what they wish to learn. Handshake swaps, personalized by Gemini.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => onNavigate("register")}
              id="hero-register-btn"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Start Swapping Now
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate("login")}
              id="hero-login-btn"
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border font-medium transition-all hover:scale-[1.02] cursor-pointer ${
                darkMode 
                  ? "border-white/10 bg-white/5 hover:bg-white/10 text-white" 
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              Sign In to Dashboard
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        {/* METRICS COUNTER GRID */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-20 p-8 rounded-3xl border border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-white/5 backdrop-blur-md text-center"
        >
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-bold font-display text-indigo-400">12,400+</h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium uppercase tracking-wider">Active Swappers</p>
          </div>
          <div className="space-y-1 border-l border-slate-200 dark:border-white/5">
            <h3 className="text-3xl md:text-4xl font-bold font-display text-purple-400">4,250+</h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium uppercase tracking-wider">Skills Cataloged</p>
          </div>
          <div className="space-y-1 border-l border-slate-200 dark:border-white/5">
            <h3 className="text-3xl md:text-4xl font-bold font-display text-indigo-400">9,800+</h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium uppercase tracking-wider">Swaps Handshaked</p>
          </div>
          <div className="space-y-1 border-l border-slate-200 dark:border-white/5">
            <h3 className="text-3xl md:text-4xl font-bold font-display text-purple-400">100%</h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 font-medium uppercase tracking-wider">Free Peer Trade</p>
          </div>
        </motion.div>

        {/* INTERACTIVE COMPONENT GRID - THE "HOW IT WORKS" BENTO GRID */}
        <div className="mt-28 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-display font-bold">Comprehensive Capabilities</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">Everything you need to trade skills, connect with world-class mentors, and secure progress.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    darkMode 
                      ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-indigo-500/30" 
                      : "bg-white border-slate-100 hover:bg-white/80 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100"
                  }`}
                >
                  <div className="space-y-4">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white shadow`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-semibold text-base">{feat.title}</h3>
                    <p className={`text-xs leading-relaxed ${darkMode ? "text-neutral-400" : "text-slate-600"}`}>
                      {feat.description}
                    </p>
                  </div>
                  <div className="pt-6 flex items-center gap-1.5 text-xs text-indigo-400 font-semibold group cursor-pointer">
                    <span>Learn More</span>
                    <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* GEMINI AI HIGHLIGHT SECTION */}
        <div className="mt-28 p-8 md:p-12 rounded-3xl border border-slate-200/50 dark:border-white/5 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-slate-500/0 dark:from-indigo-500/5 dark:via-purple-500/2 dark:to-transparent">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
                <Zap className="h-3.5 w-3.5" />
                <span>Gemini Engine Active</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-display font-bold leading-tight">
                AI Matchmaking & Learning Advisory
              </h2>
              <p className={`text-sm md:text-base leading-relaxed ${darkMode ? "text-neutral-400" : "text-slate-600"}`}>
                Don't waste time hunting. SkillSwap AI utilizes server-side intelligence to analyze your skills offered, goals, and core passions. We structure career recommendation maps and suggest precise platform peers to swap with.
              </p>
              
              <ul className="space-y-3">
                {[
                  "Personalized career roadmaps based on skill overlaps",
                  "Peers suggested based on reciprocal teach-and-learn criteria",
                  "Customized daily study checklists",
                  "Skill development level tracking and peer authority verification"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-neutral-300">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-6 rounded-2xl border ${darkMode ? "bg-neutral-900 border-white/5" : "bg-white border-slate-100 shadow-md"} space-y-4`}>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
                <span className="text-xs font-semibold text-slate-400">AI AGENT RECRUITER</span>
                <span className="text-[10px] bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-full font-bold">RECOMMENDATION ENGINE</span>
              </div>
              <p className="text-xs font-medium italic text-indigo-400">"Blending Sarah's advanced Python ML background with Figma UI/UX..."</p>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
                  <p className="font-semibold mb-1">Recommended Role: AI UX Architect</p>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400">Bridge the gap between complex model layers and delightful human-centered web design systems.</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl">
                  <p className="font-semibold mb-1">Best Match Swap Suggestion</p>
                  <p className="text-[11px] text-slate-500 dark:text-neutral-400">Connect with Alex Rivera (UI/UX lead) who wants to learn Python scripting for automation.</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate("register")}
                className="w-full py-2.5 text-center text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20"
              >
                Access Personalized Recommendations
              </button>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS & REAL SWAPS */}
        <div className="mt-28 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-display font-bold">Peer Handshake Success Stories</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">How real users are accelerating their careers by skipping cash tuition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {successSwaps.map((sw, idx) => (
              <div 
                key={idx}
                className={`p-6 rounded-2xl border flex flex-col justify-between ${
                  darkMode ? "bg-white/5 border-white/5" : "bg-white border-slate-100 shadow-sm"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-indigo-400 font-display">{sw.name}</span>
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-mono font-bold">{sw.skills}</span>
                  </div>
                  <p className={`text-xs leading-relaxed italic ${darkMode ? "text-neutral-300" : "text-slate-600"}`}>
                    "{sw.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-1.5 pt-6 text-[10px] text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-indigo-400" />
                  <span>Verified Skill Swap Completion</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CALL TO ACTION */}
        <div className="mt-28 text-center space-y-8 max-w-3xl mx-auto p-12 rounded-3xl border border-indigo-500/15 bg-indigo-500/5 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-20%] w-[250px] h-[250px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-20%] w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl font-display font-bold tracking-tight text-white">Ready to Trade Your Knowledge?</h2>
          <p className={`text-sm max-w-md mx-auto ${darkMode ? "text-neutral-400" : "text-slate-600"}`}>
            Register in seconds, catalog what you teach, and search the global pool for matching skills immediately. No fees.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate("register")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-md shadow-indigo-600/20"
            >
              Sign Up Now
            </button>
            <button
              onClick={() => onNavigate("login")}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                darkMode ? "border-white/10 bg-white/5 text-neutral-300 hover:text-white" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              Have an Account? Log In
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
