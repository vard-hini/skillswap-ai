import React from "react";
import { motion } from "motion/react";
import { 
  Award, 
  Cpu, 
  MessageSquare, 
  Users, 
  ArrowUpRight, 
  CheckCircle, 
  Bell, 
  Sparkles, 
  TrendingUp, 
  Compass, 
  Plus,
  BookOpen,
  Calendar,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronRight
} from "lucide-react";
import { User, Match, Notification } from "../types";

interface DashboardProps {
  // User
  currentUser: User;

  // Navigation
  onNavigate: (view: string) => void;

  // Data
  matches: Match[];
  notifications: Notification[];
  availableMentorsCount: number;
  availableSkillsCount: number;

  // Actions
  onAcceptMatch: (matchId: string) => void;
  onRejectMatch: (matchId: string) => void;

  // UI
  darkMode: boolean;
}

export default function Dashboard({
  currentUser,
  onNavigate,
  matches,
  notifications,
  availableMentorsCount,
  availableSkillsCount,
  onAcceptMatch,
  onRejectMatch,
  darkMode
}: DashboardProps) {
  
  // XP Progress calculation
  const xpInCurrentLevel = currentUser.points % 150;
  const xpNeededForNextLevel = 150;
  const progressPercent = Math.min(100, Math.max(5, Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100)));

  // Filter relevant matches
  const activeMatches = matches.filter(
    m => (m.mentorId === currentUser.id || m.learnerId === currentUser.id) && m.status === "connected"
  );
  
  const pendingRequests = matches.filter(
    m => m.mentorId === currentUser.id && m.status === "pending"
  );

  const pendingSent = matches.filter(
    m => m.learnerId === currentUser.id && m.status === "pending"
  );

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative ${
      darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* Abstract Background Blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full font-semibold">Active Session</span>
              <span className="text-xs text-slate-400">Joined SkillSwap on {currentUser.joinedAt}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-display mt-1 flex items-center gap-2">
              Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{currentUser.name}</span>! 👋
            </h1>
            <p className={`text-xs mt-1 ${darkMode ? "text-neutral-400" : "text-slate-500"}`}>
              Your skill-sharing status is live. Match with local peers and swap competencies seamlessly.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate("marketplace")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/10 transition-all cursor-pointer"
            >
              <Compass className="h-4 w-4" />
              Explore Skills
            </button>
            <button
              onClick={() => onNavigate("recommendations")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                darkMode ? "border-white/5 bg-white/5 text-neutral-300 hover:text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="h-4 w-4 text-indigo-400" />
              AI Recommendations
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "XP Points", val: currentUser.points, suffix: " XP", sub: `Level ${currentUser.level} Swapper`, icon: Award, color: "text-amber-400 bg-amber-500/10" },
            { label: "Active Connections", val: activeMatches.length, suffix: " Partners", sub: "Handshakes completed", icon: Users, color: "text-purple-400 bg-purple-500/10" },
            { label: "Pending Swaps", val: pendingRequests.length, suffix: " Incoming", sub: "Needs your approval", icon: Cpu, color: "text-indigo-400 bg-indigo-500/10" },
            { label: "Exchange Inventory", val: availableSkillsCount, suffix: " Skills", sub: "Available to swap", icon: BookOpen, color: "text-blue-400 bg-blue-500/10" }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className={`p-6 rounded-2xl border ${
                  darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                    <h3 className="text-2xl font-bold font-display">{stat.val}{stat.suffix}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium">{stat.sub}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BENTO GRID: XP METER & MAIN SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Interactive Swaps & Skills list */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* XP progress bar */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
            }`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-semibold font-display">Level Up Tracker</span>
                </div>
                <span className="text-xs font-semibold text-slate-400">{xpInCurrentLevel} / {xpNeededForNextLevel} XP to Level {currentUser.level + 1}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden mb-2">
                <div 
                  className="bg-gradient-to-r from-indigo-400 to-purple-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400">Gain +30 points by completing swaps and +5 points for message swaps!</p>
            </div>

            {/* PENDING ACTIONS WIDGET */}
            {pendingRequests.length > 0 && (
              <div className="p-6 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 space-y-4">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
                  <h3 className="text-sm font-semibold font-display text-indigo-400 uppercase tracking-wider">Incoming Skill Swap Requests</h3>
                </div>
                
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div 
                      key={req.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        darkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-100"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-400">Requested Swap:</span>
                          <span className="text-xs font-bold text-indigo-400">{req.skillName}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                          Approve this request to activate the peer chat with your new swap student.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onAcceptMatch(req.id)}
                          id={`accept-match-${req.id}`}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => onRejectMatch(req.id)}
                          id={`reject-match-${req.id}`}
                          className="px-3.5 py-1.5 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <ThumbsDown className="h-3.5 w-3.5" /> Ignore
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MY INVENTORY OVERVIEW */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
            } space-y-4`}>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                <h3 className="font-display font-semibold text-base">My Active Swapping Skills</h3>
                <button 
                  onClick={() => onNavigate("profile")}
                  className="text-xs text-indigo-400 hover:underline font-medium flex items-center"
                >
                  Edit Profile <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Offering */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">I Am Teaching</p>
                  <div className="space-y-1.5">
                    {currentUser.skillsOffered.map((s, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs flex justify-between">
                        <span className="font-medium text-neutral-300">{s.name}</span>
                        <span className="text-[10px] uppercase font-bold text-indigo-400">{s.level}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desiring */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">I Am Learning</p>
                  <div className="space-y-1.5">
                    {currentUser.skillsWanted.map((s, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-xs flex justify-between">
                        <span className="font-medium text-neutral-300">{s.name}</span>
                        <span className="text-[10px] uppercase font-bold text-purple-400">{s.level}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* ACTIVE CONNECTIONS & CHATS LIST */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
            } space-y-4`}>
              <h3 className="font-display font-semibold text-base">My Handshaked Connections ({activeMatches.length})</h3>
              
              {activeMatches.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <p className="text-xs text-slate-400">You don't have any connected partners yet.</p>
                  <button 
                    onClick={() => onNavigate("mentors")}
                    className="text-xs text-indigo-400 hover:underline font-medium"
                  >
                    Match with potential partners now <ChevronRight className="h-3 w-3 inline-block" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeMatches.map((m) => {
                    const isMentor = m.mentorId === currentUser.id;
                    const partnerId = isMentor ? m.learnerId : m.mentorId;
                    return (
                      <div 
                        key={m.id}
                        onClick={() => onNavigate("chat")}
                        className={`p-4 rounded-xl border hover:border-indigo-500/50 transition-all cursor-pointer flex justify-between items-center ${
                          darkMode ? "bg-[#0a0a0a]/40 border-white/5 hover:bg-[#0a0a0a]" : "bg-slate-50/50 border-slate-200/60 hover:bg-white"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold">Swap Link:</span>
                            <span className="text-[10px] bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded font-bold">{m.skillName}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">Click to discuss swap dates in Chat</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Column 3: Sidebar alerts, achievements and AI quick stats */}
          <div className="space-y-6">
            
            {/* LATEST NOTIFICATIONS SUMMARY */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
            } space-y-4`}>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-1.5">
                  <Bell className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Notifications Log</span>
                </div>
                <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full font-bold">Live alerts</span>
              </div>

              <div className="space-y-3.5 max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.slice(0, 4).map((notif) => (
                  <div key={notif.id} className="text-xs space-y-1">
                    <p className="font-semibold text-slate-700 dark:text-neutral-200">{notif.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">{notif.message}</p>
                    <p className="text-[9px] text-slate-400">
                      {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-[11px] text-slate-400 italic text-center">No alerts in logs.</p>
                )}
              </div>
            </div>

            {/* MY UNLOCKED ACHIEVEMENTS BADGES */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
            } space-y-4`}>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-white/5">
                <h4 className="font-display font-semibold text-xs text-amber-500 uppercase tracking-wider">Skill Badges & Medals ({currentUser.badges.length})</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {currentUser.badges.map((badge) => (
                  <div 
                    key={badge.id}
                    className={`p-3 rounded-xl border text-center space-y-1.5 ${
                      darkMode ? "bg-[#0a0a0a]/40 border-white/5" : "bg-slate-50/50 border-slate-200/60"
                    }`}
                    title={badge.description}
                  >
                    <div className="mx-auto h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-tight">{badge.name}</p>
                      <p className="text-[9px] text-slate-400">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Career Advice quick teaser */}
            <div className="p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-transparent space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">AI Learning Tip</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-neutral-300 italic">
                "Based on your profile, combining python automation with UI/UX layout makes you a prime candidate for an AI Product Strategist role. Swap skills with Alex Rivera today!"
              </p>
              <button 
                onClick={() => onNavigate("recommendations")}
                className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer"
              >
                Access Full Career Path Analysis
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
