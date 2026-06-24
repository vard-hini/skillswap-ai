# SkillSwap AI | Peer-to-Peer Mentoring and Swap Network

SkillSwap AI is a modern, responsive, full-stack peer education platform that enables users to teach what they master in exchange for what they wish to learn—completely bypassing cash tuition fees. It integrates an interactive category-filtered public skills marketplace, a reciprocal compatibility matching algorithm, a real-time message chat portal, and an advanced AI Career and Learning Advisor powered by Google's server-side Gemini AI.

---

## 🚀 Key Value Propositions

1. **Reciprocal Compatibility Matching Matrix**: Calculates compatibility scores dynamically based on the intersection of user teaching capabilities and peer learning objectives.
2. **Interactive Skills Marketplace**: Search, sort, and browse desired vs offered skills with comprehensive level-depth filters (Beginner to Advanced).
3. **Advanced AI Career & Study Advisor**: Connects with server-side Gemini (`gemini-3.5-flash`) via the Google GenAI SDK to generate personalized career paths, milestone lists, and recommend matching peers in the database.
4. **Dynamic Peer Messaging Portal**: Real-time message exchange enabling matches to organize call details, structure learning timelines, and award XP points for communication activity.
5. **Reputation & Gamified Badges**: Gamified leveling systems where users unlock verified medals ("Profile Perfection", "Tech Guru", "Alpha Mentor") and level up based on peer-help activity.
6. **Polished Glassmorphism Theme**: Fully responsive dark/light responsive layout styled with modern tailwind glass panels and motion-smooth entrance animations.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Tailwind CSS, Framer Motion (`motion/react`), Lucide Icons
- **Backend**: Node.js, Express.js
- **Artificial Intelligence**: Google `@google/genai` TypeScript SDK (utilizing `gemini-3.5-flash`)
- **Compilation**: Vite 6, tsx, esbuild (bundling server-side TypeScript to standalone CommonJS outputs)

---

## 📂 Folder Architecture

```text
├── metadata.json           # Cloud configuration and frame permission metadata
├── package.json            # Scripts, dependencies, and builder configuration
├── tsconfig.json           # Strict TypeScript compiler options
├── vite.config.ts          # Vite asset pipeline configuration
├── server.ts               # Custom Express server, mock database state, and Gemini AI endpoints
├── src/
│   ├── main.tsx            # DOM mounting entry point
│   ├── App.tsx             # Main React State Controller & view routing engine
│   ├── index.css           # Global custom theme styles & animations (Tailwind v4 theme variables)
│   ├── types.ts            # Strongly typed TypeScript contracts
│   └── components/         # Modular user interface components
│       ├── Navbar.tsx      # Navigation header with unread notifications bell
│       ├── LandingPage.tsx # Animated hero section, bento showcases, testimonials
│       ├── LoginPage.tsx   # Login page with preset quick-testers profiles
│       ├── RegisterPage.tsx# Onboarding multi-step signup wizard
│       ├── Dashboard.tsx   # Bento metrics counters, XP tracker, match approvals
│       ├── ProfilePage.tsx # Dynamic profile form with Unsplash avatars selection
│       ├── Marketplace.tsx # Filterable search database of offered vs wanted skills
│       ├── MentorMatching.tsx # Peer matrix compatibility scoring listings
│       ├── Chat.tsx        # Conversation room logs and real-time message exchange
│       └── AIRecommendations.tsx # AI Career Path & Advisory with smart offline fallbacks
```

---

## ⚡ Setup & Run Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Secrets (AI recommendations)
To use live, customized Gemini AI recommendations, create a `.env` file at the root or set the environment variable:
```env
GEMINI_API_KEY="your_google_ai_studio_gemini_api_key"
```
*Note: If no API key is specified, SkillSwap AI gracefully triggers its local, offline rule-based recommendation fallback engine so you can fully review the application without configuration blocks.*

### 4. Running the Development Server
```bash
npm run dev
```
The server will boot up and bind to `http://localhost:3000`. Open the browser tab to interact!

### 5. Compiling & Production Bundling
Compile the application assets and bundle the backend code:
```bash
npm run build
```
This writes static files to `/dist` and bundles `/server.ts` into a fast-serving standalone file `/dist/server.cjs`.

### 6. Production Boot
Start the standalone compiled build:
```bash
npm run start
```

---

## 🎓 Student Portfolio Integration

This project displays production-ready architecture designed for resume highlights:
- **Full-Stack Orchestration**: Integrates Express middleware alongside Vite asset compilers, showcasing hybrid dev/production workflows.
- **Strict Separation of Concerns**: Isolates layout, types, server routes, and helper states.
- **Robustness**: Graceful degradation pattern when external model dependencies are disconnected.
- **State Management**: Orchestrates interactive state across multi-step wizards, polling mechanisms, and gamified progress charts.
