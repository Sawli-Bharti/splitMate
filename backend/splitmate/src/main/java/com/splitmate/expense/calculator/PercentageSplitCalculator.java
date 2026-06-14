package com.splitmate.expense.calculator;

import com.splitmate.expense.dto.CreateExpenseRequest;
import com.splitmate.expense.dto.ExpenseParticipantRequest;
import com.splitmate.expense.entity.SplitType;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Component
public class PercentageSplitCalculator implements SplitCalculator {

    private static final BigDecimal ONE_HUNDRED = BigDecimal.valueOf(100);

    @Override
    public SplitType supports() {
        return SplitType.PERCENTAGE;
    }

    @Override
    public List<CalculatedSplit> calculate(CreateExpenseRequest request) {
        BigDecimal totalPercentage = BigDecimal.ZERO;

        for (ExpenseParticipantRequest participant : request.getParticipants()) {
            if (participant.getPercentage() == null || participant.getPercentage().compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("Percentage is required for percentage split");
            }
            totalPercentage = totalPercentage.add(participant.getPercentage());
        }

        if (totalPercentage.compareTo(ONE_HUNDRED) != 0) {
            throw new RuntimeException("Percentages must total 100");
        }

        BigDecimal allocated = BigDecimal.ZERO;
        List<CalculatedSplit> splits = new ArrayList<>();
        List<ExpenseParticipantRequest> participants = request.getParticipants();

        for (int index = 0; index < participants.size(); index++) {
            ExpenseParticipantRequest participant = participants.get(index);
            BigDecimal amountOwed = index == participants.size() - 1
                    ? request.getAmount().subtract(allocated).setScale(2, RoundingMode.HALF_UP)
                    : request.getAmount()
                    .multiply(participant.getPercentage())
                    .divide(ONE_HUNDRED, 2, RoundingMode.HALF_UP);
            allocated = allocated.add(amountOwed);
            splits.add(new CalculatedSplit(
                    participant.getUserId(),
                    amountOwed,
                    participant.getPercentage(),
                    null
            ));
        }

        return splits;
    }
}
