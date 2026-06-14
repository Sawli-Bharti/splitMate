package com.splitmate.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private long totalGroups;

    private long totalExpenses;

    private long totalSettlements;

    private BigDecimal youOwe;

    private BigDecimal youAreOwed;

    private BigDecimal netBalance;
}
