import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initial mock database loaded with premium starter profiles
let users = [
  {
    id: "user_sarah",
    name: "Sarah Chen",
    email: "sarah@skillswap.ai",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    bio: "AI Researcher specializing in Machine Learning and Computer Vision. I want to improve my web design skills to build better prototypes.",
    skillsOffered: [
      { name: "Python & Machine Learning", category: "Data Science & AI", level: "Advanced" },
      { name: "Data Science", category: "Data Science & AI", level: "Advanced" }
    ],
    skillsWanted: [
      { name: "Figma & UI/UX Design", category: "Design & Creative", level: "Beginner" },
      { name: "React Frontend", category: "Development & Tech", level: "Beginner" }
    ],
    interests: ["Artificial Intelligence", "Generative Art", "Human-Computer Interaction"],
    careerGoals: "I want to transition from purely research to building user-friendly AI-driven products.",
    badges: [
      { id: "b1", name: "Alpha Mentor", description: "Completed 5 mentoring sessions", icon: "Award", unlockedAt: "2026-02-15" },
      { id: "b2", name: "Tech Guru", description: "Offered a highly rated technical skill", icon: "Cpu", unlockedAt: "2026-03-01" }
    ],
    level: 4,
    points: 450,
    joinedAt: "2026-01-10"
  },
  {
    id: "user_alex",
    name: "Alex Rivera",
    email: "alex@skillswap.ai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    bio: "Senior UI/UX Designer at a leading fintech. Passionate about creating emotional connections through design. Looking to learn Python to automate workflows.",
    skillsOffered: [
      { name: "Figma & UI/UX Design", category: "Design & Creative", level: "Advanced" },
      { name: "Design Systems", category: "Design & Creative", level: "Advanced" }
    ],
    skillsWanted: [
      { name: "Python Scripting", category: "Development & Tech", level: "Beginner" },
      { name: "Data Visualization", category: "Data Science & AI", level: "Intermediate" }
    ],
    interests: ["Typography", "Design Thinking", "Fintech", "Automation"],
    careerGoals: "I want to design complex automation dashboards and be able to code my own scripts.",
    badges: [
      { id: "b3", name: "Pixel Perfect", description: "Design skill validated by 3 peers", icon: "Palette", unlockedAt: "2026-03-12" }
    ],
    level: 3,
    points: 280,
    joinedAt: "2026-02-05"
  },
  {
    id: "user_elena",
    name: "Elena Rostova",
    email: "elena@skillswap.ai",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    bio: "Product Manager with 6+ years of agile experience. I love planning roadmaps and mentoring early-stage startups. Eager to master React.",
    skillsOffered: [
      { name: "Product Management", category: "Business & Marketing", level: "Advanced" },
      { name: "Agile & Scrum", category: "Business & Marketing", level: "Advanced" }
    ],
    skillsWanted: [
      { name: "React Frontend", category: "Development & Tech", level: "Beginner" },
      { name: "Tailwind CSS", category: "Development & Tech", level: "Beginner" }
    ],
    interests: ["Agile Methodologies", "User Research", "No-code tools"],
    careerGoals: "To lead cross-functional technical teams with a deep understanding of code architecture.",
    badges: [
      { id: "b4", name: "Strategist", description: "Planned 3 mock product lifecycles", icon: "TrendingUp", unlockedAt: "2026-04-01" }
    ],
    level: 5,
    points: 620,
    joinedAt: "2026-01-20"
  },
  {
    id: "user_devon",
    name: "Devon Blake",
    email: "devon@skillswap.ai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    bio: "Full-stack engineer specialized in Node.js and React. I build fast, secure backends. I want to learn digital copywriting to grow my newsletter.",
    skillsOffered: [
      { name: "React & Next.js", category: "Development & Tech", level: "Advanced" },
      { name: "Node.js & Express", category: "Development & Tech", level: "Advanced" }
    ],
    skillsWanted: [
      { name: "Copywriting", category: "Business & Marketing", level: "Beginner" },
      { name: "SEO Optimization", category: "Business & Marketing", level: "Beginner" }
    ],
    interests: ["Indie Hacking", "SaaS Development", "Technical Writing"],
    careerGoals: "I want to launch my own software products as a solo founder.",
    badges: [
      { id: "b2", name: "Tech Guru", description: "Offered a highly rated technical skill", icon: "Cpu", unlockedAt: "2026-05-10" }
    ],
    level: 3,
    points: 310,
    joinedAt: "2026-03-15"
  },
  {
    id: "user_sophia",
    name: "Sophia Martinez",
    email: "sophia@skillswap.ai",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    bio: "Growth marketer helping SaaS startups scale. Expert in Paid ads and Conversion optimization. Want to learn SQL to query data directly.",
    skillsOffered: [
      { name: "Digital Marketing & Ads", category: "Business & Marketing", level: "Advanced" },
      { name: "SEO Optimization", category: "Business & Marketing", level: "Advanced" }
    ],
    skillsWanted: [
      { name: "SQL & Databases", category: "Development & Tech", level: "Beginner" },
      { name: "Python & Machine Learning", category: "Data Science & AI", level: "Beginner" }
    ],
    interests: ["B2B SaaS", "Web Analytics", "Newsletter Growth"],
    careerGoals: "To become a growth-marketing-driven Product Analytics Lead.",
    badges: [
      { id: "b5", name: "Growth Hacker", description: "Successfully ran a validated skill-swap on SEO", icon: "Zap", unlockedAt: "2026-05-20" }
    ],
    level: 4,
    points: 490,
    joinedAt: "2026-02-18"
  },
  {
    id: "user_kenji",
    name: "Kenji Takahashi",
    email: "kenji@skillswap.ai",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
    bio: "Startup pitching consultant and business developer. I speak English and Japanese. Looking to learn Generative AI models and LLM integration.",
    skillsOffered: [
      { name: "Pitch Deck & Pitching", category: "Business & Marketing", level: "Advanced" },
      { name: "Business Strategy", category: "Business & Marketing", level: "Advanced" }
    ],
    skillsWanted: [
      { name: "Generative AI APIs", category: "Data Science & AI", level: "Beginner" },
      { name: "Python Scripting", category: "Development & Tech", level: "Intermediate" }
    ],
    interests: ["Venture Capital", "Generative AI", "Cross-border startups"],
    careerGoals: "I want to advise tech startups on AI integrations and venture capital financing.",
    badges: [
      { id: "b1", name: "Alpha Mentor", description: "Completed 5 mentoring sessions", icon: "Award", unlockedAt: "2026-06-01" }
    ],
    level: 2,
    points: 190,
    joinedAt: "2026-04-12"
  }
];

