# 🚀 KanbanPro - Enterprise Grade Task Management

KanbanPro is a professional, real-time Kanban application built for teams that need robust task tracking, role-based access control, and seamless collaboration.

## ✨ Key Features

### 🔐 Advanced Authentication & Security
- **JWT Authentication:** Secure login and registration with hashed passwords (bcrypt).
- **Role-Based Access Control (RBAC):** Define who can view, edit, or manage boards (Admin, Editor, Viewer).
- **Private Boards:** Only invited members can access specific boards.

### 📋 Board Management
- **Multiple Boards:** Create and manage separate boards for different projects.
- **Member Invitations:** Invite team members using their email or username.
- **Role Assignment:** Grant specific permissions to each member.

### ⚡ Professional Kanban UX
- **Smooth Drag & Drop:** Built with `@dnd-kit` for a high-performance, accessible dragging experience.
- **Real-time Sync:** Powered by `Socket.io` — see updates from teammates instantly without refreshing.
- **Task Detailed View:** Rich descriptions, due dates, and priority levels.

### 💬 Collaboration & Tracking
- **Task Comments:** Real-time discussion threads on every task.
- **Activity Logs:** Automatic tracking of every move, edit, and update for full accountability.
- **Assignments:** Assign tasks to specific board members.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS (Modern, Responsive UI)
- **State Management:** Zustand (Efficient & Scalable)
- **Icons:** Lucide React
- **Drag & Drop:** @dnd-kit

### Backend
- **Runtime:** Node.js (Express)
- **Database:** MongoDB (Mongoose)
- **Real-time:** Socket.io
- **Security:** JWT, Bcrypt, Helmet, CORS

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd kanban
```

### 2. Setup Backend
```bash
cd kanban-backend
npm install
```
Create a `.env` file in `kanban-backend/`:
```env
PORT=9000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```
Run the server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../kanban-frontend
npm install
npm run dev
```

---

## 📸 Project Structure

```text
kanban/
├── kanban-backend/
│   ├── src/
│   │   ├── controllers/    # Request logic
│   │   ├── models/         # DB Schemas (User, Board, Task)
│   │   ├── routes/         # API Endpoints
│   │   ├── middlewares/    # Auth & RBAC logic
│   │   └── services/       # Business logic
└── kanban-frontend/
    ├── src/
    │   ├── components/     # UI Components (DND, Modals)
    │   ├── context/        # Auth State
    │   ├── store/          # Zustand Global State
    │   └── pages/          # Layouts & Views
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

## 📝 License
This project is [ISC](https://opensource.org/licenses/ISC) licensed.
