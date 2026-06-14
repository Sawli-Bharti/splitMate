package com.splitmate.expense.repository;

import com.splitmate.expense.entity.Expense;
import com.splitmate.group.entity.Group;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByGroupOrderByCreatedAtDesc(Group group);

    List<Expense> findByGroupInOrderByCreatedAtDesc(List<Group> groups, Pageable pageable);

    long countByGroupIn(List<Group> groups);
}
