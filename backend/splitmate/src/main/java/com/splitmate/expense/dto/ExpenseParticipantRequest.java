package com.splitmate.expense.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ExpenseParticipantRequest {

    @NotNull(message = "User id is required")
    private Long userId;

    private BigDecimal amountOwed;

    private BigDecimal percentage;

    private Integer shares;
}
