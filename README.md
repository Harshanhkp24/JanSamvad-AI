# JanSamvad AI (जनसंवाद AI) 🏛️

**JanSamvad AI** is a modern, transparent civic engagement and district-level governance intelligence platform. It bridges the gap between citizens, elected representatives, and administration through transparent financial tracking, automated AI grievance classification, and real-time project progress monitoring.

> [!NOTE]
> **Prototype & Synthetic Data Notice**: All data in this repository (districts, projects, budgets, contractors, complaints, and citizens) is synthetic and generated strictly for prototype demonstration. Do **NOT** treat any information as real government records.

---

## 🏗️ Architecture & Technology Stack

```
 JanSamvad-AI/
 ├── src/
 │   ├── JanSamvadAI.Api/        # ASP.NET Core 8 Web API (Backend)
 │   │   ├── Controllers/        # REST APIs (Auth, Projects, Financials, Complaints, Regions, Admin)
 │   │   ├── Data/               # Entity Framework Core 8, Migrations & ApplicationDbContext
 │   │   ├── DTOs/               # Data Transfer Objects
 │   │   ├── Models/             # Domain Entities (Projects, Budgets, Complaints, Wards, etc.)
 │   │   ├── Services/           # JWT, AI Client Service, Seed Data Engine
 │   │   └── Middleware/         # Global Exception & Error Handling Middleware
 │   │
 │   ├── JanSamvadAI.Client/     # React 18 + Vite + TypeScript (Frontend)
 │   │   ├── src/pages/          # Dashboard, Projects, Project Details, Grievance Tracker, Filing Wizard
 │   │   ├── src/components/     # Navigation, Interactive Recharts, Leaflet Maps, UI Cards
 │   │   ├── src/context/        # Authentication & Role State Management
 │   │   └── src/services/       # Axios API client with automatic JWT token attachment
 │   │
 │   └── JanSamvadAI.AI/         # FastAPI Python Microservice (AI & NLP)
 │       ├── main.py             # Rule-based NLP classifier, Duplicate Detector, Civic Assistant
 │       └── requirements.txt    # Python dependencies
 │
 └── Database/
     └── JanSamvadAI.sql         # Idempotent database schema deployment script
```

### Technology Highlights
- **Backend**: ASP.NET Core 8, Entity Framework Core 8, ASP.NET Core Identity, JWT Bearer Auth, Swagger / OpenAPI.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts (Data Visualizations), Lucide React (Icons), React-Leaflet.
- **AI Microservice**: Python 3.10+, FastAPI, Uvicorn, Heuristic NLP & Semantic Categorization.
- **Database**: Microsoft SQL Server (LocalDB / SQL Express / Azure SQL).

---

## 🚀 Getting Started & Setup Guide

### 🐳 Quick Start with Docker (Zero Dependencies Required - Recommended)

If you have Docker installed, you can launch the complete full-stack system (SQL Server, ASP.NET Core API, AI Service, and React Frontend) with **one single command**:

```bash
docker compose up --build
```

