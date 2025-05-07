# TaskCircle - Task Management System 🗂️

A full-stack collaborative task management application built using the MERN stack with Next.js for the frontend and Express.js for the backend.

## 🚀 Tech Stack

- **Frontend**: Next.js (JavaScript), Firebase Auth, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: Firebase Authentication (Email/Password + Google OAuth)
- **Real-Time Features**: Socket.io
- **Deployment**:
  - Frontend: [Vercel](https://task-circle.vercel.app)
  - Backend: [Railway](https://taskcircle-production.up.railway.app)

## 📦 Setup Instructions

### 1. Clone the Repository

git clone https://github.com/InsaneSP/TaskCircle.git
cd task-manager

### 2. Install Dependencies

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

### 3. Run Locally

# Backend
cd backend
npm run dev

# Frontend (in a new terminal)
cd frontend
npm run dev

## 💡 Approach Explanation

### 📁 Folder Structure

- `frontend/`: Next.js client with pages for login, register, dashboard, tasks, and real-time notifications.
- `backend/`: Express.js server handling user creation, task CRUD, notifications, and socket communication.
- `context/AuthContext`: Manages user session globally after login or registration.
- `lib/firebase.js`: Firebase app and auth configuration.

### 🔐 Authentication

- Uses Firebase Authentication for both email/password and Google OAuth.
- After successful login, a user document is created or updated in MongoDB for custom data handling.

### 📌 Features

- Task CRUD (Create, Read, Update, Delete)
- Assign tasks to team members
- Real-time notifications via Socket.io
- Dashboard metrics: task count by status/priority, overdue tasks, etc.
- Password reset via Firebase email

## ⚖️ Assumptions & Trade-offs

### ✅ Assumptions

- Firebase Auth handles all authentication logic; backend is responsible only for MongoDB user/task data.
- All users must be authenticated before accessing the dashboard.
- Users must exist in MongoDB even if signed in via Google.

### ⚠️ Trade-offs

- **Token handling** is minimal (no refresh token or secure backend auth validation) since Firebase manages auth sessions client-side.
- No file uploads or attachments for tasks to keep project lightweight.
- PWA/offline support is optional and not included in the current version.
- Email verification is optional and not enforced for simplicity.


## 📈 Future Improvements

- Recurring tasks and reminders
- PWA offline capability
- Audit logs for admin actions
- Email templates and mail verification flow
- Advanced analytics and filtering options


## 🛠️ Maintained By

Smit Potkar  
[GitHub](https://github.com/InsaneSP) | [LinkedIn](https://www.linkedin.com/in/smit-potkar/)
