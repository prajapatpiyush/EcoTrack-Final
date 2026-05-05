# 🌿 EcoTrack — Smart Waste Management Platform

> A full-stack, production-grade waste management platform built with Spring Boot and React.  
> Clean India Green India Initiative 🇮🇳

---

## 📋 Project Overview

EcoTrack is a digital platform that connects **citizens**, **companies**, and **recyclers** to build a sustainable waste management ecosystem. Citizens submit waste and earn real monetary rewards. Companies schedule bulk pickups. Admins manage the full operational chain from collection to recycling.

---

## ✨ Features

### 🌐 Public Platform
- Landing page with hero, problem/solution, and CTA
- Awareness blog with categories and slug-based routing
- Campaigns — clean drives and social initiatives
- Events with participant registration and capacity tracking
- Rewards explanation with rate table
- How It Works — 3-step guide

### 🧑 Citizen Features
- JWT-secured registration and login
- Waste submission (Dry / Wet / E-Waste) with instant reward calculation
- Doorstep pickup scheduling with address and datetime
- Wallet with points + money balance and transaction history
- Pickup history with real-time status tracking
- Event participation with duplicate prevention

### 🏢 Company Features
- Company profile management (Basic / Premium subscription)
- Bulk pickup scheduling by waste type and weight
- Pickup history and status tracking

### ⚙️ Admin Features
- Full analytics dashboard (users, waste, revenue, pickups)
- Pickup management with status transitions (PENDING → ASSIGNED → COMPLETED)
- Inventory tracking (auto-updated on every waste submission)
- Waste batch creation → recycler assignment → processing
- Recycling partner management
- Blog / Campaign / Event content management (full CRUD)

---

## 🛠 Tech Stack

| Layer      | Technology |
|------------|------------|
| Backend    | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth       | JWT (io.jsonwebtoken 0.11.5), BCrypt |
| Database   | MySQL 8 |
| Frontend   | React 18, React Router 6, Axios |
| Styling    | Custom Design System (CSS Variables, Dark Mode) |
| Build      | Maven (backend), Create React App (frontend) |

---

## 🗂 Project Structure

```
EcoTrack/
├── ecotrack-backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/ecotrack/
│       │   ├── config/          # Security, exception handlers
│       │   ├── controller/      # REST endpoints (17 controllers)
│       │   ├── dto/             # Request/Response DTOs
│       │   ├── entity/          # JPA entities + enums
│       │   ├── repository/      # Spring Data JPA repositories
│       │   ├── security/        # JWT utility, filter, UserDetailsService
│       │   └── service/         # Business logic (14 services)
│       └── resources/
│           └── application.properties
│
└── ecotrack-frontend/
    ├── package.json
    ├── public/index.html
    └── src/
        ├── components/          # 11 reusable UI components
        ├── context/             # AuthContext (JWT state)
        ├── pages/               # 26 pages (public + user + admin + company)
        ├── routes/              # ProtectedRoute
        ├── services/            # Axios API service
        ├── index.css            # Design system (116 CSS tokens)
        └── App.jsx              # Router with 27 routes
```

---

## ⚙️ Setup Guide

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Node.js 18+ and npm

---

### Backend Setup

**1. Create the database**
```sql
CREATE DATABASE ecotrack_db;
```

**2. Configure credentials**

Open `ecotrack-backend/src/main/resources/application.properties` and set:
```properties
spring.datasource.password=your_mysql_password
```

**3. Run the backend**
```bash
cd ecotrack-backend
./mvnw spring-boot:run
```
Or open in IntelliJ IDEA → right-click `EcotrackApplication.java` → Run.

Backend starts at: **http://localhost:8080**

Tables are auto-created by Hibernate (`ddl-auto=update`).

---

### Frontend Setup

**1. Install dependencies**
```bash
cd ecotrack-frontend
npm install
```

**2. Start the dev server**
```bash
npm start
```

Frontend starts at: **http://localhost:3000**

---

## 🧪 Test Flow

### 1. Register accounts
```
POST http://localhost:8080/api/auth/register
{ "name": "Arjun Sharma", "email": "arjun@test.com", "password": "pass123", "role": "CITIZEN" }

POST http://localhost:8080/api/auth/register
{ "name": "Admin", "email": "admin@ecotrack.com", "password": "admin123", "role": "ADMIN" }

POST http://localhost:8080/api/auth/register
{ "name": "EcoFirm", "email": "eco@firm.com", "password": "pass123", "role": "COMPANY" }
```

### 2. Submit waste (CITIZEN)
```
POST /api/waste/submit   { "wasteType": "E_WASTE", "weight": 2.5 }
→ Earn ₹12.50 + 3 points, wallet updated, inventory updated
```

### 3. Check wallet
```
GET /api/wallet          → { totalMoney: 12.50, totalPoints: 3 }
GET /api/transactions    → list of CREDIT entries
GET /api/dashboard       → full summary
```

