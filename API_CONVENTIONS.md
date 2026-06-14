# SplitMate API Conventions

## Response Format

All APIs must return:

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Meaningful error message",
  "data": null
}
```

Use:

```java
ApiResponse<T>
```

for all endpoints.

---

## DTO Rules

Never return JPA entities.

Always return DTOs.

Pattern:

```text
Entity
→ Service
→ DTO Mapper
→ Response DTO
```

---

## Controller Rules

Use:

```java
@RestController
@RequestMapping(...)
@RequiredArgsConstructor
```

Return:

```java
ResponseEntity<ApiResponse<T>>
```

---

## Service Rules

Business logic belongs in Service layer.

Controllers must remain thin.

Use constructor injection only.

No field injection.

---

## Validation Rules

Use Jakarta Validation.

Examples:

```java
@NotBlank
@Email
@Size(min = 6)
```

Validation errors must return:

```json
{
  "success": false,
  "message": "Password must be at least 6 characters",
  "data": null
}
```

Return first validation error only.

---

## Security Rules

Authentication:

JWT Bearer Token

Current user access:

```java
@AuthenticationPrincipal CustomUserDetails
```

Never accept current user ID from request body.

Use authenticated user.

---

## Exception Handling

Use GlobalExceptionHandler.

Common exceptions:

* RuntimeException
* EntityNotFoundException
* AccessDeniedException
* IllegalArgumentException
* MethodArgumentNotValidException

All exceptions must follow standard ApiResponse format.

---

## Database Rules

Use JPA + Hibernate.

Use BaseEntity for:

* id
* createdAt
* updatedAt

Avoid N+1 queries.

Use repositories only inside services.

---

## JSON Serialization

Never expose entities.

Prefer DTO mapping.

Avoid:

* Infinite recursion
* LazyInitializationException
* StackOverflowError

Use:

@JsonManagedReference
@JsonBackReference

only when absolutely necessary.

---

## Naming Conventions

Controllers:

* AuthController
* GroupController
* ExpenseController

Services:

* GroupService
* ExpenseService

Implementations:

* GroupServiceImpl
* ExpenseServiceImpl

DTOs:

* CreateExpenseRequest
* ExpenseResponse

Repositories:

* ExpenseRepository

---

## Frontend Compatibility

Frontend:

* React
* JavaScript
* Axios
* React Query

Responses must be frontend-friendly.

Avoid nested entity graphs.

Keep DTOs concise.

---

## SplitMate Modules

Completed:

* Authentication
* Groups
* Expenses
* Balances
* Settlements
* Dashboard

Pending:

* WebSocket Chat
* Frontend Integration
* Deployment
