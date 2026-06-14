package com.splitmate.settlement.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateSettlementRequest {

    @NotNull(message = "Group id is required")
    private Long groupId;

    @NotNull(message = "Payer id is required")
    private Long payerId;

    @NotNull(message = "Receiver id is required")
    private Long receiverId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    private String note;
}
