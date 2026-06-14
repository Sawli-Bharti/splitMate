package com.splitmate.expense.repository;

import com.splitmate.expense.entity.Expense;
import com.splitmate.expense.entity.ExpenseParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseParticipantRepository extends JpaRepository<ExpenseParticipant, Long> {

    List<ExpenseParticipant> findByExpense(Expense expense);
}