// Active mock user session (initialized to Sarah Chen for seamless preview)
let currentUser = {
  id: "user_sarah",
  name: "Sarah Chen",
  email: "sarah@skillswap.ai",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  bio: "AI Researcher specializing in Machine Learning and Computer Vision. I want to improve my web design skills to build better prototypes.",
  skillsOffered: [
    { name: "Python & Machine Learning", category: "Data Science & AI", level: "Advanced" },
    { name: "Data Science", category: "Data Science & AI", level: "Advanced" }
  ],
  skillsWanted: [
    { name: "Figma & UI/UX Design", category: "Design & Creative", level: "Beginner" },
    { name: "React Frontend", category: "Development & Tech", level: "Beginner" }
  ],
  interests: ["Artificial Intelligence", "Generative Art", "Human-Computer Interaction"],
  careerGoals: "I want to transition from purely research to building user-friendly AI-driven products.",
  badges: [
    { id: "b1", name: "Alpha Mentor", description: "Completed 5 mentoring sessions", icon: "Award", unlockedAt: "2026-02-15" },
    { id: "b2", name: "Tech Guru", description: "Offered a highly rated technical skill", icon: "Cpu", unlockedAt: "2026-03-01" }
  ],
  level: 4,
  points: 450,
  joinedAt: "2026-01-10"
};

