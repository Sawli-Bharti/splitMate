package com.splitmate.settlement.controller;

import com.splitmate.common.response.ApiResponse;
import com.splitmate.common.security.CustomUserDetails;
import com.splitmate.settlement.dto.CreateSettlementRequest;
import com.splitmate.settlement.dto.SettlementHistoryResponse;
import com.splitmate.settlement.dto.SettlementResponse;
import com.splitmate.settlement.service.SettlementService;
import com.splitmate.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/settlements")
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;

    @PostMapping
    public ResponseEntity<ApiResponse<SettlementResponse>> createSettlement(
            @Valid @RequestBody CreateSettlementRequest request
    ) {
        SettlementResponse settlementResponse = settlementService.createSettlement(request);

        return ResponseEntity.ok(ApiResponse.<SettlementResponse>builder()
                .success(true)
                .message("Settlement recorded successfully")
                .data(settlementResponse)
                .build());
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<ApiResponse<List<SettlementHistoryResponse>>> getGroupSettlements(
            @PathVariable Long groupId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        List<SettlementHistoryResponse> settlements = settlementService.getGroupSettlements(groupId, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<List<SettlementHistoryResponse>>builder()
                .success(true)
                .message("Settlements fetched successfully")
                .data(settlements)
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<SettlementHistoryResponse>>> getMySettlements(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        List<SettlementHistoryResponse> settlements = settlementService.getMySettlements(getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<List<SettlementHistoryResponse>>builder()
                .success(true)
                .message("Settlements fetched successfully")
                .data(settlements)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SettlementHistoryResponse>> getSettlementById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        SettlementHistoryResponse settlement = settlementService.getSettlementById(id, getCurrentUser(userDetails));

        return ResponseEntity.ok(ApiResponse.<SettlementHistoryResponse>builder()
                .success(true)
                .message("Settlement fetched successfully")
                .data(settlement)
                .build());
    }

    private User getCurrentUser(CustomUserDetails userDetails) {
        return userDetails.getUser();
    }
}
