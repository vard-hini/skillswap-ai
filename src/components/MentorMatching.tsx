import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  Award, 
  Sparkles, 
  UserPlus, 
  ChevronRight, 
  Tag, 
  Cpu, 
  Briefcase, 
  MessageSquare,
  HelpCircle,
  ThumbsUp,
  XCircle,
  ArrowRight
} from "lucide-react";
import { User } from "../types";

interface MentorWithScore extends User {
  matchingScore: number;
  matchStatus: "none" | "pending" | "connected" | "rejected";
  matchRole: "none" | "mentor" | "learner";
  matchId: string | null;
}

interface MentorMatchingProps {
  currentUserId: string;
  darkMode: boolean;
  onNavigate: (view: string) => void;
  onProposeSwap: (mentorId: string, skillName: string) => void;
  matches: any[];
}

export default function MentorMatching({
  currentUserId,
  darkMode,
  onNavigate,
  onProposeSwap,
  matches
}: MentorMatchingProps) {
  const [mentors, setMentors] = useState<MentorWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestStates, setRequestStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await fetch("/api/mentors");
        if (res.ok) {
          const data = await res.json();
          setMentors(data);
        }
      } catch (err) {
        console.error("Failure fetching matches", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, [matches]);

  const handleConnect = (mentorId: string, primarySkill: string) => {
    onProposeSwap(mentorId, primarySkill);
    setRequestStates(prev => ({ ...prev, [mentorId]: true }));
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative ${
      darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* Background decorations */}
      <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            <Users className="h-3.5 w-3.5" />
            <span>Reciprocal Compatibility Matching</span>
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight">
            Mentor <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold">Matching Matrix</span>
          </h1>
          <p className={`text-xs ${darkMode ? "text-neutral-400" : "text-slate-500"}`}>
            Our matchmaking system calculates compatibility scores based on mutual teaching capabilities, learning goals, and creative interests.
          </p>
        </div>

        {/* LOADING INDICATOR */}
        {loading ? (
          <div className="text-center py-24 space-y-2">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Analyzing peer matrix weights...</p>
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/5 backdrop-blur-md">
            <HelpCircle className="h-10 w-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">No other swappers indexed yet.</p>
          </div>
        ) : (
          /* MENTORS CARDS LISTING */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((m) => {
              const hasRequested = m.matchStatus === "pending" || requestStates[m.id];
              const isConnected = m.matchStatus === "connected";
              const primaryOfferedSkill = m.skillsOffered[0]?.name || "Mentorship";

              return (
                <motion.div
                  key={m.id}
                  whileHover={{ y: -4 }}
                  className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                    darkMode 
                      ? "bg-white/5 border-white/5 hover:bg-white/10 backdrop-blur-md" 
                      : "bg-white border-slate-100 shadow-sm hover:shadow-lg hover:shadow-slate-100"
                  }`}
                >
                  
                  {/* Matching score floating badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold shadow shadow-indigo-500/5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{m.matchingScore}% Match</span>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-5">
                    
                    {/* User profile details */}
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="h-12 w-12 rounded-2xl object-cover ring-2 ring-indigo-500/10"
                      />
                      <div>
                        <h3 className="font-display font-bold text-sm">{m.name}</h3>
                        <p className="text-[10px] text-slate-400 font-medium">Level {m.level} Swapper</p>
                      </div>
                    </div>

                    {/* Bio Teaser */}
                    <p className={`text-xs leading-relaxed line-clamp-3 ${darkMode ? "text-neutral-400" : "text-slate-500"}`}>
                      {m.bio}
                    </p>

                    {/* SKILLS TAGS GRID */}
                    <div className="space-y-3 pt-2">
                      {/* Teaches */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">TEACHES</span>
                        <div className="flex flex-wrap gap-1.5">
                          {m.skillsOffered.map((s, idx) => (
                            <span key={idx} className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Wants */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">WANTS</span>
                        <div className="flex flex-wrap gap-1.5">
                          {m.skillsWanted.map((s, idx) => (
                            <span key={idx} className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-[10px] font-semibold">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* INTERESTS PILLES */}
                    <div className="flex flex-wrap gap-1 pt-2">
                      {m.interests.slice(0, 3).map((interest, i) => (
                        <span key={i} className="text-[9px] text-slate-400 border border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-[#0a0a0a]/40 px-1.5 py-0.5 rounded">
                          #{interest}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Actions Block */}
                  <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-6 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-semibold">{m.points} XP earned</span>
                    
                    {isConnected ? (
                      <button
                        onClick={() => onNavigate("chat")}
                        id={`chat-btn-${m.id}`}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-indigo-400 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Start Chat
                      </button>
                    ) : hasRequested ? (
                      <span className="text-xs text-slate-400 font-bold italic flex items-center gap-1 bg-slate-50 dark:bg-[#0a0a0a]/60 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-white/5">
                        Pending Approval
                      </span>
                    ) : (
                      <button
                        onClick={() => handleConnect(m.id, primaryOfferedSkill)}
                        id={`connect-btn-${m.id}`}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.01] shadow-md shadow-indigo-600/10"
                      >
                        <UserPlus className="h-3.5 w-3.5" /> Connect Swap
                      </button>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
