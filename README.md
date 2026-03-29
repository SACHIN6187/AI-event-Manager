# 🎉 Event Platform (SaaS)

A full-stack event management platform that allows users to create, manage, and customize events with Free and Pro tier feature gating.

---

## 🚀 Features

### Core Features

* Create and manage events
* Date & time scheduling
* Location-based setup (state & city)
* Free & paid ticketing system
* Cover image selection

### Pro Features

* Unlimited event creation
* Custom theme colors
* Advanced customization

### Smart Features

* AI-powered event generation
* Real-time validation using React Hook Form + Zod
* Feature gating (Free vs Pro)

---

## 🛠 Tech Stack

**Frontend**

* Next.js (App Router)
* React
* Tailwind CSS
* React Hook Form + Zod

**Backend**

* Convex (serverless database & functions)

**Authentication**

* Clerk

**Other Integrations**

* Unsplash API (image picker)

---

## ⚙️ Setup Instructions

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   * Add Clerk keys
   * Add Convex deployment URL

4. Run the development server:

   ```bash
   npm run dev
   ```

---

## 🔐 Key Notes

* Free users can create only **1 event**
* Pro users get **unlimited events + custom themes**
* All feature restrictions are enforced **server-side for security**

---

## 📖 Detailed Documentation

See `PROJECT_OVERVIEW.md` for architecture, decisions, and technical insights.

