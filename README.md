
**Frontend:** React.js + React Router  
**Backend:** Node.js + Express.js  
**Database:** MongoDB  
**Authentication:** JWT-based login/signup  

**Hosting:**
- Frontend → Vercel  
- Backend → Render
- Database → MongoDB Atlas

---

## Key Features

| Category | Features |
|-----------|-----------|
| **Authentication & Authorization** | User registration, login/logout, JWT auth |
| **CRUD Operations** | Create, read, update, delete book listings; manage swap requests |
| **Filtering / Searching / Sorting / Pagination** | Search by genre, author, or title; sort by most recent or popular; paginate book lists |
| **Frontend Routing** | Pages: Home, Book List, Book Detail, My Books, Profile |
| **Hosting** | Deploy both frontend and backend with publicly accessible URLs |

---

## Tech Stack

| Layer | Technologies |
|--------|---------------|
| **Frontend** | React.js, React Router, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB|
| **Authentication** | JWT |
| **Hosting** | Vercel, Render, MongoDB Atlas |

---

##  API Overview

| Endpoint | Method | Description | Access |
|-----------|--------|--------------|---------|
| `/api/auth/signup` | POST | Register new user | Public |
| `/api/auth/login` | POST | Authenticate user | Public |
| `/api/books` | GET | Get all books | Authenticated |
| `/api/books` | POST | Add a new book | Authenticated |
| `/api/books/:id` | PUT | Update book details | Authenticated |
| `/api/books/:id` | DELETE | Delete a book | Admin only |
