# BUILD_PLAN.md

## 1. Product Research

### Research Process

Splitwise was studied to understand:

* User onboarding
* Group creation workflow
* Expense creation workflow
* Balance calculation logic
* Debt settlement process

### Key Learnings

Users need:

* Clear debt tracking
* Multiple split strategies
* Transparent settlements
* Group collaboration

### Product Assumptions

* Users already know each other's email addresses
* Single currency support
* Group-based expense management

---

## 2. Architecture

### Backend

* Spring Boot 3
* Layered Architecture

Structure:

* Controller
* Service
* Repository
* DTO
* Entity

### Frontend

* React + Vite
* Component-based architecture

Structure:

* Pages
* Components
* Services
* Context
* Hooks

### Database

MySQL relational database.

Main entities:

* User
* Group
* GroupMember
* Expense
* ExpenseParticipant
* Settlement
* ChatMessage

### API Design

REST APIs using standard response format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Deployment

Frontend:

* Vercel

Backend:

* Render

Database:

* Railway MySQL

---

## 3. AI Collaboration Process

### AI Tools Used

* ChatGPT
* Claude
* Antigravity
* GitHub Copilot/Codex

### Collaboration Approach

AI was used as a development assistant to:

* Refine requirements
* Generate boilerplate code
* Suggest architecture
* Debug issues
* Generate documentation

### Context Management

Project context was maintained through:

* PROJECT_CONTEXT.md
* ARCHITECTURE.md
* API_CONVENTIONS.md
* README.md
* AI_CONTEXT.md

### Evolution

The project evolved from:

Authentication
→ Groups
→ Expenses
→ Balances
→ Settlements
→ Dashboard
→ Real-Time Chat
→ Deployment

---

## 4. Trade-offs

### Simplifications

* Email invitation workflow omitted
* Notification system omitted
* Mobile application omitted
* Receipt scanning omitted

### Hardcoded Areas

* Basic role handling
* Single currency support

### Avoided Complexity

* Distributed systems
* Event sourcing
* Advanced analytics
* Offline synchronization

---

## 5. Future Improvements

* Push Notifications
* Mobile App
* Multi-Currency Support
* OCR Receipt Parsing
* Advanced Reporting
* Expense Insights
* Cloud File Storage

---

## Final Result

Successfully delivered a deployed Splitwise-inspired application with:

* Authentication
* Group Management
* Expense Splitting
* Balance Tracking
* Settlements
* Real-Time Chat
* Dashboard Analytics

using a modern full-stack architecture and AI-assisted development workflow.
