# 🌍 Travel Wishlist App

Your personal travel journal and destination wishlist manager — built with MERN Stack (MongoDB, Express.js, React, Node.js).

## ✈️ Live Demo

- **Frontend:** [https://travel-wishlist-app.vercel.app](https://travel-wishlist-app.vercel.app)
- **Backend API:** [https://travel-wishlist-api.onrender.com](https://travel-wishlist-api.onrender.com)

---

## 📸 Features

- 🧭 **Add Dream Destinations** with journal entries, descriptions, and image uploads
- 🖼️ **Image Gallery** with lightbox preview
- 🔍 **Search, Filter & Sort** destinations
- 👁️ **View Journal Mode** with styled layout
- ✏️ **Edit Destinations** — update info, add/remove images
- ❌ **Delete Destinations** anytime
- 🔒 **Authentication** (Register/Login)
- ⚙️ **Change Password & Profile Settings**
- 🗺️ **Interactive Map-based Location Picker**
- 📍 **World Map View** (Visited vs Wishlist pins — upcoming)
- 💰 **Trip Budget Planner** (upcoming)

---

## 🛠️ Tech Stack

| Frontend       | Backend      | Database       | Tools                |
|----------------|--------------|----------------|----------------------|
| React + MUI    | Express.js   | MongoDB Atlas  | Vercel (Frontend)    |
| React Router   | Multer       | Mongoose       | Render (Backend)     |
| Axios          | bcryptjs, JWT| GeoJSON        | Cloudinary (Optional)|

---

## 📁 Folder Structure

travel-wishlist-app/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.js
│ │ └── index.js
│ └── public/
├── server/ # Express backend
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── index.js
│ └── .env
└── README.md

## 🚀 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/AnkitGupta-dev/travel-wishlist-app.git
cd travel-wishlist-app
```

### 2. Setup Backend

```bash
cd server
npm install
npm start
```
🔗 Server runs at: http://localhost:10000

### 3. Setup Frontend

```bash
cd client
npm install
npm start
```
🌐 React app runs at: http://localhost:3000

## 🔐 Authentication Routes

- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login with credentials
- `POST /api/auth/change-password` – Change password (authenticated)
- 🔒 JWT tokens are securely stored in local storage on the client

## 📦 Deployment

- **Frontend deployed on:** [Vercel](https://vercel.com)
- **Backend deployed on:** [Render](https://render.com)

> 🌐 Live App: [https://travel-wishlist-app.vercel.app](https://travel-wishlist-app.vercel.app)  
> ⚙️ Backend API: [https://travel-wishlist-api.onrender.com](https://travel-wishlist-api.onrender.com)

## ✨ Upcoming Features

- 🌍 **World Map View**: See visited vs wishlist places pinned on a map
- 📊 **Trip Budget Planner**: Estimate your expenses for each trip
- 🧠 **AI-based Travel Recommendation** (future)
- 📨 **Share Destinations**: Share your dream trips with friends

## 🙋‍♂️ Author

**Ankit Gupta**

- 🔗 GitHub: [AnkitGupta-dev](https://github.com/AnkitGupta-dev)
- 📧 Contact: ankit.g5903@gmail.com