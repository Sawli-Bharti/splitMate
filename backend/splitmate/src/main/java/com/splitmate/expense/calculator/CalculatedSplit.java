package com.splitmate.expense.calculator;

import java.math.BigDecimal;

public record CalculatedSplit(
        Long userId,
        BigDecimal amountOwed,
        BigDecimal percentage,
        Integer shares
) {
}
