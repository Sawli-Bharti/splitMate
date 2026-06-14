package com.splitmate.balance.service;

import com.splitmate.balance.dto.BalanceResponse;
import com.splitmate.balance.dto.BalanceSummaryResponse;
import com.splitmate.expense.entity.Expense;
import com.splitmate.user.entity.User;

import java.util.List;

public interface BalanceService {

    void updateBalancesAfterExpense(Expense expense);

    List<BalanceResponse> getGroupBalances(Long groupId, User currentUser);

    BalanceSummaryResponse getMyBalanceSummary(User currentUser);
}
