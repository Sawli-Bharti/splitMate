# Graph Report - .  (2026-07-30)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1028 nodes · 2896 edges · 53 communities (41 shown, 12 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 80 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ce68dfa6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ChatMessageResponse
- CustomUserDetails
- AuthContext.jsx
- AuthController.java
- GroupDetailsPage.jsx
- SettlementHistoryResponse
- CreateSettlementDialog.jsx
- SplitType
- ExpenseResponse
- DashboardController.java
- User
- Group
- JwtAuthenticationFilter
- cn
- BalanceResponse
- BalanceGroupView.jsx
- ExpenseServiceImpl
- Balance
- ApiResponse
- devDependencies
- BaseEntity
- dependencies
- components.json
- dashboard/DashboardPage.jsx
- GroupMemberRepository
- Settlement
- AppRoutes.jsx
- SettlementDetailsPage.jsx
- ExpenseDetailsPage.jsx
- BalanceSummaryCards.jsx
- GroupMember
- SettlementsPage.jsx
- mvnw
- WebSocketConfig.java
- package.json
- ApplicationConfig.java
- TestController
- SplitmateApplicationTests.java
- SplitmateApplication
- ChatMessageList.jsx
- class-variance-authority
- clsx
- @tailwindcss/vite
- react
- react-router-dom
- sockjs-client
- tailwind-merge
- tailwindcss
- vercel.json
- com.splitmate:splitmate

## God Nodes (most connected - your core abstractions)
1. `User` - 134 edges
2. `Group` - 63 edges
3. `CustomUserDetails` - 46 edges
4. `ApiResponse` - 45 edges
5. `cn()` - 40 edges
6. `Expense` - 30 edges
7. `ExpenseServiceImpl` - 28 edges
8. `showToast()` - 25 edges
9. `Balance` - 24 edges
10. `SplitType` - 24 edges

## Surprising Connections (you probably didn't know these)
- `AuthServiceImpl` --references--> `UserRepository`  [EXTRACTED]
  backend/splitmate/src/main/java/com/splitmate/auth/service/impl/AuthServiceImpl.java → backend/splitmate/src/main/java/com/splitmate/user/repository/UserRepository.java
- `ExpenseResponse` --references--> `BalanceResponse`  [EXTRACTED]
  backend/splitmate/src/main/java/com/splitmate/expense/dto/ExpenseResponse.java → backend/splitmate/src/main/java/com/splitmate/balance/dto/BalanceResponse.java
- `Balance` --inherits--> `BaseEntity`  [EXTRACTED]
  backend/splitmate/src/main/java/com/splitmate/balance/entity/Balance.java → backend/splitmate/src/main/java/com/splitmate/common/entity/BaseEntity.java
- `Balance` --references--> `Group`  [EXTRACTED]
  backend/splitmate/src/main/java/com/splitmate/balance/entity/Balance.java → backend/splitmate/src/main/java/com/splitmate/group/entity/Group.java
- `Balance` --references--> `User`  [EXTRACTED]
  backend/splitmate/src/main/java/com/splitmate/balance/entity/Balance.java → backend/splitmate/src/main/java/com/splitmate/user/entity/User.java

## Import Cycles
- None detected.

## Communities (53 total, 12 thin omitted)

### Community 0 - "ChatMessageResponse"
Cohesion: 0.07
Nodes (38): ChatController, GetMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, ChatMessageResponse, AllArgsConstructor (+30 more)

### Community 1 - "CustomUserDetails"
Cohesion: 0.07
Nodes (34): CustomUserDetails, Override, RequiredArgsConstructor, GroupController, DeleteMapping, GetMapping, PostMapping, RequestMapping (+26 more)

### Community 2 - "AuthContext.jsx"
Cohesion: 0.07
Nodes (39): api, App(), queryClient, styles, Toaster(), AuthContext, AuthProvider(), useAuth() (+31 more)

### Community 3 - "AuthController.java"
Cohesion: 0.08
Nodes (28): AuthController, GetMapping, PostMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, AuthResponse (+20 more)

### Community 4 - "GroupDetailsPage.jsx"
Cohesion: 0.13
Nodes (33): ChatContainer(), ChatInput(), ErrorState(), LoadingSpinner(), CreateGroupDialog(), EditGroupDialog(), formatDate(), MemberList() (+25 more)

