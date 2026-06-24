export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Skill {
  name: string;
  category: string;
  level: SkillLevel;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  interests: string[];
  careerGoals: string;
  badges: Badge[];
  level: number;
  points: number;
  joinedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Match {
  id: string;
  mentorId: string;
  learnerId: string;
  skillName: string;
  status: 'pending' | 'connected' | 'rejected';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'match' | 'message' | 'badge' | 'system';
  read: boolean;
  createdAt: string;
}

export interface AICareerRecommendation {
  role: string;
  reason: string;
  skillsToLearnNext: string[];
  suggestedLearningPath: string[];
}

export interface AIRecommendationResponse {
  skillsToLearnNext: string[];
  suggestedMentors: { mentorId: string; name: string; matchReason: string }[];
  careerPath: AICareerRecommendation;
  personalizedTips: string[];
}
