import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  User, 
  Mail, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Plus, 
  X, 
  Check, 
  Settings, 
  UserCheck 
} from "lucide-react";
import { Skill, SkillLevel } from "../types";

interface RegisterPageProps {
  onRegister: (data: any) => Promise<boolean>;
  onNavigate: (view: string) => void;
  darkMode: boolean;
}

const CATEGORIES = [
  "Development & Tech",
  "Design & Creative",
  "Business & Marketing",
  "Data Science & AI",
  "Languages & Academics"
];

export default function RegisterPage({ onRegister, onNavigate, darkMode }: RegisterPageProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  
  // Skills Offered
  const [offeredSkills, setOfferedSkills] = useState<Skill[]>([]);
  const [offeredName, setOfferedName] = useState("");
  const [offeredCat, setOfferedCat] = useState(CATEGORIES[0]);
  const [offeredLvl, setOfferedLvl] = useState<SkillLevel>("Intermediate");

  // Skills Wanted
  const [wantedSkills, setWantedSkills] = useState<Skill[]>([]);
  const [wantedName, setWantedName] = useState("");
  const [wantedCat, setWantedCat] = useState(CATEGORIES[0]);
  const [wantedLvl, setWantedLvl] = useState<SkillLevel>("Beginner");

  // Interests list
  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState<string[]>(["Web Development", "UI Design", "Algorithms"]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddOffered = () => {
    if (!offeredName.trim()) return;
    if (offeredSkills.some(s => s.name.toLowerCase() === offeredName.trim().toLowerCase())) return;
    setOfferedSkills([...offeredSkills, { name: offeredName.trim(), category: offeredCat, level: offeredLvl }]);
    setOfferedName("");
  };

  const handleRemoveOffered = (index: number) => {
    setOfferedSkills(offeredSkills.filter((_, i) => i !== index));
  };

  const handleAddWanted = () => {
    if (!wantedName.trim()) return;
    if (wantedSkills.some(s => s.name.toLowerCase() === wantedName.trim().toLowerCase())) return;
    setWantedSkills([...wantedSkills, { name: wantedName.trim(), category: wantedCat, level: wantedLvl }]);
    setWantedName("");
  };

  const handleRemoveWanted = (index: number) => {
    setWantedSkills(wantedSkills.filter((_, i) => i !== index));
  };

  const handleAddInterest = () => {
    if (!interestInput.trim()) return;
    if (interests.some(i => i.toLowerCase() === interestInput.trim().toLowerCase())) return;
    setInterests([...interests, interestInput.trim()]);
    setInterestInput("");
  };

  const handleRemoveInterest = (item: string) => {
    setInterests(interests.filter(i => i !== item));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!name || !email) {
        setError("Name and Email are required properties.");
        return;
      }
    }
    setError("");
    setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (offeredSkills.length === 0) {
      setError("Please add at least one skill you can offer or teach!");
      return;
    }
    if (wantedSkills.length === 0) {
      setError("Please add at least one skill you are looking to learn!");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const success = await onRegister({
        name,
        email,
        bio,
        skillsOffered: offeredSkills,
        skillsWanted: wantedSkills,
        interests
      });
      if (success) {
        onNavigate("dashboard");
      } else {
        setError("A user with this email is already registered.");
      }
    } catch (err) {
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden ${
      darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* Background Decorative Gradient Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/2 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 dark:bg-purple-500/2 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl w-full space-y-8 z-10">
        
        {/* Title Block */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-11 w-11 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5.5 w-5.5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Create Swapper Profile
          </h2>
          {/* Progress Indicators */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3].map((s) => (
              <span 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step 
                    ? "w-8 bg-indigo-500" 
                    : s < step 
                      ? "w-4 bg-purple-500/70" 
                      : "w-2 bg-slate-300 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Panel Content */}
        <div className={`p-8 rounded-3xl border ${
          darkMode 
            ? "bg-white/5 border-white/5 backdrop-blur-xl" 
            : "bg-white/80 border-slate-200/60 shadow-xl backdrop-blur-xl"
        }`}>
          {error && (
            <div className="mb-6 p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 text-xs flex gap-2 items-center">
              <span>{error}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <h3 className="font-display font-semibold text-base text-indigo-400">Step 1: Swapper Credentials</h3>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full Professional Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam Sterling"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full text-sm pl-10 pr-4 py-3.5 rounded-xl border outline-none transition-all ${
                        darkMode 
                          ? "bg-white/5 border-white/5 focus:border-indigo-500 text-white focus:bg-transparent" 
                          : "bg-slate-50/50 border-slate-200 focus:border-indigo-500 text-slate-800"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="liam@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full text-sm pl-10 pr-4 py-3.5 rounded-xl border outline-none transition-all ${
                        darkMode 
                          ? "bg-white/5 border-white/5 focus:border-indigo-500 text-white focus:bg-transparent" 
                          : "bg-slate-50/50 border-slate-200 focus:border-indigo-500 text-slate-800"
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">We will never display your email publicly without validation.</p>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    Set Swapping Skills
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <h3 className="font-display font-semibold text-base text-indigo-400">Step 2: Declare Skills Offered & Wanted</h3>
                
                {/* SKILLS OFFERED BUILDER */}
                <div className="space-y-3.5 p-4 rounded-2xl border border-indigo-500/10 bg-indigo-500/5">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Skills You Can Offer / Teach</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Figma Interactive Prototyping"
                      value={offeredName}
                      onChange={(e) => setOfferedName(e.target.value)}
                      className={`text-xs flex-1 px-3 py-2.5 rounded-xl border outline-none ${
                        darkMode ? "bg-white/5 border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    />
                    <select
                      value={offeredCat}
                      onChange={(e) => setOfferedCat(e.target.value)}
                      className={`text-xs px-3 py-2.5 rounded-xl border outline-none ${
                        darkMode ? "bg-[#0a0a0a] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                      value={offeredLvl}
                      onChange={(e) => setOfferedLvl(e.target.value as SkillLevel)}
                      className={`text-xs px-3 py-2.5 rounded-xl border outline-none ${
                        darkMode ? "bg-[#0a0a0a] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddOffered}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>

                  {/* List of offered skills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {offeredSkills.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">No teaching skills added yet. Add at least one.</p>
                    ) : (
                      offeredSkills.map((s, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400">
                          <span>{s.name} ({s.level})</span>
                          <button type="button" onClick={() => handleRemoveOffered(idx)} className="hover:text-rose-500"><X className="h-3.5 w-3.5" /></button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* SKILLS WANTED BUILDER */}
                <div className="space-y-3.5 p-4 rounded-2xl border border-purple-500/10 bg-purple-500/5">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Skills You Want to Learn</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Python Scripting"
                      value={wantedName}
                      onChange={(e) => setWantedName(e.target.value)}
                      className={`text-xs flex-1 px-3 py-2.5 rounded-xl border outline-none ${
                        darkMode ? "bg-white/5 border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    />
                    <select
                      value={wantedCat}
                      onChange={(e) => setWantedCat(e.target.value)}
                      className={`text-xs px-3 py-2.5 rounded-xl border outline-none ${
                        darkMode ? "bg-[#0a0a0a] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                      value={wantedLvl}
                      onChange={(e) => setWantedLvl(e.target.value as SkillLevel)}
                      className={`text-xs px-3 py-2.5 rounded-xl border outline-none ${
                        darkMode ? "bg-[#0a0a0a] border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddWanted}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>

                  {/* List of wanted skills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {wantedSkills.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">No desired skills added yet. Add at least one.</p>
                    ) : (
                      wantedSkills.map((s, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-400">
                          <span>{s.name} ({s.level})</span>
                          <button type="button" onClick={() => handleRemoveWanted(idx)} className="hover:text-rose-500"><X className="h-3.5 w-3.5" /></button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> Go Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    Next: Bio & Interests
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <h3 className="font-display font-semibold text-base text-indigo-400">Step 3: Personal Bio & Creative Interests</h3>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Professional Bio</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your creative background, tech projects, and what triggers your passion to teach or learn..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className={`w-full text-sm px-4 py-3 rounded-xl border outline-none transition-all resize-none ${
                      darkMode 
                        ? "bg-white/5 border-white/5 focus:border-indigo-500 text-white focus:bg-transparent" 
                        : "bg-slate-50/50 border-slate-200 focus:border-indigo-500 text-slate-800"
                    }`}
                  />
                  <p className="text-[10px] text-slate-400">A detailed bio increases mentor matching results by up to 80%.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Interests Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Artificial Intelligence, Cryptography"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddInterest(); } }}
                      className={`text-xs flex-1 px-3 py-2.5 rounded-xl border outline-none ${
                        darkMode ? "bg-white/5 border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleAddInterest}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 cursor-pointer"
                    >
                      Add Tag
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {interests.map((item, idx) => (
                      <span 
                        key={idx}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                          darkMode ? "border-white/5 bg-white/5 text-neutral-300" : "border-slate-200 bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span>{item}</span>
                        <button type="button" onClick={() => handleRemoveInterest(item)} className="hover:text-rose-500"><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> Skills Offered
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    id="register-submit-btn"
                    className="flex items-center gap-1.5 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    {loading ? "Registering..." : "Launch Account"}
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Redirect Links */}
        <p className={`text-center text-xs ${darkMode ? "text-neutral-400" : "text-slate-500"}`}>
          Already registered?{" "}
          <button 
            onClick={() => onNavigate("login")}
            className="text-indigo-400 font-semibold underline cursor-pointer hover:text-indigo-300"
          >
            Access Login
          </button>
        </p>

      </div>
    </div>
  );
}
