package com.splitmate.dashboard.controller;

import com.splitmate.common.response.ApiResponse;
import com.splitmate.common.security.CustomUserDetails;
import com.splitmate.dashboard.dto.DashboardSummaryResponse;
import com.splitmate.dashboard.dto.RecentExpenseResponse;
import com.splitmate.dashboard.dto.RecentSettlementResponse;
import com.splitmate.dashboard.service.DashboardService;
import com.splitmate.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getDashboardSummary(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        DashboardSummaryResponse summary = dashboardService.getDashboardSummary(getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<DashboardSummaryResponse>builder()
                .success(true)
                .message("Dashboard summary fetched successfully")
                .data(summary)
                .build());
    }

    @GetMapping("/recent-expenses")
    public ResponseEntity<ApiResponse<List<RecentExpenseResponse>>> getRecentExpenses(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        List<RecentExpenseResponse> expenses = dashboardService.getRecentExpenses(getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<List<RecentExpenseResponse>>builder()
                .success(true)
                .message("Recent expenses fetched successfully")
                .data(expenses)
                .build());
    }

    @GetMapping("/recent-settlements")
    public ResponseEntity<ApiResponse<List<RecentSettlementResponse>>> getRecentSettlements(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        List<RecentSettlementResponse> settlements = dashboardService.getRecentSettlements(getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<List<RecentSettlementResponse>>builder()
                .success(true)
                .message("Recent settlements fetched successfully")
                .data(settlements)
                .build());
    }

    private User getCurrentUser(CustomUserDetails userDetails) {
        return userDetails.getUser();
    }
}
