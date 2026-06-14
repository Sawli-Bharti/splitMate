package com.splitmate.balance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BalanceSummaryResponse {

    private BigDecimal youOwe;

    private BigDecimal youAreOwed;

    private BigDecimal netBalance;
}
