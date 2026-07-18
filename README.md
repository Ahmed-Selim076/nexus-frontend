# Nexus — Project Management Tool

A full-stack project management platform (Jira/Trello-style) built with modern technologies.

## 🚀 Live Demo
Frontend: https://nexus-frontend.t9am-w0rk.workers.dev/

## 🛠️ Tech Stack

### Frontend
- React + TypeScript
- TanStack Start — File-based routing & SSR
- Tailwind CSS — Styling
- Framer Motion — Animations
- Radix UI — Accessible components
- Axios — HTTP client

### Backend
- ASP.NET Core — REST API
- Entity Framework Core — ORM
- PostgreSQL — Database
- JWT Authentication — Secure auth
- Google OAuth — Social login
- AutoMapper — Object mapping

## ✨ Features
- 🔐 JWT Authentication (Register / Login) + Google OAuth
- 📋 Kanban-style task boards
- 🗂️ Project creation & management
- 💬 Task comments & discussion threads
- 🔔 Real-time notifications
- 👤 User onboarding flow & profile settings
- 🛡️ Admin panel (users, projects, tasks)
- 🔑 Password reset via email
- 📱 Fully responsive

## 🏗️ Architecture
```
nexus-frontend-main/          # Frontend (React + TypeScript)
├── src/
│   ├── components/
│   │   ├── ui/                # Reusable UI primitives
│   │   └── nexus/              # App-specific components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                     # Utilities & API client
│   └── routes/                  # File-based routing

NexusBackend/                  # Backend (ASP.NET Core)
├── Controllers/                 # API endpoints (Auth, Projects, Tasks, Comments, Users, Notifications)
├── Models/                       # Database models
├── DTOs/                          # Data transfer objects
├── Services/                       # Business logic
├── Data/                            # DbContext + seeder
└── Migrations/                       # EF Core migrations
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- .NET 10 SDK
- PostgreSQL 17

### Backend Setup
```bash
cd NexusBackend
# Update connection string in appsettings.json
dotnet ef database update
dotnet run
```

### Frontend Setup
```bash
cd nexus-frontend-main
npm install
npm run dev
```

## 📊 Database Schema
- **Users** — Authentication & profiles
- **Projects** — Project records & members
- **Tasks** — Kanban tasks linked to projects
- **Comments** — Task discussion threads
- **Notifications** — User notifications

## 👨‍💻 Developer
Built by **Ahmed Selim Mohamed** as a portfolio project showcasing full-stack development skills.
