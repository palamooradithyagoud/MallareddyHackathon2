# 🚀 HireMate — AI-Powered Career Platform

> **Phase 1 — Production-Ready Foundation**

HireMate is a modern SaaS career platform that helps students and professionals manage their entire career journey — from resume management to AI-powered job matching, interview prep, and skill recommendations.

---

## 📁 Project Structure

```
hacakathon code files/
├── database/               # PostgreSQL schema & seed data
│   ├── schema.sql          # Full DDL: tables, keys, indexes
│   └── seed.sql            # Sample seed data
│
├── backend/                # FastAPI Python backend
│   ├── app/
│   │   ├── main.py         # FastAPI entrypoint & CORS setup
│   │   ├── config.py       # Environment settings (JWT, DB URL)
│   │   ├── database.py     # SQLAlchemy session engine
│   │   ├── dependencies.py # JWT Bearer auth injection
│   │   ├── models/         # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── profile.py
│   │   │   ├── preferences.py
│   │   │   ├── resume.py
│   │   │   ├── settings.py
│   │   │   └── activity.py
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   │   ├── auth.py
│   │   │   ├── profile.py
│   │   │   ├── preferences.py
│   │   │   ├── resume.py
│   │   │   ├── settings.py
│   │   │   └── dashboard.py
│   │   ├── routers/        # API route handlers
│   │   │   ├── auth.py
│   │   │   ├── dashboard.py
│   │   │   ├── profile.py
│   │   │   ├── resume.py
│   │   │   ├── preferences.py
│   │   │   └── settings.py
│   │   └── utils/
│   │       ├── security.py # JWT creation, password hashing
│   │       └── helpers.py  # Activity logging, completion %
│   └── requirements.txt
│
└── frontend/               # React + Vite + TypeScript frontend
    ├── src/
    │   ├── context/        # Global state (Auth, Theme, Toast)
    │   ├── services/       # Axios API client & service modules
    │   ├── components/     # Reusable UI components
    │   ├── layouts/        # DashboardLayout, AuthLayout
    │   └── pages/          # Login, Register, Dashboard, Profile…
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | Core UI framework & build tool |
| TypeScript | Strict type safety |
| TailwindCSS v4 | Utility-first styling |
| React Router v6 | Client-side routing |
| TanStack React Query | Server state & caching |
| React Hook Form + Zod | Form management & validation |
| Framer Motion | Animations & transitions |
| Lucide React | Icon library |
| Axios | HTTP client with interceptors |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | High-performance Python API |
| SQLAlchemy 2.0 | ORM for database models |
| Pydantic v2 | Data validation & schemas |
| python-jose | JWT token generation |
| passlib + bcrypt | Password hashing |
| SQLite (dev) / PostgreSQL (prod) | Database |

### Database
| Technology | Purpose |
|---|---|
| PostgreSQL (Supabase) | Production database |
| UUID Primary Keys | Unique identifiers |
| JSONB columns | Rich nested data (experience, skills) |
| Cascade deletes | Referential integrity |
| Indexed foreign keys | Optimized queries |

---

## ⚡ Getting Started (Local Development)

### Prerequisites
- **Python** 3.10+
- **Node.js** 18+
- **npm** 9+

---

### 1. Clone / Open the Project

```bash
cd "hacakathon code files"
```

---

### 2. Setup the Backend

```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start the FastAPI server (with hot-reload)
uvicorn backend.app.main:app --port 8000 --reload
```

> Backend runs at: **http://localhost:8000**
> Swagger UI docs: **http://localhost:8000/docs**

---

### 3. Setup the Frontend

```bash
cd frontend

# Install Node dependencies
npm install

