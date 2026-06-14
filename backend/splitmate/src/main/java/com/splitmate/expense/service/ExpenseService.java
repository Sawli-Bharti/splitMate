package com.splitmate.expense.service;

import com.splitmate.expense.dto.CreateExpenseRequest;
import com.splitmate.expense.dto.ExpenseResponse;
import com.splitmate.user.entity.User;

import java.util.List;

public interface ExpenseService {

    ExpenseResponse createExpense(CreateExpenseRequest request, User currentUser);

    ExpenseResponse getExpenseById(Long expenseId, User currentUser);

    List<ExpenseResponse> getGroupExpenses(Long groupId, User currentUser);

    void deleteExpense(Long expenseId, User currentUser);
}