### Community 5 - "SettlementHistoryResponse"
Cohesion: 0.11
Nodes (25): GetMapping, PostMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, SettlementController, CreateSettlementRequest (+17 more)

### Community 6 - "CreateSettlementDialog.jsx"
Cohesion: 0.14
Nodes (29): EditMessageDialog(), CreateExpenseDialog(), createExpenseSchema, ExpenseParticipantsTable(), splitTypeLabels, SplitTypeSelector(), AddMemberDialog(), addMemberSchema (+21 more)

### Community 7 - "SplitType"
Cohesion: 0.09
Nodes (21): CalculatedSplit, EqualSplitCalculator, Component, Override, Component, Override, PercentageSplitCalculator, Component (+13 more)

### Community 8 - "ExpenseResponse"
Cohesion: 0.10
Nodes (24): ExpenseController, DeleteMapping, GetMapping, PostMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController (+16 more)

### Community 9 - "DashboardController.java"
Cohesion: 0.11
Nodes (22): DashboardController, GetMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, DashboardSummaryResponse, AllArgsConstructor (+14 more)

### Community 10 - "User"
Cohesion: 0.15
Nodes (15): GroupRepository, GroupServiceImpl, Override, RequiredArgsConstructor, Service, Transactional, AllArgsConstructor, Builder (+7 more)

### Community 11 - "Group"
Cohesion: 0.13
Nodes (20): Expense, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+12 more)

### Community 12 - "JwtAuthenticationFilter"
Cohesion: 0.11
Nodes (23): CustomUserDetailsService, Override, RequiredArgsConstructor, Service, UserDetails, Component, Override, RequiredArgsConstructor (+15 more)

### Community 13 - "cn"
Cohesion: 0.17
Nodes (22): BalanceTable(), currencyFormatter, formatCurrency(), currencyFormatter, dateFormatter, formatCurrency(), formatDate(), getField() (+14 more)

### Community 14 - "BalanceResponse"
Cohesion: 0.14
Nodes (17): BalanceController, GetMapping, RequestMapping, RequiredArgsConstructor, ResponseEntity, RestController, BalanceResponse, AllArgsConstructor (+9 more)

### Community 15 - "BalanceGroupView.jsx"
Cohesion: 0.15
Nodes (23): BalanceGroupView(), BalanceSentences(), currencyFormatter, formatCurrency(), BalanceTableSkeleton(), ExpenseCard(), formatCurrency(), formatDate() (+15 more)

### Community 16 - "ExpenseServiceImpl"
Cohesion: 0.17
Nodes (7): CreateExpenseRequest, Data, ExpenseServiceImpl, Override, RequiredArgsConstructor, Service, Transactional

### Community 17 - "Balance"
Cohesion: 0.17
Nodes (14): Balance, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+6 more)

### Community 18 - "ApiResponse"
Cohesion: 0.24
Nodes (13): AccessDeniedException, GlobalExceptionHandler, ResponseEntity, ApiResponse, AllArgsConstructor, Builder, Data, NoArgsConstructor (+5 more)

### Community 19 - "devDependencies"
Cohesion: 0.11
Nodes (19): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks (+11 more)

### Community 20 - "BaseEntity"
Cohesion: 0.18
Nodes (14): BaseEntity, Getter, PrePersist, Setter, ExpenseParticipant, AllArgsConstructor, Builder, Entity (+6 more)

### Community 21 - "dependencies"
Cohesion: 0.12
Nodes (17): axios, dependencies, axios, lucide-react, react-dom, react-hook-form, @stomp/stompjs, stompjs (+9 more)

### Community 22 - "components.json"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 23 - "dashboard/DashboardPage.jsx"
Cohesion: 0.19
Nodes (10): currencyFormatter, dateFormatter, formatCurrency(), formatDate(), getField(), RecentExpensesTable(), RecentSettlementsTable(), SummaryCards() (+2 more)

### Community 24 - "GroupMemberRepository"
Cohesion: 0.25
Nodes (6): DashboardServiceImpl, Override, RequiredArgsConstructor, Service, Transactional, GroupMemberRepository