// Chat Messages State
let messages = [
  { id: "m1", senderId: "user_alex", receiverId: "user_sarah", content: "Hi Sarah! I saw you are looking for UI/UX Design mentoring. I would love to teach you Figma if you can teach me Python automation basics!", timestamp: "2026-06-24T08:30:00Z", read: true },
  { id: "m2", senderId: "user_sarah", receiverId: "user_alex", content: "Hi Alex! That sounds like an absolute match made in heaven. I can definitely help with Python automation! How is your weekend looking?", timestamp: "2026-06-24T09:15:00Z", read: true },
  { id: "m3", senderId: "user_alex", receiverId: "user_sarah", content: "I am free on Sunday afternoon. We can schedule a Zoom call or chat here. What do you think?", timestamp: "2026-06-24T09:45:00Z", read: false },
  { id: "m4", senderId: "user_elena", receiverId: "user_sarah", content: "Hey Sarah, noticed you're interested in PM principles! Want to exchange PM roadmap secrets for Python training?", timestamp: "2026-06-23T14:20:00Z", read: true }
];

// Matches State
let matches = [
  { id: "match1", mentorId: "user_alex", learnerId: "user_sarah", skillName: "Figma & UI/UX Design", status: "connected", createdAt: "2026-06-24T08:15:00Z" },
  { id: "match2", mentorId: "user_sarah", learnerId: "user_kenji", skillName: "Python Scripting", status: "pending", createdAt: "2026-06-24T07:30:00Z" },
  { id: "match3", mentorId: "user_elena", learnerId: "user_sarah", skillName: "Product Management", status: "connected", createdAt: "2026-06-23T14:10:00Z" }
];

// Notifications State
let notifications = [
  { id: "n1", userId: "user_sarah", title: "New Match Request!", message: "Kenji Takahashi wants to learn Python Scripting from you.", type: "match", read: false, createdAt: "2026-06-24T07:30:00Z" },
  { id: "n2", userId: "user_sarah", title: "Message Received", message: "Alex Rivera sent you a message.", type: "message", read: false, createdAt: "2026-06-24T09:45:00Z" },
  { id: "n3", userId: "user_sarah", title: "Badge Unlocked!", message: "Congratulations! You unlocked the 'Tech Guru' badge.", type: "badge", read: true, createdAt: "2026-03-01T12:00:00Z" }
];

// Helper to get active Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// ================= API ENDPOINTS =================

