# DECISIONS.md

## Decision 1: Backend Framework

### Options Considered

* Spring Boot
* Node.js + Express

### Selected

Spring Boot 3 with Java 21

### Reason

Strong ecosystem, excellent security support, JPA/Hibernate integration, and suitability for enterprise-grade REST APIs.

---

## Decision 2: Frontend Framework

### Options Considered

* React
* Angular
* Vue

### Selected

React with Vite

### Reason

Fast development experience, component reusability, strong ecosystem, and simple integration with REST APIs.

---

## Decision 3: Database Choice

### Options Considered

* MySQL
* PostgreSQL
* MongoDB

### Selected

MySQL

### Reason

Assignment required a relational database. MySQL is widely used, easy to deploy, and integrates well with Spring Data JPA.

---

## Decision 4: Authentication Strategy

### Options Considered

* Session-based Authentication
* JWT Authentication

### Selected

JWT Authentication

### Reason

Stateless architecture, easier frontend integration, and suitable for REST APIs.

---

## Decision 5: Application Architecture

### Options Considered

* Monolithic Controller-Based Design
* Layered Architecture

### Selected

Layered Architecture

### Reason

Clear separation of concerns and improved maintainability.

Layers:

* Controller
* Service
* Repository
* DTO
* Entity

---

## Decision 6: Expense Splitting Logic

### Options Considered

* Equal Split Only
* Multiple Split Strategies

### Selected

Multiple Split Strategies

### Reason

To closely match Splitwise core functionality.

Implemented:

* Equal Split
* Unequal Split
* Percentage Split
* Share-Based Split

---

## Decision 7: Real-Time Communication

### Options Considered

* Polling
* WebSockets

### Selected

WebSockets (STOMP + SockJS)

### Reason

Provides instant updates and a better user experience for group chat.

---

## Decision 8: API Response Standardization

### Options Considered

* Different Response Structures Per Endpoint
* Unified Response Structure

### Selected

Unified Response Structure

### Reason

Improves frontend integration and consistency.

Format:

{
"success": true,
"message": "Operation successful",
"data": {}
}

---

## Decision 9: Deployment Strategy

### Options Considered

* Local Deployment
* Cloud Deployment

### Selected

Cloud Deployment

### Reason

Assignment required a publicly accessible deployed application.

Services:

* Frontend: Vercel
* Backend: Render
* Database: Railway MySQL

---

## Decision 10: Containerization

### Options Considered

* Direct Runtime Deployment
* Docker Deployment

### Selected

Docker Deployment

### Reason

Provides consistent build and runtime environments across local and cloud deployments.

---

## Decision 11: AI-Assisted Development

### Options Considered

* Traditional Development
* AI-Assisted Development

### Selected

AI-Assisted Development

### Reason

Assignment explicitly required AI collaboration.

Tools Used:

* ChatGPT
* Claude
* Antigravity
* GitHub Copilot/Codex

AI was used for planning, implementation guidance, debugging, refactoring, and documentation while all final decisions and integrations were reviewed manually.

---

## Final Outcome

A deployed Splitwise-inspired application supporting:

* Authentication
* Group Management
* Expense Management
* Multiple Split Strategies
* Balance Tracking
* Settlements
* Real-Time Chat
* Dashboard Analytics

built using a modern full-stack architecture and AI-assisted development workflow.
