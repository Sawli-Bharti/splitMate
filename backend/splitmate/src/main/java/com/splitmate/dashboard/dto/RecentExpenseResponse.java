package com.splitmate.dashboard.dto;

import com.splitmate.expense.entity.SplitType;
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
public class RecentExpenseResponse {

    private Long id;

    private String title;

    private BigDecimal amount;

    private Long groupId;

    private String groupName;

    private String paidByName;

    private SplitType splitType;

    private LocalDateTime createdAt;
}