### 4. Schedule pickup
```
POST /api/pickup/request { "address": "12 MG Road, Indore", "pickupDate": "2026-08-01T10:00:00" }
GET  /api/pickup/user    → pickup with status PENDING
```

### 5. Admin operations
```
GET  /api/admin/dashboard           → platform stats
GET  /api/admin/pickups             → all pickups paginated
PUT  /api/admin/pickup/1/status     { "status": "ASSIGNED" }
POST /api/admin/recyclers           { "name": "GreenCycle", "email": "gc@test.in", "wasteTypesAccepted": "DRY,E_WASTE" }
POST /api/admin/batches             { "wasteType": "E_WASTE", "quantity": 2.0 }
PUT  /api/admin/batches/1/assign    { "recyclerId": 1 }
PUT  /api/admin/batches/1/process
```

### 6. Content management (ADMIN)
```
POST /api/admin/blog     { "title": "...", "content": "...", "author": "EcoTeam", "category": "SUSTAINABILITY" }
GET  /api/public/blogs   → public, no auth needed
POST /api/admin/campaign { "title": "Indore Clean Drive", "location": "Rajwada", "date": "2026-09-01T09:00:00", ... }
POST /api/admin/event    { "title": "Workshop", "location": "IIT Indore", "date": "2026-09-15T10:00:00", "maxParticipants": 50, ... }
POST /api/event/join/1   → register for event (CITIZEN auth)
```

### 7. Company flow
```
GET  /api/company/profile                     → auto-created on first access
PUT  /api/company/profile  { "companyName": "EcoFirm Industries", "subscriptionType": "PREMIUM" }
POST /api/company/pickup   { "wasteType": "DRY", "weight": 50, "pickupDate": "2026-08-15T09:00:00" }
GET  /api/company/pickups  → company pickups list
```

---

## 🔌 API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login, get JWT |
| GET | `/api/public/blogs` | Public | Paginated blog list |
| GET | `/api/public/blog/{slug}` | Public | Blog by slug |
| GET | `/api/public/campaigns` | Public | All campaigns |
| GET | `/api/public/events` | Public | All events (joined state if auth) |
| POST | `/api/waste/submit` | CITIZEN | Submit waste, earn rewards |
| GET | `/api/wallet` | Auth | Wallet balance |
| GET | `/api/transactions` | Auth | Transaction history |
| GET | `/api/dashboard` | Auth | User dashboard data |
| POST | `/api/pickup/request` | Auth | Schedule pickup |
| GET | `/api/pickup/user` | Auth | Own pickups |
| POST | `/api/event/join/{id}` | Auth | Join event |
| GET | `/api/company/profile` | COMPANY | Company profile |
| POST | `/api/company/pickup` | COMPANY | Bulk pickup |
| GET | `/api/admin/dashboard` | ADMIN | Platform analytics |
| GET | `/api/admin/pickups` | ADMIN | All pickups (paginated) |
| PUT | `/api/admin/pickup/{id}/status` | ADMIN | Update pickup status |
| POST | `/api/admin/recyclers` | ADMIN | Add recycler |
| POST | `/api/admin/batches` | ADMIN | Create waste batch |
| PUT | `/api/admin/batches/{id}/assign` | ADMIN | Assign recycler |
| PUT | `/api/admin/batches/{id}/process` | ADMIN | Mark processed |
| POST | `/api/admin/blog` | ADMIN | Create blog |
| POST | `/api/admin/campaign` | ADMIN | Create campaign |
| POST | `/api/admin/event` | ADMIN | Create event |

---

## 🎨 UI Pages

| Route | Page | Access |
|-------|------|--------|
| `/` | Public Home | Public |
| `/how-it-works` | How It Works | Public |
| `/rewards` | Rewards Explainer | Public |
| `/blogs` | Blog Listing | Public |
| `/blogs/:slug` | Blog Detail | Public |
| `/campaigns` | Campaigns | Public |
| `/events` | Events + Join | Public / Auth |
| `/about` | About | Public |
| `/contact` | Contact | Public |
| `/dashboard` | User Dashboard | Auth |
| `/submit-waste` | Waste Submission | Auth |
| `/wallet` | Wallet + Transactions | Auth |
| `/pickup-request` | Schedule Pickup | Auth |
| `/pickup-history` | Pickup History | Auth |
| `/my-events` | Joined Events | Auth |
| `/company/dashboard` | Company Dashboard | COMPANY |
| `/company/pickups` | Company Pickups | COMPANY |
| `/admin/dashboard` | Admin Analytics | ADMIN |
| `/admin/pickups` | Pickup Management | ADMIN |
| `/admin/recyclers` | Recycler Management | ADMIN |
| `/admin/batches` | Batch Management | ADMIN |
| `/admin/blogs` | Blog Management | ADMIN |
| `/admin/campaigns` | Campaign Management | ADMIN |
| `/admin/events` | Event Management | ADMIN |

