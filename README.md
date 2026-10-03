# MyLocal Services — Mapping Essential Public Services

> **University of Mumbai — B.Sc. Computer Science Semester V**  
> **Course:** Community Engagement Project (CEP)  
> **Website Name:** MyLocal Services  
> **Tagline:** Find Essential Services Around You  

---

## 📌 Project Overview

**MyLocal Services** is a civic-technology web platform developed in accordance with the **University of Mumbai B.Sc. Computer Science Semester V Community Engagement Project (CEP)** syllabus.

The project addresses a critical community challenge: residents, commuters, and senior citizens frequently face difficulty locating reliable, verified, and accessible information regarding essential public amenities in their locality—such as 24/7 casualty hospitals, subsidized generic pharmacies (Jan Aushadhi), police beat chowkis, municipal sanitation blocks, fire stations, and ward administrative offices.

This digital platform features:
1. **Interactive Geospatial Directory:** Filter and search facilities by category, locality, operating hours, and wheelchair accessibility.
2. **Interactive Map (GIS):** Built with **Leaflet** and **OpenStreetMap** (100% free, zero paid API keys needed) with custom SVG markers and instant popups.
3. **Emergency Quick-Dial Hub (`/emergency`):** Direct one-tap contact to Mumbai 112, 108, 100, 101, 1091, 1916, and cataloged 24/7 hospitals.
4. **Community Survey (`/survey`):** 4-step resident questionnaire capturing on-ground access barriers, transit issues, and infrastructure recommendations.
5. **Community Feedback (`/feedback`):** Star-rating and review system with admin approval moderation.
6. **CEP Research Findings (`/project-data`):** Interactive **Recharts** visualizations displaying spatial distribution, accessibility readiness, and community concerns.
7. **Complete Secure Admin Panel (`/admin/login`):** Separate password-protected dashboard for the student research team to manage services, categories, survey records, feedback moderation, and website content without touching source code.

> **Ethical Fieldwork Disclosure:**  
> All sample records loaded into the directory are explicitly tagged with **`[DEMO DATA]`** badges. As on-ground surveys and locality visits are conducted by students, the demo data can be directly updated or replaced via the Admin Panel.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Component-based, lightning-fast client interface |
| **Styling** | Tailwind CSS, Lucide React | Modern civic-tech aesthetic, responsive design system |
| **Maps** | Leaflet, React-Leaflet, OpenStreetMap | Open geospatial mapping with zero external API fees |
| **Analytics** | Recharts | Academic survey and accessibility charts |
| **Backend** | Node.js, Express.js | High-performance RESTful API architecture |
| **Database** | MongoDB / Mongoose + Zero-Setup Fallback | Schema models with persistent file store fallback |
| **Auth & Security** | JWT (JSON Web Tokens), bcryptjs | Secure password hashing and token-based admin access |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher recommended; tested on Node.js v24)
- **npm** (comes with Node.js)
- *(Optional)* **MongoDB** (Local `mongod` or MongoDB Atlas URI). If MongoDB is not running, the application automatically uses its high-performance local persistent store, allowing immediate grading and evaluation with zero prerequisites!

---

### Step 1: Install Dependencies

From the project root:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Or from the root directory:
```bash
npm run install:all
```

---

### Step 2: Environment Configuration

