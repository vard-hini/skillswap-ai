import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Mail, Lock, LogIn, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

interface LoginPageProps {
  onLogin: (email: string) => Promise<boolean>;
  onNavigate: (view: string) => void;
  darkMode: boolean;
}

export default function LoginPage({ onLogin, onNavigate, darkMode }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const presetUsers = [
    { name: "Sarah Chen (Data/AI)", email: "sarah@skillswap.ai", desc: "Active researcher" },
    { name: "Alex Rivera (UI/UX)", email: "alex@skillswap.ai", desc: "Design mentor" },
    { name: "Elena Rostova (Product PM)", email: "elena@skillswap.ai", desc: "Agile product leader" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please provide your registered email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const success = await onLogin(email);
      if (success) {
        onNavigate("dashboard");
      } else {
        setError("User account not found with this email. Use one of our quick presets or Register below!");
      }
    } catch (err) {
      setError("Connection failure to SkillSwap AI servers.");
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = async (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword("••••••••");
    setError("");
    setLoading(true);
    const success = await onLogin(presetEmail);
    setLoading(false);
    if (success) {
      onNavigate("dashboard");
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden ${
      darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/2 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 z-10">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className={`text-xs ${darkMode ? "text-neutral-400" : "text-slate-500"}`}>
            Authenticate to access your skill-swapping dashboard and chats.
          </p>
        </div>

        {/* Login Form Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-3xl border ${
            darkMode 
              ? "bg-white/5 border-white/5 backdrop-blur-xl" 
              : "bg-white/80 border-slate-200/60 shadow-xl shadow-slate-100 backdrop-blur-xl"
          }`}
        >
          {error && (
            <div className="mb-5 p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 text-xs flex gap-2 items-center">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full text-sm pl-10 pr-4 py-3.5 rounded-xl border outline-none transition-all ${
                    darkMode 
                      ? "bg-white/5 border-white/5 text-white focus:border-indigo-500 focus:bg-transparent" 
                      : "bg-slate-50/50 border-slate-200 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full text-sm pl-10 pr-4 py-3.5 rounded-xl border outline-none transition-all ${
                    darkMode 
                      ? "bg-white/5 border-white/5 text-white focus:border-indigo-500 focus:bg-transparent" 
                      : "bg-slate-50/50 border-slate-200 text-slate-800 focus:border-indigo-500 focus:bg-white"
                  }`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit-btn"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/10 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Authenticating..." : "Sign In to SkillSwap"}
              <LogIn className="h-4 w-4" />
            </button>
          </form>

          {/* Quick-test Presets Grid */}
          <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-white/5 space-y-3">
            <p className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 text-center">
              Quick Test Presets (No Pass required)
            </p>
            <div className="grid grid-cols-1 gap-2">
              {presetUsers.map((user, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetClick(user.email)}
                  type="button"
                  id={`preset-${user.email.split('@')[0]}`}
                  className={`px-3.5 py-2 rounded-xl text-left border text-xs flex justify-between items-center hover:scale-[1.01] transition-all cursor-pointer ${
                    darkMode 
                      ? "border-white/5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white" 
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-100 text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-[10px] text-slate-400">{user.desc}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Redirect Links */}
        <p className={`text-center text-xs ${darkMode ? "text-neutral-400" : "text-slate-500"}`}>
          New to SkillSwap?{" "}
          <button 
            onClick={() => onNavigate("register")}
            className="text-indigo-400 font-semibold underline cursor-pointer hover:text-indigo-300"
          >
            Create an Account
          </button>
        </p>

      </div>
    </div>
  );
}
