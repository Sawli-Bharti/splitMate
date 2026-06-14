package com.splitmate.expense.dto;

import com.splitmate.expense.entity.SplitType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateExpenseRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Group id is required")
    private Long groupId;

    @NotNull(message = "Paid by user id is required")
    private Long paidByUserId;

    @NotNull(message = "Split type is required")
    private SplitType splitType;

    @Valid
    @NotEmpty(message = "Participants are required")
    private List<ExpenseParticipantRequest> participants;
}
