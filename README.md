# 🧠 NeuroDesk (Beta)

An elite, full-stack **AI-augmented productivity workspace** engineered with a **Modern Utility aesthetic**.

NeuroDesk unifies granular workspace orchestration, multi-layered project tracking, intelligent notification pipelines, and contextual AI strategy generation into a single high-performance dashboard.

---

## ⚡ Core Features

### 🖥️ Command-Center Dashboard

- 2:1 split grid layout
- Real-time delivery statistics
- Animated task completion tracking
- Instant contextual overview

### 🤖 AI Strategy Planner

- Converts complex objectives into structured execution plans
- Custom prompt-driven architecture
- Designed for high-priority workflows

### 📅 Dedicated Schedule Engine

- Full-screen calendar interface
- Multi-layered daily agenda streams
- AI-powered task prioritization

### ⌨️ Omnipresent Command Palette

- Instant query execution
- Auto-focus modal for speed and accessibility

### 🏢 Unified Workspace System

- Multi-workspace architecture
- Project and task hierarchy
- Invitation & collaboration system
- Granular admin controls

---

## 🛠️ Tech Stack

### Frontend

- **Next.js (App Router)**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**

### Backend

- **Node.js**
- **Express**
- **MongoDB + Mongoose**

### Authentication

- **Better Auth** (session-based auth + node verification)

### Communication

- **Nodemailer** (custom email pipelines)

---

## 📂 Project Structure

```
app/
├── dashboard/        # Command Center UI
├── calendar/         # Full-screen schedule system
├── tasks/            # Task management
├── projects/         # Project infrastructure
├── page.tsx          # Dashboard + AI Planner

components/
├── layout/
│   └── AppLayout.tsx   # Global layout + command palette
├── ui/
│   └── ThemeToggle.tsx # Theme switcher
```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/your-username/neurodesk.git
cd neurodesk
```

### 2. Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
BETTER_AUTH_SECRET=your_auth_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Service
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

---

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

App will run at:

```
http://localhost:3000
```

---

## 📡 Deployment (Vercel)

This project is optimized for **Vercel deployment**.

### Important Notes:

- Ensure all environment variables are configured in Vercel
- Uses **dynamic rendering (`force-dynamic`)** to prevent static build issues
- Supports real-time database syncing without SSR conflicts

---

## 🧩 Architecture Highlights

- Multi-tenant database schema design
- Modular workspace system
- Scalable API layer with Express
- Type-safe frontend architecture
- AI-assisted workflow planning engine

---

## 🎯 Philosophy

> Built with an absolute focus on **Learning by Building — 2026**

NeuroDesk is not just a productivity tool — it's a system designed to:

- Think
- Plan
- Execute
- Scale

---

## 👨‍💻 Author

**Mohammad Hasib**
Full-Stack Developer (AI-Driven Systems)

---

## 📜 License

This project is currently in **Beta**. Licensing will be defined in future releases.

---

## ⭐ Future Roadmap

- Advanced AI automation agents
- Real-time collaboration (WebSockets)
- Mobile responsive optimization
- Plugin system for extensions
- Analytics & productivity insights

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push and open a PR

---

## 💡 Final Note

NeuroDesk is designed for developers, builders, and thinkers who want **clarity, control, and intelligent execution** in one workspace.

---