Both `backend/.env` and `backend/.env.example` are pre-configured:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mylocal_cep
JWT_SECRET=mylocal_services_mumbai_cep_jwt_secret_key_2026
NODE_ENV=development
```

> **Note on MongoDB Connection:**
> - If you have a local MongoDB server or a free MongoDB Atlas URI, specify it in `backend/.env` as `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mylocal_cep`.
> - If no MongoDB server is detected, the backend seamlessly switches to its **Persistent Storage Engine** (saved in `backend/data/*.json`), guaranteeing that all CRUD operations and data changes persist across server restarts.

---

### Step 3: Run the Application

You can launch both frontend and backend concurrently using the root runner:

```bash
# From project root
npm start
```

Or start them individually in two terminal windows:

**Terminal 1 — Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
# API Status: http://localhost:5000/api/status
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

Open **`http://localhost:5173`** in your web browser.

---

## 🔐 Admin Portal & Default Credentials

The project administrator portal is kept separate from the public navigation to prevent unauthorized public edits.

- **Admin Login Route:** `http://localhost:5173/admin/login`
- **Default Email:** `admin@mylocal.org`
- **Default Password:** `admin123`

*(The login page also provides a one-click auto-fill button for fast evaluation.)*

Inside the Admin Panel, you can:
- **Services:** Add, edit, delete, toggle verification, and update GPS coordinates (`latitude`, `longitude`).
- **Categories:** Add new civic categories, select Lucide icons, and assign colors.
- **Survey Responses:** Review and search resident questionnaire submissions.
- **Feedback Moderation:** Approve genuine resident testimonials to publish them on `/feedback`.
- **Website Content:** Update homepage heading, description, about text, and contact information without editing code.
- **Settings:** Change admin password and inspect database connection status.

---

## 📋 10-Step CEP Research Methodology (University of Mumbai)

1. **Select Locality:** Demarcate boundary wards in Mumbai (e.g., Dadar, Parel, Bandra, Kurla).
2. **Conduct Field Visits:** Physical on-ground survey of transit corridors and residential streets.
3. **Identify Essential Services:** Locate hospitals, pharmacies, police stations, public sanitation units, municipal schools, etc.
4. **Collect Information:** Record operating hours, emergency facilities, contact numbers, and wheelchair access.
5. **Conduct Community Survey:** Deploy structured questionnaire to residents on service access difficulties.
6. **Verify Information:** Cross-verify collected data with official municipal notices and spot-checks.
7. **Store Data Digitally:** Save records into normalized MongoDB schema structures.
8. **Develop Web Application:** Deliver accessible UI/UX with Leaflet mapping and mobile responsiveness.
9. **Analyse Collected Data:** Generate statistical charts of service clustering and accessibility readiness.
10. **Prepare Findings & Recommendations:** Formulate structured recommendations for municipal civic authorities.

---

## 📁 Project Structure

```
cep/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection & dual-mode fallback
│   ├── controllers/
│   │   ├── authController.js     # Admin login, profile, password change
│   │   ├── serviceController.js  # Services CRUD, filters, statistics
│   │   ├── categoryController.js # Categories management & dynamic counts
│   │   ├── surveyController.js   # Multi-step survey submission & analytics
│   │   ├── feedbackController.js # Feedback moderation & public review
│   │   └── contentController.js  # Dynamic site content management
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT token verification
│   │   └── errorHandler.js       # Centralized error handling
│   ├── models/
│   │   ├── User.js               # Admin user schema
│   │   ├── Category.js           # Category schema
│   │   ├── Service.js            # Essential service facility schema
│   │   ├── SurveyResponse.js     # Survey response schema
│   │   ├── Feedback.js           # Feedback & reviews schema
│   │   └── SiteContent.js        # Dynamic site text configuration
│   ├── routes/                   # Express API route declarations
│   ├── data/
│   │   ├── seedData.js           # Seed data with Mumbai localities & demo tags
│   │   └── store.js              # Persistent storage engine
│   ├── uploads/                  # Uploaded service photos
│   ├── server.js                 # Express application entrypoint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, DemoBanner, Skeleton, Modal, EmptyState
│   │   │   ├── map/              # InteractiveMap (Leaflet GIS)
│   │   │   ├── service/          # ServiceCard with category styling & directions
│   │   │   └── admin/            # AdminLayout & ProtectedRoute
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Admin authentication provider
│   │   │   └── ToastContext.jsx  # Notification toast system
│   │   ├── hooks/
│   │   │   └── useDebounce.js    # Search debouncing hook
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Civic landing page with floating service cards
│   │   │   ├── ServicesPage.jsx  # Directory with debounce search & filter chips
│   │   │   ├── ServiceDetailPage.jsx # Facility profile with mini map & directions
│   │   │   ├── MapPage.jsx       # Split-screen Leaflet map & list
│   │   │   ├── EmergencyPage.jsx # 24/7 helplines & emergency facilities
│   │   │   ├── SurveyPage.jsx    # 4-step community questionnaire
│   │   │   ├── FeedbackPage.jsx  # Star rating & approved reviews
│   │   │   ├── AboutPage.jsx     # Problem statement & 10-step CEP methodology
│   │   │   ├── ProjectDataPage.jsx # Recharts visualizations & recommendations
│   │   │   ├── NotFoundPage.jsx  # 404 handler
│   │   │   └── admin/            # Dashboard, Services, Categories, Surveys, Feedback, Content, Settings
│   │   ├── services/
│   │   │   └── api.js            # Unified API fetch client
│   │   ├── utils/
│   │   │   └── iconMap.jsx       # Dynamic Lucide icon mapper
│   │   ├── App.jsx               # React Router configuration
│   │   ├── main.jsx
│   │   └── index.css             # Tailwind CSS & Leaflet custom styling
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── run.js                        # Cross-platform concurrent runner
├── package.json                  # Root npm scripts
└── README.md
```

---

## 🌐 Production Deployment

- **Frontend (Vercel / Netlify):**
  - Build command: `npm run build`
  - Output directory: `dist`
  - Set `VITE_API_URL` environment variable to your deployed backend URL (e.g. `https://your-api.onrender.com/api`).
- **Backend (Render / Railway / Fly.io):**
  - Start command: `node server.js`
  - Set environment variables: `PORT=5000`, `NODE_ENV=production`, `JWT_SECRET=your_jwt_secret`, `MONGODB_URI=your_mongodb_atlas_uri`.

---

## 📜 License & Academic Attribution
Created for the **University of Mumbai B.Sc. Computer Science Semester V Community Engagement Project (CEP)**. Open-source under the MIT License for civic and educational benefit.
