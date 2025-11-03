# 💬 Linq Messenger

> **Linq Messenger** is a modern messenger inspired by **Telegram**, built with **Next.js** and **NestJS**.  
> It features **JWT authentication**, messaging, media uploads, user profiles, theme switching, and stores data in **PostgreSQL** via **Prisma**.

---

## ✨ Key Features

✅ **JWT Authentication** (login / registration / refresh)  
💬 **Private and group chats**  
📧 Email verification via **NodeMailer** during registration
🧠 **Zustand** — simple and fast global state  
⚡ **React Query + Axios** — request caching and optimization  
📎 **Multer + Supabase Storage** — file uploads  
🎨 **TailwindCSS + shadcn/ui** — modern UI with **theme switching** (dark/light)  
🐘 **PostgreSQL + Prisma** — reliable database  
🔌 **WebSockets (planned)** — real-time messaging  

---

## 🧩 Tech Stack

| Category | Technologies |
|:---------|:------------|
| **Frontend** | Next.js • React Query • Zustand • TailwindCSS • shadcn/ui • Axios |
| **Backend** | NestJS • Prisma • Multer • JWT • Bcrypt • NodeMailer |
| **Database** | PostgreSQL |
| **Storage** | Supabase Storage |
| **(Planned)** | WebSockets (`@nestjs/websockets`, `socket.io`) |

---

## ⚙️ Project Architecture

### **Frontend (Next.js)**
- 🧱 FSD (Feature-Sliced Design) architecture  
- 🔁 Caching with **React Query**  
- 💾 Global state via **Zustand**  
- 🔗 API requests with **Axios**  
- 🎨 **TailwindCSS + shadcn/ui** for components and **theme switching**  

### **Backend (NestJS)**
- 🧱 Modular architecture: `auth`, `user`, `chats`, `messages`, `files`...  
- 🔐 **JWT authentication** (access + refresh tokens)  
- 📦 **Prisma ORM**  
- 📤 **Multer + Supabase Storage** for file uploads  
- 🧩 Ready for **WebSockets integration**

---

## 📦 Environment Variables

This project uses **.env** files for configuration. Example files are provided as **.env.example** in both server and client folders.

---

## 📦 Installation & Running

### 1️⃣ Clone the repository
```bash
git clone https://github.com/endorii/linq-messenger.git
cd linq-messenger
```

Install dependencies

Frontend
```bash
cd client
npm install
```

Backend
```bash
cd server
npm install
```

Prisma migrations
```bash
cd server
npx prisma migrate dev
```

Start the project

Backend
```bash
npm run dev
```

Frontend
```bash
npm run dev
```

🔗 Open http://localhost:3000

## 🌱 Future Development

- WebSockets for real-time messaging
- End-to-End Encryption
- Message search
- PWA support

## 🤝 Contributing

- Fork the repository
- Create a branch feature/your-feature
- Make your changes
- Open a Pull Request 🚀
