import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Award, 
  Cpu, 
  Plus, 
  X, 
  Check, 
  Save, 
  Sparkles, 
  FolderPlus, 
  Target, 
  UserCheck, 
  ArrowLeft 
} from "lucide-react";
import { User as UserType, Skill, SkillLevel } from "../types";

interface ProfilePageProps {
  currentUser: UserType;
  onUpdateProfile: (updatedData: Partial<UserType>) => Promise<boolean>;
  darkMode: boolean;
  onNavigate: (view: string) => void;
}

const CATEGORIES = [
  "Development & Tech",
  "Design & Creative",
  "Business & Marketing",
  "Data Science & AI",
  "Languages & Academics"
];

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150"
];

export default function ProfilePage({
  currentUser,
  onUpdateProfile,
  darkMode,
  onNavigate
}: ProfilePageProps) {
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [careerGoals, setCareerGoals] = useState(currentUser.careerGoals || "");
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar);

  // Dynamic Skill Lists states
  const [skillsOffered, setSkillsOffered] = useState<Skill[]>(currentUser.skillsOffered);
  const [skillsWanted, setSkillsWanted] = useState<Skill[]>(currentUser.skillsWanted);
  const [interests, setInterests] = useState<string[]>(currentUser.interests);

  // Input states for adding new elements
  const [newOfferedName, setNewOfferedName] = useState("");
  const [newOfferedCat, setNewOfferedCat] = useState(CATEGORIES[0]);
  const [newOfferedLvl, setNewOfferedLvl] = useState<SkillLevel>("Intermediate");

  const [newWantedName, setNewWantedName] = useState("");
  const [newWantedCat, setNewWantedCat] = useState(CATEGORIES[0]);
  const [newWantedLvl, setNewWantedLvl] = useState<SkillLevel>("Beginner");

  const [newInterest, setNewInterest] = useState("");

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Handle adding offered skill
  const handleAddOffered = () => {
    if (!newOfferedName.trim()) return;
    const item = { name: newOfferedName.trim(), category: newOfferedCat, level: newOfferedLvl };
    if (!skillsOffered.some(s => s.name.toLowerCase() === item.name.toLowerCase())) {
      setSkillsOffered([...skillsOffered, item]);
    }
    setNewOfferedName("");
  };

  const handleRemoveOffered = (index: number) => {
    setSkillsOffered(skillsOffered.filter((_, i) => i !== index));
  };

  // Handle adding wanted skill
  const handleAddWanted = () => {
    if (!newWantedName.trim()) return;
    const item = { name: newWantedName.trim(), category: newWantedCat, level: newWantedLvl };
    if (!skillsWanted.some(s => s.name.toLowerCase() === item.name.toLowerCase())) {
      setSkillsWanted([...skillsWanted, item]);
    }
    setNewWantedName("");
  };

  const handleRemoveWanted = (index: number) => {
    setSkillsWanted(skillsWanted.filter((_, i) => i !== index));
  };

  // Handle adding interest tag
  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    if (!interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
    }
    setNewInterest("");
  };

  const handleRemoveInterest = (item: string) => {
    setInterests(interests.filter(i => i !== item));
  };

  // Submit profile save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const payload = {
      name,
      bio,
      careerGoals,
      avatar: selectedAvatar,
      skillsOffered,
      skillsWanted,
      interests
    };

    const ok = await onUpdateProfile(payload);
    setSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative ${
      darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* Background Decorative Blur */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back navigation */}
        <button 
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 font-semibold cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        {/* Header Summary Card */}
        <div className={`p-8 rounded-3xl border flex flex-col md:flex-row items-center gap-6 ${
          darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <img
            src={selectedAvatar}
            alt={currentUser.name}
            className="h-24 w-24 rounded-2xl object-cover ring-4 ring-indigo-500/20"
          />
          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold font-display">{name || currentUser.name}</h1>
              <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full font-bold">
                Level {currentUser.level} Swapper
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md">{bio || "Provide your bio inside the form below to attract matches."}</p>
            <div className="text-xs text-slate-400 font-medium">
              XP points: <span className="text-indigo-400 font-bold">{currentUser.points} XP</span>
            </div>
          </div>
        </div>

        {/* Profile Edit Forms */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Edit Form Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* GENERAL PROFILE SETTINGS */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
            }`}>
              <h3 className="font-display font-semibold text-sm text-indigo-400 uppercase tracking-wider">General Information</h3>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Display Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full text-xs px-3 py-3 rounded-xl border outline-none ${
                    darkMode ? "bg-[#0a0a0a]/60 border-white/5 focus:border-indigo-500 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Professional Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`w-full text-xs px-3 py-3 rounded-xl border outline-none resize-none ${
                    darkMode ? "bg-[#0a0a0a]/60 border-white/5 focus:border-indigo-500 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Target className="h-4 w-4 text-indigo-400" /> Career Goals & Ambitions
                </label>
                <textarea
                  rows={3}
                  placeholder="What is your next career step, and how can learning other skills help you achieve it?"
                  value={careerGoals}
                  onChange={(e) => setCareerGoals(e.target.value)}
                  className={`w-full text-xs px-3 py-3 rounded-xl border outline-none resize-none ${
                    darkMode ? "bg-[#0a0a0a]/60 border-white/5 focus:border-indigo-500 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                />
              </div>
            </div>

            {/* MANAGE TEACHING SKILLS (OFFERED) */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
            }`}>
              <h3 className="font-display font-semibold text-sm text-indigo-400 uppercase tracking-wider">Configure Offered Skills</h3>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. Next.js App Routing"
                  value={newOfferedName}
                  onChange={(e) => setNewOfferedName(e.target.value)}
                  className={`text-xs flex-1 px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? "bg-[#0a0a0a]/60 border-white/5 text-white" : "bg-white border-slate-200"
                  }`}
                />
                <select
                  value={newOfferedCat}
                  onChange={(e) => setNewOfferedCat(e.target.value)}
                  className={`text-xs px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? "bg-[#0a0a0a]/60 border-white/5 text-white" : "bg-white border-slate-200"
                  }`}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={newOfferedLvl}
                  onChange={(e) => setNewOfferedLvl(e.target.value as SkillLevel)}
                  className={`text-xs px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? "bg-[#0a0a0a]/60 border-white/5 text-white" : "bg-white border-slate-200"
                  }`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddOffered}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {skillsOffered.map((s, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400">
                    <span>{s.name} ({s.level})</span>
                    <button type="button" onClick={() => handleRemoveOffered(idx)} className="hover:text-rose-500 cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* MANAGE LEARNING SKILLS (WANTED) */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
            }`}>
              <h3 className="font-display font-semibold text-sm text-purple-400 uppercase tracking-wider">Configure Desired Skills</h3>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. SEO Copywriting"
                  value={newWantedName}
                  onChange={(e) => setNewWantedName(e.target.value)}
                  className={`text-xs flex-1 px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? "bg-[#0a0a0a]/60 border-white/5 text-white" : "bg-white border-slate-200"
                  }`}
                />
                <select
                  value={newWantedCat}
                  onChange={(e) => setNewWantedCat(e.target.value)}
                  className={`text-xs px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? "bg-[#0a0a0a]/60 border-white/5 text-white" : "bg-white border-slate-200"
                  }`}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={newWantedLvl}
                  onChange={(e) => setNewWantedLvl(e.target.value as SkillLevel)}
                  className={`text-xs px-3 py-2.5 rounded-xl border outline-none ${
                    darkMode ? "bg-[#0a0a0a]/60 border-white/5 text-white" : "bg-white border-slate-200"
                  }`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddWanted}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {skillsWanted.map((s, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-400">
                    <span>{s.name} ({s.level})</span>
                    <button type="button" onClick={() => handleRemoveWanted(idx)} className="hover:text-rose-500 cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar & Action Controls Column */}
          <div className="space-y-6">
            
            {/* AVATAR CHOOSER */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
            }`}>
              <h3 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-wider">Select Profile Picture</h3>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_AVATARS.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Avatar option ${i + 1}`}
                    onClick={() => setSelectedAvatar(url)}
                    className={`h-14 w-14 rounded-xl object-cover cursor-pointer hover:scale-105 transition-all ${
                      selectedAvatar === url 
                        ? "ring-4 ring-indigo-600 shadow-lg" 
                        : "opacity-60 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* INTERESTS TAGGING */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
            }`}>
              <h3 className="font-display font-semibold text-xs text-slate-400 uppercase tracking-wider">Creative Interests</h3>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Fintech"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddInterest(); } }}
                  className={`text-xs flex-1 px-3 py-2 rounded-lg border outline-none ${
                    darkMode ? "bg-[#0a0a0a]/60 border-white/5 text-white" : "bg-white border-slate-200 text-slate-800"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {interests.map((item, idx) => (
                  <span 
                    key={idx}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border ${
                      darkMode ? "border-white/5 bg-[#0a0a0a]/40 text-neutral-300" : "border-slate-200 bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span>{item}</span>
                    <button type="button" onClick={() => handleRemoveInterest(item)} className="hover:text-rose-500 cursor-pointer"><X className="h-2.5 w-2.5" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className={`p-6 rounded-2xl border space-y-3 ${
              darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
            }`}>
              {saveSuccess && (
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-xs flex gap-2 items-center">
                  <UserCheck className="h-4 w-4" />
                  <span>Profile updated successfully! XP level updated.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                id="profile-save-btn"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/15 transition-all cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving Changes..." : "Save Active Profile"}
              </button>
              
              <p className="text-[10px] text-slate-400 text-center">Completing all sections unlocks the "Profile Perfection" Badge (+100 XP Points)!</p>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
