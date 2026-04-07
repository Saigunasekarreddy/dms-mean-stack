# 📄 Document Management System (DMS)

A full-stack Document Management System built using the **MEAN Stack (MongoDB, Express.js, Angular, Node.js)**.
The application allows users to upload, manage, search, and control access to documents with version tracking.

---

## 🚀 Features

### 🔐 Authentication

* User registration and login
* JWT-based authentication
* Protected routes

### 📤 Document Management

* Upload documents (PDFs, images, etc.)
* Tag and categorize files
* Store metadata in MongoDB

### 🔎 Search & Filter

* Search by filename or keywords
* Filter using tags
* Fast querying using indexed fields

### 👥 Permissions

* Role-based access (Admin/User)
* View/Edit permissions per document

### 🕘 Version Control

* Track document updates
* Maintain version history
* Upload new versions without losing old ones

### 📱 Responsive UI

* Fully responsive design
* Works on desktop and mobile

---

## 🏗️ Tech Stack

| Layer          | Technology          |
| -------------- | ------------------- |
| Frontend       | Angular             |
| Backend        | Node.js, Express.js |
| Database       | MongoDB Atlas       |
| Authentication | JWT                 |
| File Upload    | Multer              |

---

## 📁 Project Structure

```
dms-mean-stack/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── screenshots/
├── README.md
└── .gitignore
```

---

## ⚙️ Setup Instructions

### 🔧 Prerequisites

* Node.js (v16 or above)
* MongoDB Atlas account
* Angular CLI installed globally

```bash
npm install -g @angular/cli
```

---

### 🔐 Environment Variables

Create a `.env` file inside the **backend** folder:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### ▶️ Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

### ▶️ Run Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend runs on:

```
http://localhost:4200
```



## 🔌 API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/me`

### Documents

* `POST /api/docs/upload`
* `GET /api/docs`
* `GET /api/docs/search`
* `GET /api/docs/:id`
* `PUT /api/docs/:id`
* `DELETE /api/docs/:id`

---

## ⚠️ Limitations

* Files stored locally (not cloud storage)
* No pagination for large datasets
* Limited UI for managing permissions

---

## 🔮 Future Improvements

* Cloud storage (AWS S3 / GridFS)
* File preview support
* Advanced sharing UI
* Pagination & performance optimization
* Activity logs

---

## 🧠 Real-World Relevance

This system is inspired by platforms like:

* Google Drive
* Microsoft SharePoint

It demonstrates key concepts such as:

* Secure authentication
* Access control
* Metadata-based search
* Version management

---

## 👤 Author

**Sai Gunasekar**
SRM University AP

---

## 📬 Submission Note

This project was developed as part of a technical assignment and follows all required guidelines including:

* Clean structure
* README with setup steps
* Screenshots of all major pages
* Real-world feature implementation

---
