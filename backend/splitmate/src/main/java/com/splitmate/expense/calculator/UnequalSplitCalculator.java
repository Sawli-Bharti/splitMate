package com.splitmate.expense.calculator;

import com.splitmate.expense.dto.CreateExpenseRequest;
import com.splitmate.expense.dto.ExpenseParticipantRequest;
import com.splitmate.expense.entity.SplitType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Component
public class UnequalSplitCalculator implements SplitCalculator {

    @Override
    public SplitType supports() {
        return SplitType.UNEQUAL;
    }

    @Override
    public List<CalculatedSplit> calculate(CreateExpenseRequest request) {
        BigDecimal total = BigDecimal.ZERO;

        for (ExpenseParticipantRequest participant : request.getParticipants()) {
            if (participant.getAmountOwed() == null || participant.getAmountOwed().compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("Amount owed is required for unequal split");
            }
            total = total.add(participant.getAmountOwed());
        }

        if (total.setScale(2, RoundingMode.HALF_UP).compareTo(request.getAmount().setScale(2, RoundingMode.HALF_UP)) != 0) {
            throw new RuntimeException("Unequal split amounts must equal expense amount");
        }

        return request.getParticipants().stream()
                .map(participant -> new CalculatedSplit(
                        participant.getUserId(),
                        participant.getAmountOwed().setScale(2, RoundingMode.HALF_UP),
                        null,
                        null
                ))
                .toList();
    }
}
