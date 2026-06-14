# SplitMate

SplitMate is a Splitwise-inspired expense sharing platform that helps users manage group expenses, track balances, settle debts, and communicate with group members in real-time.

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes

### Group Management

* Create Group
* Update Group
* Delete Group
* Add Members
* Remove Members
* View Group Details

### Expense Management

* Create Expenses
* Equal Split
* Unequal Split
* Percentage Split
* Share-Based Split
* Expense History
* Expense Details

### Balance Tracking

* Individual Balance Summary
* Group Balance Summary
* Net Balance Calculation

### Settlements

* Record Settlements
* Settlement History
* Outstanding Balance Tracking

### Real-Time Chat

* Group Chat
* Live Messaging using WebSockets
* Edit Messages
* Delete Messages

### Dashboard

* Total Groups
* Total Expenses
* Total Settlements
* You Owe
* You Are Owed
* Recent Expenses
* Recent Settlements

---

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS
* Shadcn UI
* Axios
* React Query
* React Router DOM

### Backend

* Java 21
* Spring Boot 3
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* WebSocket (STOMP + SockJS)

### Database

* MySQL 8

---

## Project Structure

```text
splitmate/
│
├── backend/
│   └── splitmate/
│
├── frontend/
│
├── PROJECT_CONTEXT.md
├── ARCHITECTURE.md
├── API_CONVENTIONS.md
└── README.md
```

---

## Local Setup

### Backend

```bash
cd backend/splitmate
mvn clean install
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Environment Variables

Frontend:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Backend:

```properties
DB_URL=your_database_url
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret
```

---

## Future Improvements

* Notification System
* Docker Support
* Cloud Storage
* Advanced Analytics
* Mobile Application

---

## Author

Sawli Bharti


