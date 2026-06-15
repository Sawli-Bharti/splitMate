# AI_CONTEXT.md

## Project Overview

Project Name: SplitMate

SplitMate is a Splitwise-inspired expense-sharing application that enables users to create groups, record expenses, split costs using multiple strategies, track balances, settle debts, and communicate through real-time group chat.

---

## Product Understanding

The goal was to reverse engineer the core functionality of Splitwise and implement a simplified but production-ready version within the assignment timeline.

Core workflows identified:

* User Registration and Login
* Group Creation and Management
* Expense Creation and Splitting
* Balance Tracking
* Settlement Recording
* Real-Time Group Chat
* Dashboard and Analytics

---

## Product Scope

### In Scope

* JWT Authentication
* Group Management
* Expense Management
* Equal Split
* Unequal Split
* Percentage Split
* Share-Based Split
* Group Balances
* Individual Balances
* Settlement Recording
* Real-Time Chat
* Dashboard

### Out of Scope

* Email Invitations
* Push Notifications
* Multi-Currency Support
* OCR Receipt Scanning
* Mobile Applications
* Advanced Analytics

---

## Technology Stack

### Backend

* Java 21
* Spring Boot 3
* Spring Security
* JWT
* Spring Data JPA
* Hibernate
* MySQL
* WebSocket
* STOMP
* SockJS

### Frontend

* React
* JavaScript
* Vite
* Tailwind CSS
* React Router
* Axios
* React Query

### Deployment

* Render (Backend)
* Vercel (Frontend)
* Railway MySQL (Database)

---

## Database Schema

### Users

* id
* name
* email
* password

### Groups

* id
* name
* description
* createdBy

### Group Members

* id
* groupId
* userId

### Expenses

* id
* title
* description
* amount
* paidBy
* splitType

### Expense Participants

* id
* expenseId
* userId
* amountOwed
* percentage
* shares

### Settlements

* id
* payerId
* receiverId
* amount

### Chat Messages

* id
* groupId
* senderId
* message

---

## API Design

Authentication:

* POST /api/auth/register
* POST /api/auth/login
* GET /api/auth/me

Groups:

* CRUD operations
* Member management

Expenses:

* Create Expense
* Get Expenses
* Expense Details

Balances:

* Group Balance Summary
* Individual Balance Summary

Settlements:

* Create Settlement
* Settlement History

Chat:

* WebSocket endpoints
* Group messaging

---

## Frontend Structure

Pages:

* Login
* Register
* Dashboard
* Groups
* Group Details
* Expenses
* Balances
* Settlements
* Chat

Architecture:

* Components
* Pages
* Services
* Hooks
* Context Providers

---

## AI Tools Used

* ChatGPT
* Claude
* Antigravity
* GitHub Copilot/Codex

AI was used for:

* Requirement clarification
* Architecture planning
* Code generation
* Debugging
* Refactoring
* Documentation

All generated code was reviewed and modified manually.

---

## Testing Approach

* Backend API Testing using Postman
* Manual UI Testing
* Authentication Testing
* Expense Calculation Validation
* Settlement Validation
* Chat Functionality Verification

---

## Trade-offs

* Focused on core Splitwise features
* Simplified invitation workflow
* Simplified notification system
* Prioritized deployment and functionality over advanced UI enhancements

---

## Known Limitations

* No email notifications
* No mobile application
* No receipt scanning
* No multi-currency support
* Limited analytics

---

## Final Outcome

A deployed Splitwise-inspired application supporting authentication, groups, expenses, settlements, balances, dashboard analytics, and real-time communication.
