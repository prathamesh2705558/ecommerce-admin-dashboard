# 🛒 Server-Rendered E-commerce Admin Dashboard

A modern **server-rendered admin dashboard** for e-commerce management, built with **Next.js (Pages Router)**, **MongoDB**, **Tailwind CSS**, and **NextAuth.js**.

🔗 **Live Demo:**  
https://ecommerce-admin-dashboard-fawn.vercel.app  

📦 **GitHub Repository:**  
https://github.com/prathamesh2705558/ecommerce-admin-dashboard  

Demo video link
https://youtu.be/mLC_gi62C3g
---

## 📖 Overview

This project is a **professional admin dashboard** designed for managing an e-commerce platform.  
It provides secure authentication, real-time analytics, and complete inventory management.

The application uses:
- **NextAuth.js** for secure Google authentication
- **MongoDB Atlas** for persistent data storage
- **Server-side rendering** for performance and SEO benefits

---

## 🛠 Tech Stack

- **Framework:** Next.js (Pages Router)
- **Authentication:** NextAuth.js (Google OAuth 2.0)
- **Database:** MongoDB Atlas (Mongoose)
- **Styling:** Tailwind CSS
- **Charts & Analytics:** Recharts
- **Deployment:** Vercel

---

## ✨ Features

- 🔐 **Google OAuth Authentication**  
  Secure admin access using Google accounts.

- 📦 **Product Management (CRUD)**  
  Create, update, and delete products with real-time database updates.

- 🖼 **Image Handling**  
  Upload and display product images seamlessly.

- 📊 **Dashboard Analytics**  
  Visual insights for sales, revenue, and inventory levels.

- 🌙 **Fully Responsive Dark UI**  
  Optimized for mobile, tablet, and desktop devices.

---

## 📁 Project Structure

```text
ecommerce-admin-dashboard/
│
├── components/           # Reusable UI components (Layout, Sidebar, Charts)
├── models/               # Mongoose Schemas (Product.js, User.js)
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth].js   # NextAuth configuration
│   │   └── products.js            # Product API routes
│   │
│   ├── _app.js           # Global styles & providers
│   ├── index.js          # Dashboard overview
│   └── products/         # Product management pages
│
├── lib/                  # MongoDB connection logic
├── public/               # Static assets (images, icons)
├── styles/               # Global CSS & Tailwind config
├── .env                  # Environment variables
├── next.config.js        # Next.js configuration
└── package.json          # Project dependencies
```
🔑 Admin Access

This dashboard is protected for administrative use only.

To evaluate the project:

Visit the Live Demo

Click Login with Google

Authenticate using your Google account

Access the admin dashboard and features

🚀 Getting Started (Local Setup)
1️⃣ Clone the Repository
git clone https://github.com/prathamesh2705558/ecommerce-admin-dashboard.git
cd ecommerce-admin-dashboard

2️⃣ Install Dependencies
npm install --legacy-peer-deps

3️⃣ Configure Environment Variables

Create a .env file in the root directory and add:

MONGODB_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000

4️⃣ Run the Development Server
npm run dev


Open http://localhost:3000
 in your browser 🚀
