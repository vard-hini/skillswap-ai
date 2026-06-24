import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/ProfilePage";
import Marketplace from "./components/Marketplace";
import MentorMatching from "./components/MentorMatching";
import Chat from "./components/Chat";
import AIRecommendations from "./components/AIRecommendations";
import { User, Match, Notification } from "./types";

export default function App() {
  const [view, setView] = useState<string>("landing");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [availableSkillsCount, setAvailableSkillsCount] = useState<number>(12);
  const [darkMode, setDarkMode] = useState<boolean>(true); // default to a polished dark mode theme

  // Fetch current user session status
  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        // If logged in, navigate straight to dashboard
        if (view === "landing" || view === "login" || view === "register") {
          setView("dashboard");
        }
      }
    } catch (err) {
      console.log("No active user session detected.", err);
    }
  };

  // Fetch match collections
  const fetchMatchesData = async () => {
    try {
      // Fetch public mentors lists (which contains our matching scores and match stats)
      const res = await fetch("/api/mentors");
      if (res.ok) {
        const mentorsData = await res.json();
        
        // Re-construct matches arrays based on matching scores
        const list: Match[] = [];
        mentorsData.forEach((m: any) => {
          if (m.matchStatus !== "none" && m.matchId) {
            list.push({
              id: m.matchId,
              mentorId: m.matchRole === "mentor" ? m.id : currentUser?.id || "user_sarah",
              learnerId: m.matchRole === "learner" ? m.id : currentUser?.id || "user_sarah",
              skillName: m.skillsOffered[0]?.name || "Mentorship",
              status: m.matchStatus,
              createdAt: m.joinedAt
            });
          }
        });
        setMatches(list);
      }
    } catch (err) {
      console.error("Failure updating matches", err);
    }
  };

  // Fetch notification queues
  const fetchNotificationsData = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const list = await res.json();
        setNotifications(list);
      }
    } catch (err) {
      console.error("Failure pulling notifications", err);
    }
  };

  // Fetch marketplace statistics
  const fetchMarketplaceStats = async () => {
    try {
      const res = await fetch("/api/skills");
      if (res.ok) {
        const list = await res.json();
        setAvailableSkillsCount(list.length);
      }
    } catch (err) {
      console.error("Failure getting skills count", err);
    }
  };

  // Sync state data on component boot and on view transition
  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchMatchesData();
      fetchNotificationsData();
      fetchMarketplaceStats();
    }
  }, [currentUser, view]);

  // Adjust document theme attributes dynamically
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      document.body.style.backgroundColor = "#0a0a0a"; // Elegant Dark charcoal/black
    } else {
      root.classList.remove("dark");
      document.body.style.backgroundColor = "#f8fafc"; // Slate 50 off white
    }
  }, [darkMode]);

  // Trigger login dispatch
  const handleLogin = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        return true;
      }
    } catch (err) {
      console.error("Auth server connection issues", err);
    }
    return false;
  };

  // Trigger registration dispatch
  const handleRegister = async (data: any): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        return true;
      }
    } catch (err) {
      console.error("Registration dispatch issues", err);
    }
    return false;
  };

  // Trigger profile update dispatch
  const handleUpdateProfile = async (payload: Partial<User>): Promise<boolean> => {
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        return true;
      }
    } catch (err) {
      console.error("Profile update server error", err);
    }
    return false;
  };

  // Propose a connection swap
  const handleProposeSwap = async (mentorId: string, skillName: string) => {
    try {
      const res = await fetch("/api/mentors/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorId, skillName })
      });
      if (res.ok) {
        fetchMatchesData();
        fetchNotificationsData();
      }
    } catch (err) {
      console.error("Propose swap transmission error", err);
    }
  };

  // Action swap connection approvals
  const handleAcceptMatch = async (matchId: string) => {
    try {
      const res = await fetch("/api/mentors/match/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, action: "accept" })
      });
      if (res.ok) {
        fetchMatchesData();
        fetchNotificationsData();
        // Automatically fetch newly updated user profile (XP point reward!)
        const userRes = await fetch("/api/auth/me");
        if (userRes.ok) {
          const u = await userRes.json();
          setCurrentUser(u);
        }
      }
    } catch (err) {
      console.error("Accept request transmission error", err);
    }
  };

  const handleRejectMatch = async (matchId: string) => {
    try {
      const res = await fetch("/api/mentors/match/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, action: "reject" })
      });
      if (res.ok) {
        fetchMatchesData();
        fetchNotificationsData();
      }
    } catch (err) {
      console.error("Reject request transmission error", err);
    }
  };

  // Mark alerts as read
  const handleMarkNotificationsRead = async () => {
    try {
      await fetch("/api/notifications/read", { method: "POST" });
      fetchNotificationsData();
    } catch (err) {
      console.error("Mark notifications read error", err);
    }
  };

  // Log Out user
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setView("landing");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* Header Navigation bar */}
      <Navbar
        currentUser={currentUser}
        onNavigate={setView}
        currentView={view}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onLogout={handleLogout}
      />

      {/* Pages Router View switcher */}
      <main className="flex-1">
        {view === "landing" && (
          <LandingPage onNavigate={setView} darkMode={darkMode} />
        )}
        {view === "login" && (
          <LoginPage onLogin={handleLogin} onNavigate={setView} darkMode={darkMode} />
        )}
        {view === "register" && (
          <RegisterPage onRegister={handleRegister} onNavigate={setView} darkMode={darkMode} />
        )}
        {currentUser && (
          <>
            {view === "dashboard" && (
              <Dashboard
                currentUser={currentUser}
                onNavigate={setView}
                matches={matches}
                notifications={notifications}
                availableMentorsCount={6}
                availableSkillsCount={availableSkillsCount}
                onAcceptMatch={handleAcceptMatch}
                onRejectMatch={handleRejectMatch}
                darkMode={darkMode}
              />
            )}
            {view === "profile" && (
              <ProfilePage
                currentUser={currentUser}
                onUpdateProfile={handleUpdateProfile}
                darkMode={darkMode}
                onNavigate={setView}
              />
            )}
            {view === "marketplace" && (
              <Marketplace
                currentUserId={currentUser.id}
                darkMode={darkMode}
                onNavigate={setView}
                onProposeSwap={handleProposeSwap}
                matches={matches}
              />
            )}
            {view === "mentors" && (
              <MentorMatching
                currentUserId={currentUser.id}
                darkMode={darkMode}
                onNavigate={setView}
                onProposeSwap={handleProposeSwap}
                matches={matches}
              />
            )}
            {view === "chat" && (
              <Chat
                currentUser={currentUser}
                darkMode={darkMode}
                onNavigate={setView}
              />
            )}
            {view === "recommendations" && (
              <AIRecommendations
                darkMode={darkMode}
                onNavigate={setView}
                onProposeSwap={handleProposeSwap}
              />
            )}
          </>
        )}
      </main>

      {/* Shared Minimalist Footer */}
      <footer className={`py-6 border-t text-center text-xs tracking-tight ${
        darkMode ? "bg-[#0a0a0a] border-white/5 text-neutral-500" : "bg-white border-slate-200/50 text-slate-400"
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 SkillSwap AI. Built for portfolio & peer-to-peer education. All rights reserved.</p>
          <div className="flex gap-4 font-semibold text-indigo-400">
            <button onClick={() => setView("landing")} className="hover:underline">Home</button>
            <span>•</span>
            <button onClick={() => setView("marketplace")} className="hover:underline">Skills Marketplace</button>
            <span>•</span>
            <button onClick={() => setView("recommendations")} className="hover:underline">AI Advisory</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
