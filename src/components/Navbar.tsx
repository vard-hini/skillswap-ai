import React, { useState } from "react";
import { 
  Sparkles, 
  User, 
  MessageSquare, 
  Award, 
  LogOut, 
  Bell, 
  Search, 
  Users, 
  TrendingUp, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Compass
} from "lucide-react";
import { User as UserType, Notification } from "../types";

interface NavbarProps {
  currentUser: UserType | null;
  onNavigate: (view: string) => void;
  currentView: string;
  notifications: Notification[];
  onMarkNotificationsRead: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export default function Navbar({
  currentUser,
  onNavigate,
  currentView,
  notifications,
  onMarkNotificationsRead,
  darkMode,
  onToggleDarkMode,
  onLogout
}: NavbarProps) {
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const navItems = currentUser ? [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "marketplace", label: "Marketplace", icon: Compass },
    { id: "mentors", label: "Mentor Match", icon: Users },
    { id: "recommendations", label: "AI Advice", icon: Sparkles },
    { id: "chat", label: "Chat", icon: MessageSquare },
    { id: "profile", label: "My Profile", icon: User },
  ] : [
    { id: "landing", label: "Home", icon: Compass },
    { id: "login", label: "Login", icon: User },
    { id: "register", label: "Register", icon: Sparkles },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      darkMode 
        ? "bg-[#0a0a0a]/80 border-b border-white/5 backdrop-blur-md text-white" 
        : "bg-white/80 border-b border-slate-200/60 backdrop-blur-md text-slate-800"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => handleNavClick("landing")} 
            className="flex items-center gap-2 cursor-pointer group"
            id="nav-logo"
          >
            <div className="h-9 w-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-all duration-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              SkillSwap <span className="text-indigo-400">AI</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-white/5 text-indigo-400 border border-white/10 shadow-sm" 
                      : darkMode 
                        ? "text-neutral-400 hover:bg-white/5 hover:text-white border border-transparent" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              id="dark-mode-toggle"
              onClick={onToggleDarkMode}
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode ? "hover:bg-white/5 text-yellow-400" : "hover:bg-slate-100 text-slate-500"
              }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {currentUser && (
              <>
                {/* Stats */}
                <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-xs font-semibold text-indigo-400">
                  <div className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    <span>Lvl {currentUser.level}</span>
                  </div>
                  <span className="h-3 w-px bg-indigo-500/25"></span>
                  <span>{currentUser.points} pts</span>
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    id="notifications-bell"
                    onClick={() => {
                      setShowBellDropdown(!showBellDropdown);
                      if (unreadNotifications.length > 0) {
                        onMarkNotificationsRead();
                      }
                    }}
                    className={`p-2 rounded-xl relative transition-all duration-200 ${
                      darkMode ? "hover:bg-white/5 text-slate-300" : "hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-neutral-900 animate-pulse"></span>
                    )}
                  </button>

                  {/* Bell Dropdown */}
                  {showBellDropdown && (
                    <div 
                      id="notifications-dropdown"
                      className={`absolute right-0 mt-2.5 w-80 rounded-2xl shadow-xl border ${
                        darkMode 
                          ? "bg-neutral-900 border-white/10 text-white" 
                          : "bg-white border-slate-100 text-slate-800"
                      } py-2 z-50`}
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                        <span className="font-semibold text-sm">Notifications</span>
                        <span className="text-xs text-indigo-400 font-medium">Real-time alerts</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-xs text-slate-400">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif.id}
                              className={`px-4 py-3 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-150 ${
                                !notif.read ? "bg-indigo-500/5" : ""
                              }`}
                            >
                              <div className="flex gap-2">
                                <div className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                                  notif.type === "match" ? "bg-emerald-500" :
                                  notif.type === "message" ? "bg-indigo-500" :
                                  notif.type === "badge" ? "bg-yellow-500" : "bg-blue-500"
                                }`} />
                                <div className="space-y-0.5">
                                  <p className="text-xs font-semibold">{notif.title}</p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{notif.message}</p>
                                  <p className="text-[9px] text-slate-400">
                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-1.5 text-center border-t border-slate-100 dark:border-white/5">
                        <button 
                          onClick={() => setShowBellDropdown(false)}
                          className="text-[11px] text-slate-400 hover:text-indigo-400 font-medium"
                        >
                          Close Pane
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Avatar Display & Logout */}
                <div className="flex items-center gap-2">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    onClick={() => handleNavClick("profile")}
                    className="h-8 w-8 rounded-xl object-cover ring-2 ring-indigo-500/20 cursor-pointer hover:scale-105 transition-all"
                  />
                  <button
                    id="logout-button"
                    onClick={onLogout}
                    className={`hidden md:flex p-2 rounded-xl transition-all duration-200 text-rose-500 ${
                      darkMode ? "hover:bg-white/5" : "hover:bg-slate-100"
                    }`}
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}

            {/* Mobile Menu Icon */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl transition-all duration-200 ${
                darkMode ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t ${darkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-200"}`}>
          <div className="px-2 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-indigo-500/10 text-indigo-400 border border-white/5 shadow-sm" 
                      : darkMode 
                        ? "text-neutral-400 hover:bg-white/5 border border-transparent" 
                        : "text-slate-600 hover:bg-slate-100 border border-transparent"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
            
            {currentUser && (
              <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex flex-col gap-3 px-4">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-400">
                  <span>Level {currentUser.level}</span>
                  <span>{currentUser.points} Points</span>
                </div>
                <button
                  id="mobile-logout-button"
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 text-sm font-medium hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout of Platform
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