// Auth APIS
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, bio, skillsOffered, skillsWanted, interests } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: "User already exists with this email" });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?auto=format&fit=crop&q=80&w=150`,
    bio: bio || "Newly registered enthusiast on SkillSwap AI!",
    skillsOffered: skillsOffered || [],
    skillsWanted: skillsWanted || [],
    interests: interests || [],
    careerGoals: "",
    badges: [
      { id: "b_new", name: "First Step", description: "Successfully signed up for SkillSwap AI", icon: "Sparkles", unlockedAt: new Date().toISOString().split('T')[0] }
    ],
    level: 1,
    points: 50,
    joinedAt: new Date().toISOString().split('T')[0]
  };

  users.push(newUser);
  currentUser = newUser;
  res.status(201).json(newUser);
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(400).json({ error: "User not found with this email" });
  }

  currentUser = user;
  res.json(user);
});

app.get("/api/auth/me", (req, res) => {
  res.json(currentUser);
});

app.post("/api/auth/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// Profile APIS
app.post("/api/profile/update", (req, res) => {
  const { name, bio, skillsOffered, skillsWanted, interests, careerGoals, avatar } = req.body;
  
  const userIdx = users.findIndex(u => u.id === currentUser.id);
  if (userIdx === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  // Award points if updating details for the first time
  let pointGain = 0;
  if (!currentUser.careerGoals && careerGoals) {
    pointGain += 50;
  }

  const updatedUser = {
    ...users[userIdx],
    name: name !== undefined ? name : users[userIdx].name,
    bio: bio !== undefined ? bio : users[userIdx].bio,
    skillsOffered: skillsOffered !== undefined ? skillsOffered : users[userIdx].skillsOffered,
    skillsWanted: skillsWanted !== undefined ? skillsWanted : users[userIdx].skillsWanted,
    interests: interests !== undefined ? interests : users[userIdx].interests,
    careerGoals: careerGoals !== undefined ? careerGoals : users[userIdx].careerGoals,
    avatar: avatar !== undefined ? avatar : users[userIdx].avatar,
    points: users[userIdx].points + pointGain
  };

  // Add a badge if profile is fully completed
  if (updatedUser.bio && updatedUser.skillsOffered.length > 0 && updatedUser.skillsWanted.length > 0 && updatedUser.interests.length > 0 && updatedUser.careerGoals && !updatedUser.badges.some(b => b.id === "b_profile")) {
    updatedUser.badges.push({
      id: "b_profile",
      name: "Profile Perfection",
      description: "Completed all sections of your professional profile",
      icon: "UserCheck",
      unlockedAt: new Date().toISOString().split('T')[0]
    });
    updatedUser.points += 100;
    
    // Add notification
    notifications.unshift({
      id: `n_badge_${Date.now()}`,
      userId: updatedUser.id,
      title: "New Badge Unlocked!",
      message: "You unlocked the 'Profile Perfection' badge +100 points!",
      type: "badge",
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  // Recalculate level based on points (each level is 150 points)
  updatedUser.level = Math.max(1, Math.floor(updatedUser.points / 150) + 1);

  users[userIdx] = updatedUser;
  currentUser = updatedUser;
  res.json(updatedUser);
});

// Skills Marketplace APIs
app.get("/api/skills", (req, res) => {
  // Aggregate all skills available from other users
  const result: any[] = [];
  users.forEach(u => {
    u.skillsOffered.forEach(s => {
      result.push({
        userId: u.id,
        userName: u.name,
        userAvatar: u.avatar,
        skillName: s.name,
        category: s.category,
        level: s.level,
        type: "offered",
        userBio: u.bio
      });
    });
    u.skillsWanted.forEach(s => {
      result.push({
        userId: u.id,
        userName: u.name,
        userAvatar: u.avatar,
        skillName: s.name,
        category: s.category,
        level: s.level,
        type: "wanted",
        userBio: u.bio
      });
    });
  });
  res.json(result);
});

// Mentors APIS & Matching Algorithm
app.get("/api/mentors", (req, res) => {
  // Return list of other users, calculate a compatibility score for each relative to the currentUser
  const mentors = users
    .filter(u => u.id !== currentUser.id)
    .map(u => {
      // Compatibility matching score calculation:
      // Count overlap where this user's offered skills match currentUser's wanted skills
      // and this user's wanted skills match currentUser's offered skills
      let teachScore = 0;
      let learnScore = 0;
      let interestScore = 0;

      u.skillsOffered.forEach(offered => {
        const matchesWanted = currentUser.skillsWanted.some(w => w.name.toLowerCase() === offered.name.toLowerCase());
        if (matchesWanted) teachScore += 40;
      });

      u.skillsWanted.forEach(wanted => {
        const matchesOffered = currentUser.skillsOffered.some(o => o.name.toLowerCase() === wanted.name.toLowerCase());
        if (matchesOffered) learnScore += 40;
      });

      u.interests.forEach(interest => {
        if (currentUser.interests.some(i => i.toLowerCase() === interest.toLowerCase())) {
          interestScore += 10;
        }
      });

      const totalScore = Math.min(100, Math.max(15, teachScore + learnScore + interestScore));

      // Get match status
      const existingMatch = matches.find(m => 
        (m.mentorId === u.id && m.learnerId === currentUser.id) ||
        (m.mentorId === currentUser.id && m.learnerId === u.id)
      );

      return {
        ...u,
        matchingScore: totalScore,
        matchStatus: existingMatch ? existingMatch.status : "none",
        matchRole: existingMatch ? (existingMatch.mentorId === u.id ? "mentor" : "learner") : "none",
        matchId: existingMatch ? existingMatch.id : null
      };
    });

  // Sort by matching score descending
  mentors.sort((a, b) => b.matchingScore - a.matchingScore);
  res.json(mentors);
});

app.post("/api/mentors/match", (req, res) => {
  const { mentorId, skillName } = req.body;
  if (!mentorId) {
    return res.status(400).json({ error: "mentorId is required" });
  }

  // Check if match already exists
  const existing = matches.find(m => 
    m.mentorId === mentorId && m.learnerId === currentUser.id && m.skillName === skillName
  );

  if (existing) {
    return res.json(existing);
  }

  const newMatch = {
    id: `match_${Date.now()}`,
    mentorId: mentorId,
    learnerId: currentUser.id,
    skillName: skillName || "General Mentorship",
    status: "pending" as const,
    createdAt: new Date().toISOString()
  };

  matches.push(newMatch);

  // Add Notification for the target mentor
  const targetUser = users.find(u => u.id === mentorId);
  notifications.unshift({
    id: `n_${Date.now()}`,
    userId: mentorId,
    title: "New Swap Request!",
    message: `${currentUser.name} requested a skill swap connection with you for ${skillName || "Mentorship"}.`,
    type: "match",
    read: false,
    createdAt: new Date().toISOString()
  });

  res.status(201).json(newMatch);
});

app.post("/api/mentors/match/action", (req, res) => {
  const { matchId, action } = req.body; // action: 'accept' or 'reject'
  if (!matchId || !action) {
    return res.status(400).json({ error: "matchId and action are required" });
  }

  const matchIdx = matches.findIndex(m => m.id === matchId);
  if (matchIdx === -1) {
    return res.status(404).json({ error: "Match not found" });
  }

  if (action === "accept") {
    matches[matchIdx].status = "connected";
    
    // Notify learner
    const learnerId = matches[matchIdx].learnerId;
    const mentorId = matches[matchIdx].mentorId;
    const mentorUser = users.find(u => u.id === mentorId);
    const learnerUser = users.find(u => u.id === learnerId);

    notifications.unshift({
      id: `n_accept_${Date.now()}`,
      userId: learnerId,
      title: "Skill Swap Approved! 🎉",
      message: `${mentorUser?.name || "Your mentor"} approved your request for ${matches[matchIdx].skillName}. Go ahead and start chatting!`,
      type: "match",
      read: false,
      createdAt: new Date().toISOString()
    });

    // Automatically send a system starter chat message
    messages.push({
      id: `m_sys_${Date.now()}`,
      senderId: mentorId,
      receiverId: learnerId,
      content: `Hello! I have accepted your SkillSwap request for ${matches[matchIdx].skillName}. Let's discuss how we can teach and learn from each other!`,
      timestamp: new Date().toISOString(),
      read: false
    });

    // Grant Points to both
    const mentorIndex = users.findIndex(u => u.id === mentorId);
    if (mentorIndex !== -1) {
      users[mentorIndex].points += 30;
      users[mentorIndex].level = Math.max(1, Math.floor(users[mentorIndex].points / 150) + 1);
    }
    const learnerIndex = users.findIndex(u => u.id === learnerId);
    if (learnerIndex !== -1) {
      users[learnerIndex].points += 30;
      users[learnerIndex].level = Math.max(1, Math.floor(users[learnerIndex].points / 150) + 1);
    }

  } else {
    matches[matchIdx].status = "rejected";
  }

  res.json(matches[matchIdx]);
});

