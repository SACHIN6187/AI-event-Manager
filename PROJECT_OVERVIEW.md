# 📘 Project Overview – Event Platform

## 🧩 Introduction

This project is a full-stack SaaS-style event management platform where users can create, manage, and customize events.

The system includes a Free and Pro tier model to simulate real-world product monetization and feature gating.

---

## 🎯 Problem Statement

Many event platforms are either too complex or lack customization for smaller creators. This project aims to provide a simple yet powerful tool with scalable architecture and monetization capabilities.

---

## 🏗️ Architecture

### Frontend

* Built using Next.js (App Router)
* Form handling with React Hook Form and Zod
* Dynamic UI based on user subscription (Free vs Pro)

### Backend

* Convex used for database and serverless functions
* Queries and mutations handle all business logic

### Authentication

* Clerk used for user authentication
* Backend verifies users using `ctx.auth.getUserIdentity()`

---

## 🔐 Feature Gating System

Implemented a **dual-layer feature gating system**:

### 1. Frontend (UX Layer)

* Disables Pro features visually
* Shows upgrade modals

### 2. Backend (Security Layer)

* Enforces:

  * Event creation limits
  * Theme color restrictions

This prevents users from bypassing restrictions via API manipulation.

---

## 🧠 Key Engineering Decisions

### 1. Server-Side Validation

All critical logic is handled in backend mutations to ensure data integrity and security.

### 2. Indexed Queries

Used indexes like:

* `by_token` → fetch user efficiently
* `by_organizer` → fetch user events

This improves performance and scalability.

### 3. Form Validation Strategy

* Zod ensures schema validation
* React Hook Form ensures performance

### 4. Date-Time Handling

Custom function combines date + time inputs into timestamps for consistent backend storage.

---

## ⚠️ Challenges & Solutions

### Authentication in Backend

* Challenge: Securely identifying users in Convex
* Solution: Used Clerk identity + indexed DB queries

### Preventing Free Tier Abuse

* Challenge: Users bypassing frontend limits
* Solution: Enforced checks in backend mutations

### UI/UX for Feature Locking

* Challenge: Making Pro features visible but restricted
* Solution: Disabled UI + upgrade prompts

---

## 📈 Scalability Considerations

* Serverless backend (Convex) allows horizontal scaling
* Indexed queries improve performance
* Feature gating logic is reusable for future features

---

## 🚀 Future Improvements

* Stripe integration for subscription billing
* Event analytics dashboard
* Email notifications & reminders
* Public event discovery page
* Role-based access (organizer vs attendee)

---

## 🧠 Learnings

* Importance of backend validation over frontend trust
* Designing SaaS-style feature gating systems
* Structuring scalable full-stack applications

---

## ✅ Conclusion

This project demonstrates full-stack development, product thinking, and real-world SaaS architecture, including authentication, feature gating, and scalable backend design.
