package com.splitmate.dashboard.service;

import com.splitmate.dashboard.dto.DashboardSummaryResponse;
import com.splitmate.dashboard.dto.RecentExpenseResponse;
import com.splitmate.dashboard.dto.RecentSettlementResponse;
import com.splitmate.user.entity.User;

import java.util.List;

public interface DashboardService {

    DashboardSummaryResponse getDashboardSummary(User currentUser);

    List<RecentExpenseResponse> getRecentExpenses(User currentUser);

    List<RecentSettlementResponse> getRecentSettlements(User currentUser);
}