### Community 25 - "Settlement"
Cohesion: 0.24
Nodes (10): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, Settlement (+2 more)

### Community 26 - "AppRoutes.jsx"
Cohesion: 0.24
Nodes (6): ChatHeader(), AuthLayout(), DashboardLayout(), navItems, ROUTES, ProtectedRoute()

### Community 27 - "SettlementDetailsPage.jsx"
Cohesion: 0.23
Nodes (10): EmptyState(), ExpenseList(), useSettlement(), currencyFormatter, dateFormatter, findRemainingBalance(), formatCurrency(), formatDate() (+2 more)

### Community 28 - "ExpenseDetailsPage.jsx"
Cohesion: 0.24
Nodes (9): balanceKeys, expenseKeys, useDeleteExpense(), useExpense(), ExpenseDetailsPage(), formatCurrency(), formatDate(), splitTypeColors (+1 more)

### Community 29 - "BalanceSummaryCards.jsx"
Cohesion: 0.24
Nodes (9): BalanceSummaryCards(), BalanceSummarySkeleton(), currencyFormatter, formatCurrency(), getBadgeVariant(), summaryItems, PageHeader(), useMyBalances() (+1 more)

### Community 30 - "GroupMember"
Cohesion: 0.33
Nodes (9): GroupMember, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, PrePersist, Setter (+1 more)

### Community 31 - "SettlementsPage.jsx"
Cohesion: 0.29
Nodes (9): SettlementHistorySkeleton(), currencyFormatter, formatCurrency(), getAmount(), SettlementSummary(), SettlementSummarySkeleton(), useMySettlements(), getSettlementDate() (+1 more)

### Community 32 - "mvnw"
Cohesion: 0.33
Nodes (6): mvnw script, clean(), die(), exec_maven(), set_java_home(), verbose()

### Community 33 - "WebSocketConfig.java"
Cohesion: 0.33
Nodes (7): Configuration, Override, WebSocketConfig, EnableWebSocketMessageBroker, MessageBrokerRegistry, StompEndpointRegistry, WebSocketMessageBrokerConfigurer

### Community 34 - "package.json"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 35 - "ApplicationConfig.java"
Cohesion: 0.53
Nodes (4): ApplicationConfig, Bean, Configuration, PasswordEncoder

### Community 36 - "TestController"
Cohesion: 0.33
Nodes (4): PostMapping, RequestMapping, RestController, TestController

### Community 37 - "SplitmateApplicationTests.java"
Cohesion: 0.60
Nodes (3): SplitmateApplicationTests, SpringBootTest, Test

## Knowledge Gaps
- **88 isolated node(s):** `com.splitmate:splitmate`, `EQUAL`, `UNEQUAL`, `PERCENTAGE`, `SHARE` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `ChatMessageResponse`, `CustomUserDetails`, `AuthController.java`, `SettlementHistoryResponse`, `ExpenseResponse`, `DashboardController.java`, `Group`, `BalanceResponse`, `ExpenseServiceImpl`, `Balance`, `BaseEntity`, `GroupMemberRepository`, `Settlement`, `GroupMember`?**
  _High betweenness centrality (0.214) - this node is a cross-community bridge._
- **Why does `ApiResponse` connect `ApiResponse` to `ChatMessageResponse`, `CustomUserDetails`, `AuthController.java`, `SettlementHistoryResponse`, `ExpenseResponse`, `DashboardController.java`, `BalanceResponse`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `CustomUserDetails` connect `CustomUserDetails` to `ChatMessageResponse`, `AuthController.java`, `SettlementHistoryResponse`, `ExpenseResponse`, `DashboardController.java`, `User`, `BalanceResponse`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `com.splitmate:splitmate`, `EQUAL`, `UNEQUAL` to the rest of the system?**
  _88 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ChatMessageResponse` be split into smaller, more focused modules?**
  _Cohesion score 0.07374890254609306 - nodes in this community are weakly interconnected._
- **Should `CustomUserDetails` be split into smaller, more focused modules?**
  _Cohesion score 0.06829488919041157 - nodes in this community are weakly interconnected._
- **Should `AuthContext.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06949152542372881 - nodes in this community are weakly interconnected._