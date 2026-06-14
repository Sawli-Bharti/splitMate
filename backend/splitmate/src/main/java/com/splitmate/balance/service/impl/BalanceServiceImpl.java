package com.splitmate.balance.service.impl;

import com.splitmate.balance.dto.BalanceResponse;
import com.splitmate.balance.dto.BalanceSummaryResponse;
import com.splitmate.balance.entity.Balance;
import com.splitmate.balance.repository.BalanceRepository;
import com.splitmate.balance.service.BalanceService;
import com.splitmate.expense.entity.Expense;
import com.splitmate.expense.entity.ExpenseParticipant;
import com.splitmate.group.entity.Group;
import com.splitmate.group.repository.GroupMemberRepository;
import com.splitmate.group.repository.GroupRepository;
import com.splitmate.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BalanceServiceImpl implements BalanceService {

    private final BalanceRepository balanceRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;

    @Override
    @Transactional
    public void updateBalancesAfterExpense(Expense expense) {
        for (ExpenseParticipant participant : expense.getParticipants()) {
            User fromUser = participant.getUser();
            User toUser = expense.getPaidBy();
            BigDecimal amountOwed = participant.getAmountOwed();

            if (fromUser.getId().equals(toUser.getId()) || amountOwed.compareTo(BigDecimal.ZERO) == 0) {
                continue;
            }

            applyDebt(expense.getGroup(), fromUser, toUser, amountOwed);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<BalanceResponse> getGroupBalances(Long groupId, User currentUser) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        requireGroupMember(group, currentUser);

        return balanceRepository.findByGroup(group).stream()
                .map(this::toBalanceResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BalanceSummaryResponse getMyBalanceSummary(User currentUser) {
        BigDecimal youOwe = balanceRepository.findByFromUser(currentUser).stream()
                .map(Balance::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal youAreOwed = balanceRepository.findByToUser(currentUser).stream()
                .map(Balance::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return BalanceSummaryResponse.builder()
                .youOwe(youOwe)
                .youAreOwed(youAreOwed)
                .netBalance(youAreOwed.subtract(youOwe))
                .build();
    }

    private void applyDebt(Group group, User fromUser, User toUser, BigDecimal amount) {
        balanceRepository.findByGroupAndFromUserAndToUser(group, toUser, fromUser)
                .ifPresentOrElse(
                        reverseBalance -> settleReverseBalance(group, fromUser, toUser, amount, reverseBalance),
                        () -> increaseDirectBalance(group, fromUser, toUser, amount)
                );
    }

    private void settleReverseBalance(Group group, User fromUser, User toUser, BigDecimal amount, Balance reverseBalance) {
        int comparison = reverseBalance.getAmount().compareTo(amount);

        if (comparison > 0) {
            reverseBalance.setAmount(reverseBalance.getAmount().subtract(amount));
            balanceRepository.save(reverseBalance);
        } else if (comparison == 0) {
            balanceRepository.delete(reverseBalance);
        } else {
            BigDecimal remainingAmount = amount.subtract(reverseBalance.getAmount());
            balanceRepository.delete(reverseBalance);
            increaseDirectBalance(group, fromUser, toUser, remainingAmount);
        }
    }

    private void increaseDirectBalance(Group group, User fromUser, User toUser, BigDecimal amount) {
        Balance balance = balanceRepository.findByGroupAndFromUserAndToUser(group, fromUser, toUser)
                .orElseGet(() -> Balance.builder()
                        .group(group)
                        .fromUser(fromUser)
                        .toUser(toUser)
                        .amount(BigDecimal.ZERO)
                        .build());

        balance.setAmount(balance.getAmount().add(amount));
        balanceRepository.save(balance);
    }

    private void requireGroupMember(Group group, User user) {
        if (!groupMemberRepository.existsByGroupAndUser(group, user)) {
            throw new RuntimeException("Access denied");
        }
    }

    private BalanceResponse toBalanceResponse(Balance balance) {
        return BalanceResponse.builder()
                .fromUserId(balance.getFromUser().getId())
                .fromUserName(balance.getFromUser().getName())
                .toUserId(balance.getToUser().getId())
                .toUserName(balance.getToUser().getName())
                .amount(balance.getAmount())
                .build();
    }
}
