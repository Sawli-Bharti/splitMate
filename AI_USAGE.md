# AI_USAGE.md

## AI Tools Used

The project was developed using the following AI tools:

1. ChatGPT
2. Claude
3. Antigravity
4. GitHub Copilot / Codex

The AI tools were used as development assistants for architecture planning, code generation, debugging, refactoring, documentation, and deployment support.

---

## Key Prompts Used

### Prompt 1: Project Architecture

"Create a production-ready architecture for a Splitwise-inspired application using React, Spring Boot, MySQL, JWT authentication, and WebSockets."

### Prompt 2: Expense Splitting Logic

"Implement expense management supporting equal, unequal, percentage, and share-based splitting with proper validation and balance calculations."

### Prompt 3: API Standardization

"Create a consistent API response format using ApiResponse<T>, DTO-based responses, global exception handling, and frontend-friendly JSON structures."

### Prompt 4: Frontend Development

"Build React pages and components for authentication, group management, expenses, balances, settlements, dashboard analytics, and real-time chat."

### Prompt 5: Deployment

"Prepare Docker configuration and deployment setup for Render, Railway MySQL, and Vercel."

---

## Case 1: Incorrect Expense Participant Validation

### AI Output

The AI initially allowed expense participants that were not members of the selected group.

### Problem Identified

This could create invalid expenses and inconsistent balance calculations.

### How It Was Detected

Manual testing during expense creation revealed that non-group members could be included in expense participants.

### Fix Applied

Added backend validation to verify that every participant belongs to the group before expense creation.

### Result

Expense creation now fails with a meaningful validation error when invalid participants are provided.

---

## Case 2: Settlement Calculation Logic

### AI Output

The initial settlement implementation checked only direct debtor-creditor relationships and incorrectly reported that no outstanding balance existed in some valid settlement scenarios.

### Problem Identified

Users with actual outstanding balances were unable to record settlements.

### How It Was Detected

Testing balances and settlements revealed that settlements failed even when users clearly owed money.

### Fix Applied

Settlement validation was updated to use calculated balances instead of relying solely on direct transaction relationships.

### Result

Settlement creation now correctly identifies outstanding balances and allows valid settlements.

---

## Case 3: Frontend Expense Creation Request

### AI Output

The AI generated frontend code that submitted a string value for the payer instead of the numeric user identifier expected by the backend.

### Problem Identified

Expense creation requests failed due to request validation errors.

### How It Was Detected

API testing and frontend integration testing exposed request payload mismatches.

### Fix Applied

Updated frontend-backend integration to ensure the correct payer identifier is submitted and validated.

### Result

Expense creation works correctly across all supported split types.

---

## Case 4: Deployment Configuration

### AI Output

Initial deployment configuration recommendations caused Docker path issues because of incorrect Dockerfile path configuration.

### Problem Identified

Render could not locate the Dockerfile and deployment failed.

### How It Was Detected

Deployment logs reported Dockerfile resolution errors.

### Fix Applied

Reviewed repository structure and corrected Dockerfile path and deployment configuration.

### Result

Backend deployment succeeded successfully.

---

## Human Oversight

AI-generated code was not accepted blindly.

Every major feature was:

* Reviewed manually
* Tested manually
* Debugged manually
* Refactored when necessary
* Validated against project requirements

Final architectural decisions, implementation choices, testing, and deployment decisions were made by the developer.

---

## Conclusion

AI significantly accelerated development, documentation, debugging, and deployment activities. However, multiple issues required manual review and correction, demonstrating the importance of developer oversight when using AI-assisted software engineering workflows.
