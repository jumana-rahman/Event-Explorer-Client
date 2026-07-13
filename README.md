# 🎉 Event Explorer

A modern full-stack event management platform built with **React, TypeScript, Express.js, MongoDB, and Better Auth** that enables users to discover, create, and manage events while providing administrators with powerful moderation and analytics tools.

The platform follows a complete event approval workflow where users can submit events for review, and administrators can approve or reject them before they become publicly visible. Designed with scalability, clean architecture, and responsive user experience in mind, Event Explorer delivers a seamless experience across desktop, tablet, and mobile devices.

---

## 🌐 Live Links

- **Live Website:** https://event-explorer-client.vercel.app
- **Client Repository:** https://github.com/jumana-rahman/Event-Explorer-Client
- **Server Repository:** https://github.com/jumana-rahman/Event-Explorer-Server

---

# ✨ Features

### 🌍 Public Visitors

- Browse all approved events
- Search events by title, organizer, or location
- Filter events by category and city
- Sort events by newest, oldest, price, and alphabetical order
- View detailed event information
- Explore featured and upcoming events
- Subscribe to the newsletter
- Responsive design for all screen sizes

### 👤 Registered Users

- Secure authentication using Better Auth
- Create and submit new events
- Manage personal events
- Delete owned events
- Track approval status
- Personalized dashboard with statistics
- View recent activities

### 👑 Administrator

- Manage all registered users
- Promote or demote users
- Suspend or activate user accounts
- Approve or reject submitted events
- Delete any event
- View platform-wide analytics
- Interactive dashboard with charts

---

# 🛠️ Tech Stack

## Frontend

- React.js
- TypeScript
- Tailwind CSS
- DaisyUI

## Backend

- Node.js
- Express.js
- TypeScript
- Better Auth

## Database

- MongoDB

---

# 📦 NPM Packages

## Client

```text
react
react-dom
react-router-dom
typescript
tailwindcss
daisyui
better-auth
react-hook-form
zod
@hookform/resolvers
react-hot-toast
sweetalert2
framer-motion
recharts
react-icons
swiper
```

## Server

```text
express
typescript
better-auth
mongodb
dotenv
cors
cookie-parser
tsx
nodemon
```

---

# 📁 Folder Structure

```
client
├── src
│   ├── components
│   ├── context
│   ├── data
│   ├── pages
│   ├── routes
│   ├── services
│   ├── types

server
├── lib
├── api
├── index.ts
```

---

# 🔐 Authentication & Authorization

Authentication is powered by **Better Auth**.

### Authentication Features

- User Registration
- Secure Login
- Logout
- Session Management
- HTTP-only Cookies
- Protected Routes

### Authorization

**User**

- Browse events
- Create events
- Delete own events
- Manage personal events

**Admin**

- Manage users
- Moderate events
- View analytics
- Manage platform content

---

# 📊 Event Workflow

```
User Creates Event
        │
        ▼
     Pending
        │
 ┌──────┴──────┐
 ▼             ▼
Approved    Rejected
```

Only approved events are visible to the public.

---

# 🚀 Getting Started

## Clone the repositories

```bash
git clone https://github.com/jumana-rahman/Event-Explorer-Client

git clone https://github.com/jumana-rahman/Event-Explorer-Server
```

---

## Install Dependencies

### Frontend

```bash
cd Event-Explorer-Client
npm install
```

### Backend

```bash
cd Event-Explorer-Server
npm install
```

---

# ⚙️ Environment Variables

## Client (.env)

```env
VITE_API_URL=http://localhost:5000

VITE_IMGBB_API_KEY=YOUR_IMGBB_API_KEY
```

## Server (.env)

```env
PORT=5000

MONGODB_URI=YOUR_MONGODB_URI

BETTER_AUTH_SECRET=YOUR_SECRET_KEY

BETTER_AUTH_URL=http://localhost:5000

CLIENT_URL=http://localhost:5173
```

---

# ▶️ Running the Application

### Start Backend

```bash
npm run dev
```

Runs on:

```
http://localhost:5000
```

### Start Frontend

```bash
npm run dev
```

Runs on:

```
http://localhost:5173
```

---


# 🚀 Future Enhancements

- Event ticket booking
- Online payment integration
- Google Maps support
- QR Code tickets
- Email notifications
- Event reviews and ratings
- Calendar integration
- Wishlist functionality
- Dark mode

---

# 👨‍💻 Author

**Jumana**

---

## ⭐ If you like this project, consider giving it a star!