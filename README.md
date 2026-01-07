Server-Rendered E-commerce Admin Dashboard
Built with Next.js (Pages Router), MongoDB, Tailwind CSS, and NextAuth.js.

View Live Demo | Watch Technical Walkthrough

Overview
This is a professional server-rendered admin dashboard designed for e-commerce management. It features a secure login system, real-time analytics, and full inventory management capabilities. The application uses NextAuth.js for secure Google authentication and MongoDB as a persistent data store.

Tech Stack
Framework: Next.js (Pages Router)

Authentication: NextAuth.js (Google OAuth 2.0)

Database: MongoDB Atlas (Mongoose)

Styling: Tailwind CSS

Charts: Recharts (Data Visualization)

Deployment: Vercel

Features
Google OAuth Integration: Secure admin access using existing Google accounts.

Product CRUD: Add, Edit, and Delete products with real-time database updates.

Image Handling: Display and manage product imagery.

Dashboard Analytics: Visual representation of sales, revenue, and stock levels.

Fully Responsive: Dark-themed UI that works seamlessly across mobile, tablet, and desktop.

📁 Project Structure
Based on the Pages Router architecture:

Plaintext

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
│   └── products/        # Product Management Pages (New, Edit)
├── lib/                 # Database Connection (mongodb.js)
├── public/              # Static Assets (Images, Icons)
├── styles/              # Global CSS & Tailwind
├── .env                 # Environment Variables
├── next.config.js       # Next.js Configuration
└── package.json         # Project Dependencies
🔑 Admin Access
This dashboard is protected. For evaluation:

Go to the Live Demo.

Click Login with Google.

Authenticate with your Google account to gain access to the admin panels.

🚀 Local Setup
Clone the repository:

Bash

git clone https://github.com/prathamesh2705558/ecommerce-admin-dashboard.git
cd ecommerce-admin-dashboard
Install dependencies:

Bash

npm install --legacy-peer-deps
Configure Environment Variables: Create a .env file in the root directory:

Code snippet

MONGODB_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
Run Development Server:

Bash

npm run dev