- **Frontend App**: 👉 [http://localhost:5173](http://localhost:5173)
- **Backend API & Swagger**: 👉 [http://localhost:5000/swagger](http://localhost:5000/swagger)
- **AI NLP Service**: 👉 [http://localhost:8001/ai/health](http://localhost:8001/ai/health)

---

### 💻 Local Development Setup (Manual)

#### 1-Click Launch (Windows PowerShell)
You can run the included launcher script from the root directory to start both Backend and Frontend in separate windows:
```powershell
.\start-dev.ps1
```

#### Step-by-Step Manual Setup

##### 1. Backend Setup (ASP.NET Core API)
```powershell
cd src/JanSamvadAI.Api
dotnet restore
dotnet run --urls "http://localhost:5000;https://localhost:5001"
```
*Note: On first startup, `SeedDataService` will automatically apply migrations and seed the synthetic dataset (districts, wards, contractors, 50 projects with financial data, and ~3,000 complaints).*
👉 Swagger UI: **`http://localhost:5000/swagger`**

##### 2. Frontend Setup (React Client)
```powershell
cd src/JanSamvadAI.Client
npm install
npm run dev
```
👉 Web App: **`http://localhost:5173`**

##### 3. Optional: AI NLP Service (FastAPI Python)
```powershell
cd src/JanSamvadAI.AI
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```
*Note: If the Python AI microservice is not running, the ASP.NET Core backend gracefully falls back to its built-in C# heuristic classification engine automatically.*

---

## 👥 Demo Accounts (Development & Testing)

You can log in to the application using any of the following pre-seeded test accounts (Password for all: `P@ssword1!`):

| Role | Email | Permissions & Capabilities |
| :--- | :--- | :--- |
| **Admin** | `admin@jansamvad.demo` | Full access, audit log monitoring, system configuration |
| **Representative** | `representative@jansamvad.demo` | Ward oversight, budget tracking, milestone approval |
| **Opposition** | `opposition@jansamvad.demo` | Transparency review, delay audits, public project scrutiny |
| **Department Officer** | `officer@jansamvad.demo` | Grievance resolution, status transitions, contractor oversight |
| **Citizen** | `citizen@jansamvad.demo` | File complaints, track grievances, view public funds, submit ratings |

*(The login page also provides 1-click demo login buttons for quick access).*

---

## 📡 REST API Catalog

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate and receive JWT token.
- `POST /api/auth/register` — Register a new citizen account.
- `GET /api/auth/me` — Get profile and roles for the authenticated user.

### 🏗️ Projects & Financial Transparency (`/api/projects`)
- `GET /api/projects` — Paginated list of civic infrastructure projects with status and department.
- `GET /api/projects/{id}` — Project detail summary.
- `GET /api/projects/{id}/financial-summary` — Sanctioned vs. spent budget, breakdown, and remaining funds.
- `GET /api/projects/{id}/contractors` — Assigned contractors and registration details.
- `GET /api/projects/{id}/milestones` — Project milestones with completion percentage.
- `GET /api/projects/{id}/transactions` — Itemized financial disbursement ledger.
- `GET /api/projects/{id}/delays` — Delay logs with cause analysis and delay duration.
- `GET /api/projects/{id}/updates` — Official progress updates and field reports.
- `POST /api/projects/{id}/updates` — Submit an official progress update (Authorized).

### 📢 Civic Grievance System (`/api/complaints`)
- `GET /api/complaints` — Filterable grievances (by ward, department, category, status, priority).
- `GET /api/complaints/{id}` — Full complaint details, history timeline, AI classification, feedback.
- `POST /api/complaints` — Submit a grievance with automated AI category & department assignment.
- `PATCH /api/complaints/{id}/status` — Transition complaint status (Open ➔ InProgress ➔ Resolved ➔ Rejected).
- `POST /api/complaints/{id}/feedback` — Submit citizen satisfaction rating (1–5) and review.
- `GET /api/complaints/categories` — List of grievance categories.
- `GET /api/complaints/stats` — High-level grievance metrics for analytics dashboard.

### 📍 Regions & Departments (`/api/regions`, `/api/departments`)
- `GET /api/regions/districts` — List of administrative districts.
- `GET /api/regions/districts/{id}/constituencies` — Constituencies within a district.
- `GET /api/regions/constituencies/{id}/wards` — Municipal wards in a constituency.
- `GET /api/departments` — List of government departments with project/complaint load.

---

## 🧪 Verification & Health Checks

Run the following commands in PowerShell to verify your setup:

1. **Verify Seed Status**:
   ```powershell
   Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/debug/seed-status' | ConvertTo-Json -Depth 5
   ```
2. **Test Authentication**:
   ```powershell
   $body = @{ email = 'representative@jansamvad.demo'; password = 'P@ssword1!' } | ConvertTo-Json
   Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/auth/login' -ContentType 'application/json' -Body $body | ConvertTo-Json -Depth 5
   ```
3. **Verify Project Financial Summary**:
   ```powershell
   Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/projects/1/financial-summary' | ConvertTo-Json -Depth 5
   ```
4. **Verify Complaints Stats**:
   ```powershell
   Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/complaints/stats' | ConvertTo-Json -Depth 5
   ```

---

## 📄 License & Disclaimer

This project is licensed under the MIT License. Developed for research, demonstration, and civic engagement advancement.
