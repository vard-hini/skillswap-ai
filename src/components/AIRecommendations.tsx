import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Award, 
  Users, 
  Compass, 
  Cpu, 
  ArrowRight, 
  HelpCircle, 
  Terminal, 
  AlertCircle,
  Lightbulb,
  CheckSquare,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { AIRecommendationResponse } from "../types";

interface AIRecommendationsProps {
  darkMode: boolean;
  onNavigate: (view: string) => void;
  onProposeSwap: (mentorId: string, skillName: string) => void;
}

export default function AIRecommendations({
  darkMode,
  onNavigate,
  onProposeSwap
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestStates, setRequestStates] = useState<{ [key: string]: boolean }>({});

  const fetchAIRecommendations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/recommendations");
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
      }
    } catch (err) {
      console.error("Failure fetching AI recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIRecommendations();
  }, []);

  const handleConnect = (mentorId: string, skillName: string) => {
    onProposeSwap(mentorId, skillName);
    setRequestStates(prev => ({ ...prev, [mentorId]: true }));
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative ${
      darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* Background Blurs */}
      <div className="absolute top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px]" />
        <div className="absolute top-[-10%] right-[20%] w-[350px] h-[350px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto space-y-8 z-10">
        
        {/* Header Block */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Gemini LLM Advisory</span>
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight">
            AI Peer Learning <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold">Recommendations</span>
          </h1>
          <p className={`text-xs ${darkMode ? "text-neutral-400" : "text-slate-500"}`}>
            Our server-side Gemini 3.5 AI agent inspects your active skills list, logs, interests, and career desires to map precise milestones.
          </p>
        </div>

        {/* LOADING SHIMMER */}
        {loading ? (
          <div className="p-12 text-center border border-white/5 rounded-3xl bg-white/5 backdrop-blur-md space-y-4">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
            <div className="space-y-1.5">
              <p className="text-xs font-semibold">Querying Google GenAI Client...</p>
              <p className="text-[10px] text-slate-400">Comparing skill catalogs, mutual wants, and compiling professional roadmaps...</p>
            </div>
          </div>
        ) : !recommendations ? (
          <div className="p-8 text-center border border-white/5 rounded-3xl bg-white/5">
            <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-2" />
            <p className="text-sm font-semibold">Could not pull AI advisory metrics.</p>
            <button 
              onClick={fetchAIRecommendations}
              className="mt-3 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Fallback Engine Notice Banner */}
            {recommendations.isFallback && (
              <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex gap-2 items-center">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500" />
                  <div>
                    <span className="font-semibold">Local AI Recommendations Active:</span> Set your <code className="font-mono bg-amber-500/10 px-1 rounded">GEMINI_API_KEY</code> in the Secrets tab to activate live, custom Gemini suggestions.
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono font-bold bg-amber-500/15 px-2.5 py-1 rounded">Offline Engine</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1 & 2: Main Career Path and Tips */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* CAREER ROADMAP PANEL */}
                <div className={`p-8 rounded-3xl border space-y-5 ${
                  darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
                }`}>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Target Role Analysis</span>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-bold font-display">{recommendations.careerPath.role}</h2>
                    <p className={`text-xs leading-relaxed ${darkMode ? "text-neutral-300" : "text-slate-600"}`}>
                      {recommendations.careerPath.reason}
                    </p>
                  </div>

                  {/* Recommended learning milestones step list */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Structured Learning Milestones</span>
                    <div className="space-y-2.5">
                      {recommendations.careerPath.suggestedLearningPath.map((step: string, i: number) => (
                        <div key={i} className="flex gap-3 items-start text-xs">
                          <div className="h-5 w-5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-mono text-[10px] flex-shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <p className="text-slate-600 dark:text-neutral-300 font-medium leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* PERSONALIZED CHECKLIST TIPS */}
                <div className={`p-8 rounded-3xl border space-y-4 ${
                  darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
                }`}>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Study Strategy Tips</span>
                  </div>

                  <div className="space-y-3">
                    {recommendations.personalizedTips.map((tip: string, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0a0a0a]/40 border border-slate-200/40 dark:border-white/5 text-xs flex gap-3">
                        <CheckSquare className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Column 3: Skills next & suggested matches sidebar */}
              <div className="space-y-6">
                
                {/* NEXT SKILLS TO LEARN LIST */}
                <div className={`p-6 rounded-2xl border space-y-4 ${
                  darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
                }`}>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Prioritize Next</span>
                  </div>

                  <div className="space-y-2">
                    {recommendations.skillsToLearnNext.map((skill: string, idx: number) => (
                      <div 
                        key={idx}
                        className="p-3 rounded-xl border border-indigo-500/10 bg-indigo-500/5 text-xs flex justify-between items-center"
                      >
                        <span className="font-semibold text-neutral-200">{skill}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-indigo-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* RECOMMENDED MATCH CONNECTORS */}
                <div className={`p-6 rounded-2xl border space-y-4 ${
                  darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">AI Suggested Peers</span>
                  </div>

                  <div className="space-y-3">
                    {recommendations.suggestedMentors.map((mentor: any, idx: number) => {
                      const hasConnected = requestStates[mentor.mentorId];
                      return (
                        <div 
                          key={idx}
                          className={`p-4 rounded-xl border space-y-3 text-xs ${
                            darkMode ? "bg-[#0a0a0a]/40 border-white/5" : "bg-slate-50/50 border-slate-200"
                          }`}
                        >
                          <div>
                            <h4 className="font-bold">{mentor.name}</h4>
                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed italic">"{mentor.matchReason}"</p>
                          </div>
                          
                          <button
                            onClick={() => handleConnect(mentor.mentorId, recommendations.skillsToLearnNext[0] || "General swap")}
                            disabled={hasConnected}
                            className={`w-full py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                              hasConnected 
                                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed" 
                                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10"
                            }`}
                          >
                            {hasConnected ? "Swap Link Proposed" : "Propose Swap Link"}
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
