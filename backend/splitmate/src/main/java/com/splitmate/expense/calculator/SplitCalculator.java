package com.splitmate.expense.calculator;

import com.splitmate.expense.dto.CreateExpenseRequest;
import com.splitmate.expense.entity.SplitType;

import java.util.List;

public interface SplitCalculator {

    SplitType supports();

    List<CalculatedSplit> calculate(CreateExpenseRequest request);
}
