package com.splitmate.expense.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseParticipantResponse {

    private Long id;

    private Long userId;

    private String userName;

    private String userEmail;

    private BigDecimal amountOwed;

    private BigDecimal percentage;

    private Integer shares;
}
