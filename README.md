# 🏢 Meeting Room Booking App

A modern, full-stack application for managing and booking meeting rooms. Built with a clean, service-oriented architecture for maximum maintainability and scalability.

## 🌟 Key Features

- **📊 Modern Dashboard**: Sleek UI to browse available meeting rooms with real-time status updates.
- **📅 Smart Booking**: Prevent overlapping reservations with automated conflict detection.
- **🛡️ RBAC**: Role-Based Access Control (Admin vs. User) for room management and cancellations.
- **🔄 Service Layer**: Decoupled business logic from controllers for better testability and reusability.
- **🛡️ Type Safe**: Comprehensive TypeScript interfaces across the entire stack.
- **🚦 Global Error Handling**: Standardized API responses and centralized error processing.

## 🏗️ Architecture Overview

### Backend (Express + Sequelize)
- **Controllers**: Thin request handlers that delegate to services.
- **Services**: Dedicated layer for all business logic (Auth, Room, Booking).
- **Middleware**: Global error handling, JWT auth, and role-based permissions.
- **Utils**: Standardized `AppError` and `catchAsync` for clean code.

### Frontend (React + Vite + Tailwind)
- **API Services**: Centralized API communication layer with strict type definitions.
- **Context API**: Global state management for authentication.
- **Components**: Feature-based organization with a modern, glassmorphic design system.

## 🚀 Quick Start

### 1. Backend
```bash
cd backend
npm install
npm run dev # Runs on port 5001
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev # Runs on port 5173
```

## 🔑 Default Credentials
- **Admin**: `admin@example.com` / `adminpasswd123`
- **User**: `user@example.com` / `userpasswd123` (Run `npm run seed` in backend to populate data)