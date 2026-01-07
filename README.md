```text
# 🛒 Server-Rendered E-commerce Admin Dashboard

Built with **Next.js (Pages Router)**, **MongoDB**, **Tailwind CSS**, and **NextAuth.js**.

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://ecommerce-admin-dashboard-five.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repo-black)](https://github.com/prathamesh2705558/ecommerce-admin-dashboard)

## 📖 Overview
This is a professional **server-rendered admin dashboard** designed for e-commerce management. It features a secure login system, real-time analytics, and full inventory management capabilities. The application uses **NextAuth.js** for secure Google authentication and **MongoDB** as a persistent data store.

---

## 🛠 Tech Stack
* **Framework:** Next.js (Pages Router)
* **Authentication:** NextAuth.js (Google OAuth 2.0)
* **Database:** MongoDB Atlas (Mongoose)
* **Styling:** Tailwind CSS
* **Charts:** Recharts (Data Visualization)
* **Deployment:** Vercel

---

## ✨ Features
* **Google OAuth Integration:** Secure admin access using existing Google accounts.
* **Product CRUD:** Add, Edit, and Delete products with real-time database updates.
* **Image Handling:** Display and manage product imagery.
* **Dashboard Analytics:** Visual representation of sales, revenue, and stock levels.
* **Fully Responsive:** Dark-themed UI that works seamlessly across mobile, tablet, and desktop.

---

## 📁 Project Structure
```text
ecommerce-admin-dashboard/
├── components/          # Reusable UI (Layout, Sidebar, Charts)
├── models/              # Mongoose Schemas (Product.js, User.js)
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].js  # NextAuth configuration
│   │   └── products.js           # Product API Handlers
│   ├── _app.js          # Global Styles & Providers
│   ├── index.js         # Dashboard Overview / Home
│   └── products/        # Product Management Pages
├── lib/                 # Database Connection (mongodb.js)
├── public/              # Static Assets (Images, Icons)
├── styles/              # Global CSS & Tailwind
├── .env                 # Environment Variables
├── next.config.js       # Next.js Configuration
└── package.json         # Project Dependencies
```