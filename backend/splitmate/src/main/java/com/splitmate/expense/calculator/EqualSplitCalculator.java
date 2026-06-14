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
public class EqualSplitCalculator implements SplitCalculator {

    @Override
    public SplitType supports() {
        return SplitType.EQUAL;
    }

    @Override
    public List<CalculatedSplit> calculate(CreateExpenseRequest request) {
        List<ExpenseParticipantRequest> participants = request.getParticipants();
        BigDecimal amount = request.getAmount();
        BigDecimal perPerson = amount.divide(BigDecimal.valueOf(participants.size()), 2, RoundingMode.DOWN);
        BigDecimal allocated = BigDecimal.ZERO;
        List<CalculatedSplit> splits = new ArrayList<>();

        for (int index = 0; index < participants.size(); index++) {
            BigDecimal amountOwed = index == participants.size() - 1
                    ? amount.subtract(allocated).setScale(2, RoundingMode.HALF_UP)
                    : perPerson;
            allocated = allocated.add(amountOwed);
            splits.add(new CalculatedSplit(participants.get(index).getUserId(), amountOwed, null, null));
        }

        return splits;
    }
}
