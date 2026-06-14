package com.splitmate.balance.controller;

import com.splitmate.balance.dto.BalanceResponse;
import com.splitmate.balance.dto.BalanceSummaryResponse;
import com.splitmate.balance.service.BalanceService;
import com.splitmate.common.response.ApiResponse;
import com.splitmate.common.security.CustomUserDetails;
import com.splitmate.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/balances")
@RequiredArgsConstructor
public class BalanceController {

    private final BalanceService balanceService;

    @GetMapping("/group/{groupId}")
    public ResponseEntity<ApiResponse<List<BalanceResponse>>> getGroupBalances(
            @PathVariable Long groupId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        List<BalanceResponse> balances = balanceService.getGroupBalances(groupId, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<List<BalanceResponse>>builder()
                .success(true)
                .message("Group balances fetched successfully")
                .data(balances)
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<BalanceSummaryResponse>> getMyBalanceSummary(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        BalanceSummaryResponse summary = balanceService.getMyBalanceSummary(getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<BalanceSummaryResponse>builder()
                .success(true)
                .message("Balance summary fetched successfully")
                .data(summary)
                .build());
    }

    private User getCurrentUser(CustomUserDetails userDetails) {
        return userDetails.getUser();
    }
}
