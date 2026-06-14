package com.splitmate.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentSettlementResponse {

    private Long id;

    private BigDecimal amount;

    private String payerName;

    private String receiverName;

    private String groupName;

    private LocalDateTime settledAt;
}
