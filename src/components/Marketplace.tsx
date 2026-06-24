import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  BookOpen, 
  UserPlus, 
  Tag, 
  Cpu, 
  AlertCircle,
  HelpCircle
} from "lucide-react";

interface MarketplaceSkill {
  userId: string;
  userName: string;
  userAvatar: string;
  skillName: string;
  category: string;
  level: string;
  type: "offered" | "wanted";
  userBio: string;
}

interface MarketplaceProps {
  currentUserId: string;
  darkMode: boolean;
  onNavigate: (view: string) => void;
  onProposeSwap: (mentorId: string, skillName: string) => void;
  matches: any[];
}

const CATEGORIES = [
  "All",
  "Development & Tech",
  "Design & Creative",
  "Business & Marketing",
  "Data Science & AI",
  "Languages & Academics"
];

export default function Marketplace({
  currentUserId,
  darkMode,
  onNavigate,
  onProposeSwap,
  matches
}: MarketplaceProps) {
  const [skills, setSkills] = useState<MarketplaceSkill[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"offered" | "wanted">("offered");
  const [loading, setLoading] = useState(true);
  const [proposalStatuses, setProposalStatuses] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Fetch aggregated skills catalog from backend API
    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/skills");
        if (res.ok) {
          const data = await res.json();
          // Filter out skills owned by the current user to keep marketplace peer-focused
          setSkills(data.filter((s: any) => s.userId !== currentUserId));
        }
      } catch (err) {
        console.error("Failure fetching skills", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, [currentUserId]);

  const handlePropose = (mentorId: string, skillName: string) => {
    onProposeSwap(mentorId, skillName);
    
    // Set local visual loading state for the proposal
    const key = `${mentorId}_${skillName}`;
    setProposalStatuses(prev => ({ ...prev, [key]: "requested" }));
  };

  // Filter skills based on filters and search
  const filteredSkills = skills.filter((s) => {
    const matchesTab = s.type === activeTab;
    const matchesCat = selectedCategory === "All" || s.category === selectedCategory;
    const matchesSearch = s.skillName.toLowerCase().includes(search.toLowerCase()) || 
                          s.userName.toLowerCase().includes(search.toLowerCase()) ||
                          s.category.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesCat && matchesSearch;
  });

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative ${
      darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header summary */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold">
            <Compass className="h-3.5 w-3.5 animate-spin" />
            <span>Active Exchange Database</span>
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight">
            Skill <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold">Exchange Marketplace</span>
          </h1>
          <p className={`text-xs ${darkMode ? "text-neutral-400" : "text-slate-500"}`}>
            Browse skills currently available or wanted by others. Locate partners who offer exactly what you want and teach what they desire.
          </p>
        </div>

        {/* CONTROLS BAR: SEARCH, CATS, TABS */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
        }`}>
          
          {/* Tabs and Search Split */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            
            {/* Perspective Toggle Tabs */}
            <div className="flex bg-slate-100 dark:bg-[#0a0a0a] p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5">
              <button
                onClick={() => { setActiveTab("offered"); setSelectedCategory("All"); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "offered" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15" 
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Skills Offered (Learn from Mentors)
              </button>
              <button
                onClick={() => { setActiveTab("wanted"); setSelectedCategory("All"); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "wanted" 
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/15" 
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Skills Wanted (Teach Learners)
              </button>
            </div>

            {/* Quick Text Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search skills, peers or categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full text-xs pl-9 pr-4 py-3 rounded-xl border outline-none ${
                  darkMode 
                    ? "bg-[#0a0a0a]/60 border-white/5 focus:border-indigo-500 text-white" 
                    : "bg-slate-50/50 border-slate-200 focus:border-indigo-500 text-slate-800"
                }`}
              />
            </div>
          </div>

          {/* Category Badges Pills list */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900"
                    : darkMode 
                      ? "bg-[#0a0a0a] border border-white/5 text-slate-400 hover:bg-white/5 hover:text-white" 
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* RESULTS GRID CATALOG */}
        {loading ? (
          <div className="text-center py-24 space-y-2">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Scanning SkillSwap servers...</p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/5 backdrop-blur-md">
            <HelpCircle className="h-10 w-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold">No skills found matching filters.</p>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1">Try resetting your category or searching for general keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((item, idx) => {
              
              // Find if already requested / matched in system
              const hasRequested = matches.some(m => 
                m.mentorId === item.userId && m.learnerId === currentUserId && m.skillName === item.skillName
              );

              const isRequestedLocal = proposalStatuses[`${item.userId}_${item.skillName}`] === "requested" || hasRequested;

              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3 }}
                  className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-200 ${
                    darkMode 
                      ? "bg-white/5 border-white/5 hover:bg-white/10 backdrop-blur-md" 
                      : "bg-white border-slate-100 shadow-sm hover:shadow-lg hover:shadow-slate-100"
                  }`}
                >
                  <div className="space-y-4">
                    
                    {/* Peer Header */}
                    <div className="flex items-center gap-3">
                      <img
                        src={item.userAvatar}
                        alt={item.userName}
                        className="h-10 w-10 rounded-xl object-cover ring-2 ring-indigo-500/10"
                      />
                      <div>
                        <h4 className="font-display font-semibold text-xs">{item.userName}</h4>
                        <p className="text-[10px] text-slate-400">Mentorship Tier</p>
                      </div>
                    </div>

                    {/* Skill Info */}
                    <div className="space-y-1.5 pt-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 uppercase">
                        {item.category}
                      </span>
                      <h3 className="font-display font-bold text-base leading-snug">{item.skillName}</h3>
                      <p className={`text-[11px] leading-relaxed line-clamp-2 ${darkMode ? "text-neutral-400" : "text-slate-500"}`}>
                        {item.userBio}
                      </p>
                    </div>

                  </div>

                  {/* Actions footer */}
                  <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-6 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Expertise: {item.level}</span>
                    
                    <button
                      onClick={() => handlePropose(item.userId, item.skillName)}
                      disabled={isRequestedLocal}
                      id={`swap-btn-${item.userId}-${idx}`}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                        isRequestedLocal 
                          ? "bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-neutral-500 cursor-not-allowed" 
                          : activeTab === "offered" 
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10" 
                            : "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/10"
                      }`}
                    >
                      {isRequestedLocal ? "Requested Link" : "Propose Swap"}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
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
