package com.splitmate.expense.dto;

import com.splitmate.balance.dto.BalanceResponse;
import com.splitmate.expense.entity.SplitType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {

    private Long id;

    private String title;

    private String description;

    private BigDecimal amount;

    private Long groupId;

    private String groupName;

    private ExpenseUserResponse paidBy;

    private SplitType splitType;

    private LocalDateTime createdAt;

    private List<ExpenseParticipantResponse> participants;

    private List<BalanceResponse> generatedBalances;
}