// Chat APIs
app.get("/api/chat/messages", (req, res) => {
  // Return all messages related to current user
  const userMessages = messages.filter(
    m => m.senderId === currentUser.id || m.receiverId === currentUser.id
  );
  res.json(userMessages);
});

app.post("/api/chat/send", (req, res) => {
  const { receiverId, content } = req.body;
  if (!receiverId || !content) {
    return res.status(400).json({ error: "receiverId and content are required" });
  }

  const newMessage = {
    id: `msg_${Date.now()}`,
    senderId: currentUser.id,
    receiverId: receiverId,
    content: content,
    timestamp: new Date().toISOString(),
    read: false
  };

  messages.push(newMessage);

  // Trigger Notification to receiver
  notifications.unshift({
    id: `n_chat_${Date.now()}`,
    userId: receiverId,
    title: `New Message from ${currentUser.name}`,
    message: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
    type: "message",
    read: false,
    createdAt: new Date().toISOString()
  });

  // Award activity points
  const userIdx = users.findIndex(u => u.id === currentUser.id);
  if (userIdx !== -1) {
    users[userIdx].points += 5; // 5 points for every message sent
    users[userIdx].level = Math.max(1, Math.floor(users[userIdx].points / 150) + 1);
    currentUser = users[userIdx];
  }

  res.status(201).json(newMessage);
});

