package com.splitmate.expense.controller;

import com.splitmate.common.response.ApiResponse;
import com.splitmate.common.security.CustomUserDetails;
import com.splitmate.expense.dto.CreateExpenseRequest;
import com.splitmate.expense.dto.ExpenseResponse;
import com.splitmate.expense.service.ExpenseService;
import com.splitmate.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @Valid @RequestBody CreateExpenseRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        ExpenseResponse expenseResponse = expenseService.createExpense(request, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<ExpenseResponse>builder()
                .success(true)
                .message("Expense created successfully")
                .data(expenseResponse)
                .build());
    }

    @GetMapping("/{expenseId}")
    public ResponseEntity<ApiResponse<ExpenseResponse>> getExpenseById(
            @PathVariable Long expenseId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        ExpenseResponse expenseResponse = expenseService.getExpenseById(expenseId, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<ExpenseResponse>builder()
                .success(true)
                .message("Expense fetched successfully")
                .data(expenseResponse)
                .build());
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getGroupExpenses(
            @PathVariable Long groupId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        List<ExpenseResponse> expenses = expenseService.getGroupExpenses(groupId, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<List<ExpenseResponse>>builder()
                .success(true)
                .message("Group expenses fetched successfully")
                .data(expenses)
                .build());
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @PathVariable Long expenseId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        expenseService.deleteExpense(expenseId, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Expense deleted successfully")
                .data(null)
                .build());
    }

    private User getCurrentUser(CustomUserDetails userDetails) {
        return userDetails.getUser();
    }
}
