package com.splitmate.dashboard.service.impl;

import com.splitmate.balance.entity.Balance;
import com.splitmate.balance.repository.BalanceRepository;
import com.splitmate.dashboard.dto.DashboardSummaryResponse;
import com.splitmate.dashboard.dto.RecentExpenseResponse;
import com.splitmate.dashboard.dto.RecentSettlementResponse;
import com.splitmate.dashboard.service.DashboardService;
import com.splitmate.expense.entity.Expense;
import com.splitmate.expense.repository.ExpenseRepository;
import com.splitmate.group.entity.Group;
import com.splitmate.group.entity.GroupMember;
import com.splitmate.group.repository.GroupMemberRepository;
import com.splitmate.settlement.entity.Settlement;
import com.splitmate.settlement.repository.SettlementRepository;
import com.splitmate.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private static final int RECENT_LIMIT = 10;

    private final GroupMemberRepository groupMemberRepository;
    private final ExpenseRepository expenseRepository;
    private final BalanceRepository balanceRepository;
    private final SettlementRepository settlementRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary(User currentUser) {
        List<Group> groups = getCurrentUserGroups(currentUser);
        BigDecimal youOwe = sumBalances(balanceRepository.findByFromUser(currentUser));
        BigDecimal youAreOwed = sumBalances(balanceRepository.findByToUser(currentUser));

        return DashboardSummaryResponse.builder()
                .totalGroups(groups.size())
                .totalExpenses(expenseRepository.countByGroupIn(groups))
                .totalSettlements(settlementRepository.countByPayerOrReceiver(currentUser, currentUser))
                .youOwe(youOwe)
                .youAreOwed(youAreOwed)
                .netBalance(youAreOwed.subtract(youOwe))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecentExpenseResponse> getRecentExpenses(User currentUser) {
        List<Group> groups = getCurrentUserGroups(currentUser);

        if (groups.isEmpty()) {
            return List.of();
        }

        return expenseRepository.findByGroupInOrderByCreatedAtDesc(groups, PageRequest.of(0, RECENT_LIMIT)).stream()
                .map(this::toRecentExpenseResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecentSettlementResponse> getRecentSettlements(User currentUser) {
        return settlementRepository.findByPayerOrReceiverOrderBySettledAtDesc(
                        currentUser,
                        currentUser,
                        PageRequest.of(0, RECENT_LIMIT)
                ).stream()
                .map(this::toRecentSettlementResponse)
                .toList();
    }

    private List<Group> getCurrentUserGroups(User currentUser) {
        return groupMemberRepository.findByUser(currentUser).stream()
                .map(GroupMember::getGroup)
                .toList();
    }

    private BigDecimal sumBalances(List<Balance> balances) {
        return balances.stream()
                .map(Balance::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private RecentExpenseResponse toRecentExpenseResponse(Expense expense) {
        return RecentExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .amount(expense.getAmount())
                .groupId(expense.getGroup().getId())
                .groupName(expense.getGroup().getName())
                .paidByName(expense.getPaidBy().getName())
                .splitType(expense.getSplitType())
                .createdAt(expense.getCreatedAt())
                .build();
    }

    private RecentSettlementResponse toRecentSettlementResponse(Settlement settlement) {
        return RecentSettlementResponse.builder()
                .id(settlement.getId())
                .amount(settlement.getAmount())
                .payerName(settlement.getPayer().getName())
                .receiverName(settlement.getReceiver().getName())
                .groupName(settlement.getGroup().getName())
                .settledAt(settlement.getSettledAt())
                .build();
    }
}