app.post("/api/chat/read", (req, res) => {
  const { senderId } = req.body;
  if (!senderId) {
    return res.status(400).json({ error: "senderId is required" });
  }

  messages = messages.map(m => {
    if (m.senderId === senderId && m.receiverId === currentUser.id) {
      return { ...m, read: true };
    }
    return m;
  });

  res.json({ success: true });
});

// Notifications APIs
app.get("/api/notifications", (req, res) => {
  const userNotifications = notifications.filter(n => n.userId === currentUser.id);
  res.json(userNotifications);
});

app.post("/api/notifications/read", (req, res) => {
  const { notificationId } = req.body;
  
  if (notificationId) {
    notifications = notifications.map(n => {
      if (n.id === notificationId && n.userId === currentUser.id) {
        return { ...n, read: true };
      }
      return n;
    });
  } else {
    // Mark all as read
    notifications = notifications.map(n => {
      if (n.userId === currentUser.id) {
        return { ...n, read: true };
      }
      return n;
    });
  }

  res.json({ success: true });
});

// ================= AI RECOMMENDATIONS WITH GEMINI =================
app.get("/api/ai/recommendations", async (req, res) => {
  const aiClient = getGeminiClient();

  // Create clean string representations of profile for context
  const offeredStr = currentUser.skillsOffered.map(s => `${s.name} (${s.level})`).join(", ");
  const wantedStr = currentUser.skillsWanted.map(s => `${s.name} (${s.level})`).join(", ");
  const interestsStr = currentUser.interests.join(", ");
  const goalsStr = currentUser.careerGoals || "Develop well-rounded technical and soft skills to launch digital projects.";

  // Create summary list of other mentors available in our database
  const availableMentorsList = users
    .filter(u => u.id !== currentUser.id)
    .map(u => ({
      mentorId: u.id,
      name: u.name,
      bio: u.bio,
      skillsOffered: u.skillsOffered.map(s => s.name),
      skillsWanted: u.skillsWanted.map(s => s.name)
    }));

  if (aiClient) {
    try {
      console.log("Preparing live career roadmap request with Gemini fallback mechanism...");
      
      const prompt = `You are the core AI matching and career architect for SkillSwap AI.
Based on the following user profile, provide ultra-personalized career paths, learning plans, skills to master next, and recommend specific mentors from the list of actual other members on our platform.

Current User Profile:
- Name: ${currentUser.name}
- Current Skills Offered: ${offeredStr}
- Skills Desired/Wanted: ${wantedStr}
- Creative & Technical Interests: ${interestsStr}
- Career Ambitions/Goals: ${goalsStr}

Actual Available Mentors/Partners on our platform:
${JSON.stringify(availableMentorsList, null, 2)}

Provide a reply in strict JSON format matching this exact schema:
{
  "skillsToLearnNext": ["string", "string"], 
  "suggestedMentors": [
    { "mentorId": "string", "name": "string", "matchReason": "string" }
  ],
  "careerPath": {
    "role": "string",
    "reason": "string",
    "skillsToLearnNext": ["string", "string"],
    "suggestedLearningPath": ["string", "string"]
  },
  "personalizedTips": ["string", "string"]
}

Make sure that "suggestedMentors" maps 'mentorId' strictly to the IDs from the actual available mentors list provided (e.g. "user_alex", "user_elena", etc.), explaining in "matchReason" why their offered skills fit the current user's wanted skills.`;

      // Fallback model list and retry parameters
      const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
      let lastError: any = null;
      let parsedData: any = null;

      for (const model of modelsToTry) {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            console.log(`[Gemini API] Querying model ${model} (attempt ${attempt}/2)...`);
            const response = await aiClient.models.generateContent({
              model: model,
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    skillsToLearnNext: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "List of 3 physical skills to prioritize learning next."
                    },
                    suggestedMentors: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          mentorId: { type: Type.STRING },
                          name: { type: Type.STRING },
                          matchReason: { type: Type.STRING }
                        },
                        required: ["mentorId", "name", "matchReason"]
                      },
                      description: "List of recommended mentor connections from our database."
                    },
                    careerPath: {
                      type: Type.OBJECT,
                      properties: {
                        role: { type: Type.STRING, description: "Recommended title (e.g. AI Product Designer)" },
                        reason: { type: Type.STRING, description: "Why this fits their profile perfectly." },
                        skillsToLearnNext: { type: Type.ARRAY, items: { type: Type.STRING } },
                        suggestedLearningPath: { type: Type.ARRAY, items: { type: Type.STRING } }
                      },
                      required: ["role", "reason", "skillsToLearnNext", "suggestedLearningPath"]
                    },
                    personalizedTips: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Practical career development tips."
                    }
                  },
                  required: ["skillsToLearnNext", "suggestedMentors", "careerPath", "personalizedTips"]
                }
              }
            });

            const responseText = response.text || "";
            parsedData = JSON.parse(responseText.trim());
            console.log(`[Gemini API] Successfully compiled recommendations with model ${model}!`);
            break; // Break the attempt loop
          } catch (err) {
            lastError = err;
            console.warn(`[Gemini API] Attempt ${attempt} with model ${model} failed:`, err);
            if (attempt < 2) {
              // Wait 1.5 seconds before retrying
              await new Promise(resolve => setTimeout(resolve, 1500));
            }
          }
        }
        if (parsedData) {
          break; // Break the model loop if we have parsed data
        }
      }

      if (parsedData) {
        return res.json({ ...parsedData, isFallback: false });
      } else {
        throw lastError || new Error("All Gemini models failed to return content.");
      }

    } catch (error) {
      console.error("Gemini API Error, falling back to local recommendations engine:", error);
      // Fallback is handled below
    }
  }

  // Local rule-based AI recommendation logic (offline fallback)
  // This executes if process.env.GEMINI_API_KEY is not configured yet or fails
  console.log("Serving offline recommendation engine...");
  
  // Custom logic to recommend standard skills
  const skillsToLearnNext = ["Figma & UI/UX Design", "React Frontend", "Tailwind CSS", "Systems Design"];
  
  // Recommend mentors who teach what current user wants
  const suggestedMentors = users
    .filter(u => u.id !== currentUser.id)
    .map(u => {
      let overlapCount = 0;
      u.skillsOffered.forEach(offered => {
        if (currentUser.skillsWanted.some(w => w.name.toLowerCase().includes(offered.name.toLowerCase()) || offered.name.toLowerCase().includes(w.name.toLowerCase()))) {
          overlapCount += 2;
        }
      });
      return { u, overlapCount };
    })
    .sort((a, b) => b.overlapCount - a.overlapCount)
    .slice(0, 2)
    .map(item => ({
      mentorId: item.u.id,
      name: item.u.name,
      matchReason: item.overlapCount > 0 
        ? `Offers exact match for your wanted skills (${item.u.skillsOffered.map(s => s.name).join(", ")}).` 
        : `Shares collaborative interests in tech, design, and career growth.`
    }));

  const fallbackResponse = {
    skillsToLearnNext,
    suggestedMentors,
    careerPath: {
      role: "AI Product Designer & Technologist",
      reason: "By blending your advanced Python & Machine Learning research background with UI/UX Design and React Frontend knowledge, you can lead the wave of modern AI-driven startups as a product-minded creator.",
      skillsToLearnNext: ["Design Systems", "Figma Interactive Prototyping", "State Management in React"],
      suggestedLearningPath: [
        "1. Learn wireframing and responsive designs with Alex Rivera",
        "2. Build React components for your Python model APIs with Devon Blake",
        "3. Understand roadmaps and Agile iterations with PM Elena Rostova"
      ]
    },
    personalizedTips: [
      "Dedicate 4 hours a week to skill-swapping calls. Teaching Python reinforces your fundamentals!",
      "Build a portfolio that displays both your technical algorithms and beautiful, usable interfaces.",
      "Document your journey on blogs or newsletters to earn extra career points and establish peer authority."
    ],
    isFallback: true
  };

  res.json(fallbackResponse);
});


// Start server setup
async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
