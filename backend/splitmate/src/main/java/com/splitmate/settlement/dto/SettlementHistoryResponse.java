package com.splitmate.settlement.dto;

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
public class SettlementHistoryResponse {

    private Long id;

    private Long groupId;

    private String groupName;

    private Long payerId;

    private String payerName;

    private Long receiverId;

    private String receiverName;

    private BigDecimal amount;

    private String note;

    private LocalDateTime settledAt;
}
