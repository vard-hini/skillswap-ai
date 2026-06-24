import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  MessageSquare, 
  Send, 
  User, 
  Award, 
  Sparkles, 
  ArrowLeft, 
  Cpu, 
  Calendar, 
  Check, 
  AlertCircle,
  HelpCircle,
  Clock
} from "lucide-react";
import { Message, User as UserType } from "../types";

interface ChatProps {
  currentUser: UserType;
  darkMode: boolean;
  onNavigate: (view: string) => void;
}

interface ChatChannel {
  userId: string;
  name: string;
  avatar: string;
  bio: string;
  latestMessage: string;
  skillName: string;
}

export default function Chat({
  currentUser,
  darkMode,
  onNavigate
}: ChatProps) {
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Poll for messages periodically to simulate real-time updates
  const fetchMessagesAndChannels = async () => {
    try {
      const msgRes = await fetch("/api/chat/messages");
      const mentorsRes = await fetch("/api/mentors");
      
      if (msgRes.ok && mentorsRes.ok) {
        const msgs: Message[] = await msgRes.json();
        const mentors: any[] = await mentorsRes.json();
        
        // Filter out connected mentors/learners to establish channels
        const connectedSwappers = mentors.filter(m => m.matchStatus === "connected");
        
        const channelsData = connectedSwappers.map(s => {
          // Find latest message between currentUser and this swapper
          const roomMsgs = msgs.filter(
            m => (m.senderId === currentUser.id && m.receiverId === s.id) ||
                 (m.senderId === s.id && m.receiverId === currentUser.id)
          );
          const sorted = [...roomMsgs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          const lastMsg = sorted[sorted.length - 1]?.content || "Click to open swap discussions...";
          
          return {
            userId: s.id,
            name: s.name,
            avatar: s.avatar,
            bio: s.bio,
            latestMessage: lastMsg,
            skillName: s.skillsOffered[0]?.name || "Mentorship"
          };
        });

        setChannels(channelsData);

        // Auto-select first channel if none is active
        if (!activeChannelId && channelsData.length > 0) {
          setActiveChannelId(channelsData[0].userId);
        }

        // Set chat messages for the currently selected channel
        if (activeChannelId) {
          const selectedMsgs = msgs.filter(
            m => (m.senderId === currentUser.id && m.receiverId === activeChannelId) ||
                 (m.senderId === activeChannelId && m.receiverId === currentUser.id)
          );
          const sortedSelected = [...selectedMsgs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          setChatMessages(sortedSelected);
        }
      }
    } catch (err) {
      console.error("Failure polling chat updates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessagesAndChannels();

    // Polling interval of 4 seconds to get snappy real-time sync
    const interval = setInterval(() => {
      fetchMessagesAndChannels();
    }, 4000);

    return () => clearInterval(interval);
  }, [activeChannelId]);

  // Scroll to bottom on message load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChannelId) return;

    const messageContent = inputText.trim();
    setInputText("");

    // Append message immediately locally for high-speed UX feel
    const tempMsg: Message = {
      id: `temp_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: activeChannelId,
      content: messageContent,
      timestamp: new Date().toISOString(),
      read: false
    };
    setChatMessages(prev => [...prev, tempMsg]);

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: activeChannelId,
          content: messageContent
        })
      });

      if (res.ok) {
        // Trigger server refresh to fetch real ID
        fetchMessagesAndChannels();
      }
    } catch (err) {
      console.error("Failure sending message to backend", err);
    }
  };

  const activeChannel = channels.find(c => c.userId === activeChannelId);

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 relative ${
      darkMode ? "bg-[#0a0a0a] text-neutral-200" : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* Background Glow */}
      <div className="absolute top-0 right-1/3 w-80 h-80 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-6 h-[calc(100vh-140px)] flex flex-col">
        
        {/* Back control */}
        <button 
          onClick={() => onNavigate("dashboard")}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 font-semibold mb-1 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <div className={`flex-1 rounded-3xl border flex overflow-hidden ${
          darkMode ? "bg-white/5 border-white/5 backdrop-blur-md" : "bg-white border-slate-100 shadow-sm"
        }`}>
          
          {/* CHANNELS ROOM LISTING SIDEBAR */}
          <div className="w-1/3 border-r border-slate-100 dark:border-white/5 flex flex-col bg-slate-50/50 dark:bg-transparent">
            <div className="p-4 border-b border-slate-100 dark:border-white/5">
              <h2 className="font-display font-bold text-sm tracking-tight flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-indigo-400" /> Conversational Swaps
              </h2>
              <p className="text-[10px] text-slate-400 mt-1">Select an active swap channel below</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {loading ? (
                <p className="text-[11px] text-slate-400 text-center py-8">Updating rooms...</p>
              ) : channels.length === 0 ? (
                <div className="text-center py-16 space-y-2 px-4">
                  <HelpCircle className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-semibold">No active chat connections.</p>
                  <p className="text-[10px] text-slate-400">Head to Mentor Match to connect with partners!</p>
                  <button 
                    onClick={() => onNavigate("mentors")}
                    className="text-[10px] text-indigo-400 font-bold underline cursor-pointer"
                  >
                    Match Now
                  </button>
                </div>
              ) : (
                channels.map((ch) => (
                  <div
                    key={ch.userId}
                    onClick={() => setActiveChannelId(ch.userId)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all duration-150 flex gap-3 items-center ${
                      activeChannelId === ch.userId
                        ? "bg-indigo-500/10 border border-indigo-500/20"
                        : "hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <img
                      src={ch.avatar}
                      alt={ch.name}
                      className="h-9 w-9 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold truncate">{ch.name}</h4>
                        <span className="text-[9px] bg-indigo-500/15 text-indigo-400 px-1.5 py-0.5 rounded-full font-bold">
                          {ch.skillName.substring(0, 10)}...
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{ch.latestMessage}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CHAT MESSAGES PANEL */}
          <div className="flex-1 flex flex-col bg-white/40 dark:bg-slate-900/10">
            {activeChannel ? (
              <>
                {/* Active Partner Header */}
                <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/30 dark:bg-[#0a0a0a]/20">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeChannel.avatar}
                      alt={activeChannel.name}
                      className="h-10 w-10 rounded-xl object-cover ring-2 ring-indigo-500/10"
                    />
                    <div>
                      <h3 className="font-display font-bold text-xs">{activeChannel.name}</h3>
                      <p className="text-[9px] text-slate-400 italic truncate max-w-sm">{activeChannel.bio.substring(0, 70)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-indigo-500/15 text-indigo-400 px-2 py-0.8 rounded-lg font-bold">
                      Swap: {activeChannel.skillName}
                    </span>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
                  {chatMessages.map((msg, i) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div 
                        key={i}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-md p-4 rounded-3xl text-xs space-y-1 ${
                          isMe 
                            ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/10" 
                            : darkMode 
                              ? "bg-white/10 text-neutral-200 rounded-tl-none border border-white/5" 
                              : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/50"
                        }`}>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <div className={`flex items-center gap-1 text-[9px] justify-end ${isMe ? "text-white/60" : "text-slate-400"}`}>
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Area */}
                <form 
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-slate-100 dark:border-white/5 flex gap-3 items-center bg-slate-50/20 dark:bg-slate-900/10"
                >
                  <input
                    type="text"
                    required
                    placeholder="Discuss dates, times, goals, or coordinate video call links..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className={`flex-1 text-xs px-4 py-3 rounded-xl border outline-none ${
                      darkMode 
                        ? "bg-[#0a0a0a]/60 border-white/5 text-white focus:border-indigo-500" 
                        : "bg-white border-slate-200 text-slate-800 focus:border-indigo-500"
                    }`}
                  />
                  <button
                    type="submit"
                    className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 transition-all cursor-pointer"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-8 space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="font-display font-semibold text-sm">Select Swapper to Start Chatting</h3>
                <p className="text-xs text-slate-400 max-w-sm">Approved match connections will list in your chat rooms menu on the left sidebar.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