---

## 📸 Screenshots

> 

-  <img width="1901" height="9308" alt="localhost_3000-EcoTrack" src="https://github.com/user-attachments/assets/d4b43a63-a98a-4ba5-ae55-68ff301eb241" />
-  <img width="1193" height="317" alt="Screenshot 2026-05-05 133618" src="https://github.com/user-attachments/assets/b18cabd9-9195-4a83-9aa1-aeae82a66219" />
- <img width="1113" height="713" alt="Screenshot 2026-05-05 133637" src="https://github.com/user-attachments/assets/08eb5e4a-f446-4ac2-9278-be6b12b553b0" />
- <img width="1895" height="1039" alt="Screenshot 2026-05-05 132910" src="https://github.com/user-attachments/assets/6d9047fa-38d6-4ed5-bb07-5fff65e6e705" />
- <img width="1897" height="986" alt="Screenshot 2026-05-05 133004" src="https://github.com/user-attachments/assets/88845548-6cef-449e-bbe9-05bc0e6a7787" />
- <img width="1886" height="1045" alt="Screenshot 2026-05-05 133033" src="https://github.com/user-attachments/assets/b2e3f9e1-2a32-4030-8d53-f5157858205a" />
- <img width="1894" height="989" alt="Screenshot 2026-05-05 133100" src="https://github.com/user-attachments/assets/b74fe25c-33c8-47eb-b80e-08bebe8ce360" />
- <img width="1902" height="681" alt="Screenshot 2026-05-05 133114" src="https://github.com/user-attachments/assets/a544578b-bc3f-49e4-ac32-f41ea3108f15" />
- <img width="1290" height="796" alt="Screenshot 2026-05-05 133119" src="https://github.com/user-attachments/assets/4f96b77e-b2b8-4c2a-b1dd-51720b085c29" />
- <img width="1901" height="1014" alt="Screenshot 2026-05-05 133143" src="https://github.com/user-attachments/assets/12f9e52a-9429-4e3d-a2d5-f9f946d89d8e" />
- <img width="1879" height="844" alt="Screenshot 2026-05-05 133207" src="https://github.com/user-attachments/assets/c23ef72c-5e43-4965-b03d-002bbb35570c" />
- <img width="1350" height="734" alt="Screenshot 2026-05-05 133221" src="https://github.com/user-attachments/assets/7445ac8c-02eb-495e-b868-106197027bc0" />
- <img width="1896" height="1061" alt="Screenshot 2026-05-05 133234" src="https://github.com/user-attachments/assets/7a228f42-1fd3-4160-bd13-f1f9859e3696" />
- <img width="1289" height="551" alt="Screenshot 2026-05-05 133246" src="https://github.com/user-attachments/assets/23d2dabc-f900-4970-bc90-d0fa9562b7ad" />
- <img width="1892" height="739" alt="Screenshot 2026-05-05 133333" src="https://github.com/user-attachments/assets/e2ef1efc-37ff-4e07-b4ef-0a7b9b545ae8" />
- <img width="1881" height="987" alt="Screenshot 2026-05-05 133351" src="https://github.com/user-attachments/assets/00cd9e55-6dbc-4b0a-88b2-51a360497d83" />
- <img width="1362" height="355" alt="Screenshot 2026-05-05 133413" src="https://github.com/user-attachments/assets/32505a9c-128e-4abd-a644-b1c4bda22995" />
- <img width="1391" height="473" alt="Screenshot 2026-05-05 133604" src="https://github.com/user-attachments/assets/eb5391ce-eaa1-402a-b412-bc68255e382d" />

## Complete Video Tutorial
- 

https://github.com/user-attachments/assets/9a6a5fb3-effa-466d-854e-3cc088fc26d7






---

## 🔒 Security Notes

- All protected endpoints require `Authorization: Bearer <token>` header
- JWT tokens expire after 24 hours (`app.jwt.expiration=86400000`)
- Passwords hashed with BCrypt
- CSRF disabled (stateless JWT architecture)
- Role-based access: CITIZEN / COMPANY / ADMIN
- Public endpoints: `/api/auth/**` and `/api/public/**`

---

## 📦 Built With

- **Spring Boot 3.2** — REST API
- **Spring Security** — JWT auth + role-based access
- **Spring Data JPA + Hibernate** — ORM + MySQL
- **Lombok** — Boilerplate reduction
- **React 18** — Frontend UI
- **React Router 6** — Client-side routing
- **Axios** — HTTP client with JWT interceptor
- **Custom CSS Design System** — 116 tokens, dark mode, responsive

---

*EcoTrack — Smarter Waste. Greener Future. 🌿*


## NOTE: Not Deployed yet, use local host to run it