# Start the Vite dev server
npm run dev
```

> Frontend runs at: **http://localhost:5173**

---

### 4. Environment Variables (Optional — for Production)

Create a `.env` file in the root of the `backend/` folder:

```env
DATABASE_URL=postgresql://user:password@host:5432/hiremate
JWT_SECRET_KEY=your_super_secret_key_here
ENVIRONMENT=production
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register with email & password |
| `POST` | `/api/auth/login` | Login with email & password |
| `POST` | `/api/auth/google-login` | Login via Google OAuth |
| `POST` | `/api/auth/logout` | Logout & log activity |
| `GET` | `/api/dashboard` | Dashboard summary & stats |
| `GET` | `/api/profile` | Get user profile |
| `PUT` | `/api/profile` | Update user profile |
| `POST` | `/api/resume/upload` | Upload a PDF resume |
| `GET` | `/api/resume` | Get resume metadata |
| `DELETE` | `/api/resume` | Delete resume |
| `GET` | `/api/preferences` | Get career preferences |
| `PUT` | `/api/preferences` | Update career preferences |
| `GET` | `/api/settings` | Get app settings |
| `PUT` | `/api/settings` | Update app settings |
| `DELETE` | `/api/settings/account` | Permanently delete account |

---

## 🎨 Features — Phase 1

### ✅ Authentication
- Email registration & login
- Google OAuth (simulated, plug-in ready)
- JWT-based persistent sessions
- Forgot password & reset password flows
- Protected routes with redirect logic

### ✅ Dashboard
- Welcome banner with SaaS gradient design
- Profile completion progress bar
- Stats cards (Resume, Applications, Saved Jobs)
- AI Career Insights placeholders (ready for Phase 2)
- Recent activity timeline
- Saved jobs & application tracker (placeholder data)
- Quick action navigation cards

### ✅ Profile Management
- Full profile editing with tabbed sections
- Personal Info, Academics, Experience, Certifications, Links
- Dynamic experience & certification lists (add/remove)
- Auto-calculated profile completion percentage
- Avatar initials display

### ✅ Resume Management
- PDF upload with 5MB size validation
- PDF file type enforcement
- Live in-browser PDF preview (iframe)
- Version history tracking
- Replace, delete, and version preview features

### ✅ Career Preferences
- Preferred role, industry, location
- Employment type & work mode selectors
- Salary expectation input
- Interactive skill tag chips (add/remove)

### ✅ Settings
- Dark / Light theme toggle (persisted to localStorage + database)
- Email & push notification toggles
- Language / region selector
- Public profile privacy toggle
- Account deletion with confirmation modal (type `DELETE`)

### ✅ UI / UX
- Premium SaaS dark/light themes
- Glassmorphism sidebar & navbar
- Framer Motion page & card animations
- Slide-in toast notifications
- Skeleton loading states
- Fully responsive mobile layout

---

## 🗄️ Database Schema

7 normalized tables with proper relationships:

```
users → profiles         (1:1, CASCADE)
users → career_preferences (1:1, CASCADE)
users → resumes          (1:1, CASCADE)
resumes → resume_versions (1:N, CASCADE)
users → user_settings    (1:1, CASCADE)
users → activity_logs    (1:N, CASCADE)
```

---

## 🚀 Production Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build         # Creates dist/
# Deploy dist/ folder to Vercel
```

### Backend → Any Python host (Railway, Render, Fly.io)
```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

### Database → Supabase PostgreSQL
Run `database/schema.sql` in the Supabase SQL editor to initialize tables.

---

## 🔮 Future Roadmap (Phase 2+)

- [ ] **AI Resume Builder** — Generate resumes from profile data
- [ ] **ATS Resume Analyzer** — Score & improve resume for ATS systems
- [ ] **AI Job Matching** — Match user profile to live job listings
- [ ] **AI Interview Preparation** — Practice mock interviews with AI
- [ ] **AI Career Coach** — Personalized career path recommendations
- [ ] **AI Skill Recommendations** — Gap analysis & upskilling suggestions
- [ ] **Auto Apply** — AI-powered automated job applications
- [ ] **Career Analytics** — Charts, trends, and career progress visualization

---

## 👨‍💻 Built For

**Malla Reddy University Hackathon** — Built as a complete Phase 1 SaaS foundation demonstrating scalable architecture, modern UI/UX, and AI-ready backend modular design.

---

> **HireMate** — *Your Career Journey, Elevated.* 🚀
