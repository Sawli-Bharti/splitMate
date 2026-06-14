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
public class ShareSplitCalculator implements SplitCalculator {

    @Override
    public SplitType supports() {
        return SplitType.SHARE;
    }

    @Override
    public List<CalculatedSplit> calculate(CreateExpenseRequest request) {
        int totalShares = 0;

        for (ExpenseParticipantRequest participant : request.getParticipants()) {
            if (participant.getShares() == null || participant.getShares() <= 0) {
                throw new RuntimeException("Shares are required for share split");
            }
            totalShares += participant.getShares();
        }

        BigDecimal allocated = BigDecimal.ZERO;
        List<CalculatedSplit> splits = new ArrayList<>();
        List<ExpenseParticipantRequest> participants = request.getParticipants();

        for (int index = 0; index < participants.size(); index++) {
            ExpenseParticipantRequest participant = participants.get(index);
            BigDecimal amountOwed = index == participants.size() - 1
                    ? request.getAmount().subtract(allocated).setScale(2, RoundingMode.HALF_UP)
                    : request.getAmount()
                    .multiply(BigDecimal.valueOf(participant.getShares()))
                    .divide(BigDecimal.valueOf(totalShares), 2, RoundingMode.HALF_UP);
            allocated = allocated.add(amountOwed);
            splits.add(new CalculatedSplit(
                    participant.getUserId(),
                    amountOwed,
                    null,
                    participant.getShares()
            ));
        }

        return splits;
    }
}
