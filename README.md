# 🦷 Smiley — Digital Dental Health Tracker

> A full-stack MERN web application for managing dental health records, tracking oral hygiene habits, uploading dental images, and booking appointments between patients and dentists.

---

## 📌 Project Overview

**Smiley** bridges the gap between patients and dentists by replacing paper-based dental records with a modern web-based system. Patients can upload dental photos, log daily brushing and flossing habits, report symptoms, and book appointments — while dentists get a dedicated dashboard to view patient records and add diagnosis notes.

---

## ✨ Features

### 🧑 Patient

- Register & login with JWT authentication
- Upload dental images (front, left, right, top, bottom views)
- Report symptoms with severity levels
- Book appointments with available dentists
- Track daily brushing, flossing & mouthwash habits
- View personal health score based on recent habits
- View all past diagnosis notes from dentists

### 🩺 Dentist

- View all registered patients
- Access patient symptoms, uploaded images, and habit logs
- Add diagnosis notes with treatment plans and medications
- Confirm, complete, or manage appointments

---

## 🛠️ Tech Stack

| Layer          | Technology                     |
| -------------- | ------------------------------ |
| Frontend       | React 18 + Vite                |
| Styling        | Tailwind CSS (dark blue theme) |
| Routing        | React Router v6                |
| HTTP Client    | Axios                          |
| Backend        | Node.js + Express.js           |
| Database       | MongoDB + Mongoose             |
| Authentication | JWT (JSON Web Tokens)          |
| File Upload    | Multer (local storage)         |
| Notifications  | React Hot Toast                |

---

## 📁 Project Structure

```
smiley-dental-tracker/
├── frontend/                  # React + Vite app
│   └── src/
│       ├── components/        # Navbar, Loader
│       ├── context/           # AuthContext (global auth state)
│       ├── pages/             # Login, Register, Dashboards, etc.
│       ├── routes/            # AppRoutes, ProtectedRoute
│       └── services/          # Axios API instance
│
└── backend/                   # Node.js + Express server
    ├── config/                # MongoDB connection
    ├── controllers/           # Business logic
    ├── middleware/            # Auth, roles, upload, error handling
    ├── models/                # Mongoose schemas
    ├── routes/                # API endpoints
    ├── uploads/               # Locally stored dental images
    └── utils/                 # Token generation, score calculator
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running locally)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/BilalKalyar-200/smiley-dental-tracker.git
cd smiley-dental-tracker
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=Your local host URL
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
```

Create the uploads folder (Git doesn't track empty folders):

```bash
mkdir uploads
```

Start the backend server:

```bash
npm run dev
```

You should see:

```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:5000
```

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` folder:

```env
VITE_API_URL=YOUR FRONTEND URL (VITE)
```

Start the frontend:

```bash
npm run dev
```

Open your browser at: **http://localhost:5173**

---

## 🗺️ API Endpoints

### Auth

| Method | Endpoint             | Description        | Access    |
| ------ | -------------------- | ------------------ | --------- |
| POST   | `/api/auth/register` | Register new user  | Public    |
| POST   | `/api/auth/login`    | Login user         | Public    |
| GET    | `/api/auth/me`       | Get logged-in user | Protected |

### Images

| Method | Endpoint             | Description          | Access  |
| ------ | -------------------- | -------------------- | ------- |
| GET    | `/api/images`        | Get my dental images | Patient |
| POST   | `/api/images/upload` | Upload new image     | Patient |
| DELETE | `/api/images/:id`    | Delete an image      | Patient |

### Symptoms

| Method | Endpoint        | Description        | Access  |
| ------ | --------------- | ------------------ | ------- |
| GET    | `/api/symptoms` | Get my symptoms    | Patient |
| POST   | `/api/symptoms` | Report new symptom | Patient |

### Appointments

| Method | Endpoint                       | Description            | Access  |
| ------ | ------------------------------ | ---------------------- | ------- |
| GET    | `/api/appointments/my`         | Patient's appointments | Patient |
| GET    | `/api/appointments/dentists`   | List of dentists       | Patient |
| POST   | `/api/appointments`            | Book appointment       | Patient |
| PUT    | `/api/appointments/:id/cancel` | Cancel appointment     | Patient |
| GET    | `/api/appointments/dentist`    | Dentist's appointments | Dentist |
| PUT    | `/api/appointments/:id/status` | Update status          | Dentist |

### Habits

| Method | Endpoint            | Description        | Access  |
| ------ | ------------------- | ------------------ | ------- |
| GET    | `/api/habits`       | Get habit logs     | Patient |
| GET    | `/api/habits/score` | Get health score   | Patient |
| POST   | `/api/habits`       | Log today's habits | Patient |

### Dentist

| Method | Endpoint                   | Description          | Access  |
| ------ | -------------------------- | -------------------- | ------- |
| GET    | `/api/dentist/patients`    | All patients list    | Dentist |
| GET    | `/api/dentist/patient/:id` | Patient full details | Dentist |
| POST   | `/api/dentist/diagnosis`   | Add diagnosis note   | Dentist |

---

## 🗃️ Database Collections

| Collection       | Purpose                      |
| ---------------- | ---------------------------- |
| `users`          | Patients and dentists        |
| `dentalimages`   | Uploaded dental photos       |
| `symptoms`       | Patient symptom reports      |
| `appointments`   | Booking records              |
| `habitlogs`      | Daily brushing/flossing logs |
| `diagnosisnotes` | Dentist diagnosis entries    |

---

## 🧪 Testing the App

1. **Register** as a Patient and as a Dentist (use different emails)
2. **Login** as Patient → explore Dashboard, upload images, report symptoms, book appointment, log habits
3. **Login** as Dentist → view patients, open a patient profile, add a diagnosis note
4. **Check MongoDB Compass** → connect to `mongodb://localhost:27017` → open `smiley_db` to see your data live

---

## 🔐 Environment Variables

| Variable       | Location      | Description                        |
| -------------- | ------------- | ---------------------------------- |
| `PORT`         | backend/.env  | Backend server port (default 5000) |
| `MONGO_URI`    | backend/.env  | MongoDB connection string          |
| `JWT_SECRET`   | backend/.env  | Secret key for JWT signing         |
| `JWT_EXPIRE`   | backend/.env  | Token expiry (e.g. 30d)            |
| `VITE_API_URL` | frontend/.env | Backend API base URL               |

> ⚠️ Never commit `.env` files to GitHub. They are in `.gitignore`.

---

## 🚧 Git Milestones

| Milestone | Commit Message                                                             |
| --------- | -------------------------------------------------------------------------- |
| 0         | `feat: project foundation — server, DB, models, middleware, frontend base` |
| 1         | `feat: authentication — register & login with JWT`                         |
| 2         | `feat: patient and dentist dashboards with stats`                          |
| 3         | `feat: dental image upload, gallery, and delete`                           |
| 4         | `feat: symptom reporting and history`                                      |
| 5         | `feat: appointment booking, listing, and cancellation`                     |
| 6         | `feat: daily habit tracker with health score calculator`                   |
| 7         | `feat: dentist patient details with symptoms, images, diagnosis notes`     |

---

## 👨‍💻 Developer

**Bilal Mohsin, Muhammad Tahir and Ali Meekal**

BS Computer Sceince Students — Semester Project 2026

---

## 📄 License

This project is built for academic purposes.
