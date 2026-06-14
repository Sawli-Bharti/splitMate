package com.splitmate.expense.service.impl;

import com.splitmate.balance.dto.BalanceResponse;
import com.splitmate.balance.service.BalanceService;
import com.splitmate.expense.calculator.CalculatedSplit;
import com.splitmate.expense.calculator.SplitCalculator;
import com.splitmate.expense.dto.CreateExpenseRequest;
import com.splitmate.expense.dto.ExpenseParticipantResponse;
import com.splitmate.expense.dto.ExpenseResponse;
import com.splitmate.expense.dto.ExpenseUserResponse;
import com.splitmate.expense.entity.Expense;
import com.splitmate.expense.entity.ExpenseParticipant;
import com.splitmate.expense.entity.SplitType;
import com.splitmate.expense.repository.ExpenseParticipantRepository;
import com.splitmate.expense.repository.ExpenseRepository;
import com.splitmate.expense.service.ExpenseService;
import com.splitmate.group.entity.Group;
import com.splitmate.group.repository.GroupMemberRepository;
import com.splitmate.group.repository.GroupRepository;
import com.splitmate.user.entity.User;
import com.splitmate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseParticipantRepository expenseParticipantRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final BalanceService balanceService;
    private final List<SplitCalculator> splitCalculators;

    @Override
    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request, User currentUser) {
        Group group = getGroupOrThrow(request.getGroupId());
        requireGroupMember(group, currentUser);

        User paidBy = getUserOrThrow(request.getPaidByUserId());
        requireExpensePayerGroupMember(group, paidBy);

        validateUniqueParticipants(request);
        Map<Long, User> participantUsers = loadAndValidateParticipants(group, request);
        List<CalculatedSplit> calculatedSplits = getCalculator(request.getSplitType()).calculate(request);

        Expense expense = Expense.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .amount(request.getAmount())
                .group(group)
                .paidBy(paidBy)
                .splitType(request.getSplitType())
                .build();

        Expense savedExpense = expenseRepository.save(expense);
        List<ExpenseParticipant> participants = calculatedSplits.stream()
                .map(split -> ExpenseParticipant.builder()
                        .expense(savedExpense)
                        .user(participantUsers.get(split.userId()))
                        .amountOwed(split.amountOwed())
                        .percentage(split.percentage())
                        .shares(split.shares())
                        .build())
                .toList();

        List<ExpenseParticipant> savedParticipants = expenseParticipantRepository.saveAll(participants);
        savedExpense.getParticipants().addAll(savedParticipants);
        balanceService.updateBalancesAfterExpense(savedExpense);

        return toExpenseResponse(savedExpense);
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long expenseId, User currentUser) {
        Expense expense = getExpenseOrThrow(expenseId);
        requireGroupMember(expense.getGroup(), currentUser);
        return toExpenseResponse(expense);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getGroupExpenses(Long groupId, User currentUser) {
        Group group = getGroupOrThrow(groupId);
        requireGroupMember(group, currentUser);

        return expenseRepository.findByGroupOrderByCreatedAtDesc(group).stream()
                .map(this::toExpenseResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deleteExpense(Long expenseId, User currentUser) {
        Expense expense = getExpenseOrThrow(expenseId);
        requireGroupMember(expense.getGroup(), currentUser);
        expenseRepository.delete(expense);
    }

    private SplitCalculator getCalculator(SplitType splitType) {
        Map<SplitType, SplitCalculator> calculators = splitCalculators.stream()
                .collect(Collectors.toMap(SplitCalculator::supports, Function.identity(), (first, second) -> first, () -> new EnumMap<>(SplitType.class)));

        SplitCalculator calculator = calculators.get(splitType);
        if (calculator == null) {
            throw new RuntimeException("Unsupported split type");
        }
        return calculator;
    }

    private Group getGroupOrThrow(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
    }

    private Expense getExpenseOrThrow(Long expenseId) {
        return expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void requireGroupMember(Group group, User user) {
        if (!groupMemberRepository.existsByGroupAndUser(group, user)) {
            throw new RuntimeException("Access denied");
        }
    }

    private void validateUniqueParticipants(CreateExpenseRequest request) {
        Set<Long> userIds = new HashSet<>();

        for (var participant : request.getParticipants()) {
            if (!userIds.add(participant.getUserId())) {
                throw new RuntimeException("Duplicate participant detected");
            }
        }
    }

    private Map<Long, User> loadAndValidateParticipants(Group group, CreateExpenseRequest request) {
        return request.getParticipants().stream()
                .map(participant -> {
                    User user = getUserOrThrow(participant.getUserId());
                    requireParticipantGroupMember(group, user);
                    return user;
                })
                .collect(Collectors.toMap(User::getId, Function.identity()));
    }

    private void requireExpensePayerGroupMember(Group group, User user) {
        if (!groupMemberRepository.existsByGroupAndUser(group, user)) {
            throw new RuntimeException("Expense payer must be a member of the group");
        }
    }

    private void requireParticipantGroupMember(Group group, User user) {
        if (!groupMemberRepository.existsByGroupAndUser(group, user)) {
            throw new RuntimeException("User '" + user.getName() + "' is not a member of group '" + group.getName() + "'");
        }
    }

    private ExpenseResponse toExpenseResponse(Expense expense) {
        List<ExpenseParticipantResponse> participants = expenseParticipantRepository.findByExpense(expense).stream()
                .map(this::toParticipantResponse)
                .toList();

        return ExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .groupId(expense.getGroup().getId())
                .groupName(expense.getGroup().getName())
                .paidBy(toUserResponse(expense.getPaidBy()))
                .splitType(expense.getSplitType())
                .createdAt(expense.getCreatedAt())
                .participants(participants)
                .generatedBalances(toGeneratedBalances(expense))
                .build();
    }

    private List<BalanceResponse> toGeneratedBalances(Expense expense) {
        return expenseParticipantRepository.findByExpense(expense).stream()
                .filter(participant -> !participant.getUser().getId().equals(expense.getPaidBy().getId()))
                .filter(participant -> participant.getAmountOwed().compareTo(BigDecimal.ZERO) > 0)
                .map(participant -> BalanceResponse.builder()
                        .fromUserId(participant.getUser().getId())
                        .fromUserName(participant.getUser().getName())
                        .toUserId(expense.getPaidBy().getId())
                        .toUserName(expense.getPaidBy().getName())
                        .amount(participant.getAmountOwed())
                        .build())
                .toList();
    }

    private ExpenseParticipantResponse toParticipantResponse(ExpenseParticipant participant) {
        User user = participant.getUser();

        return ExpenseParticipantResponse.builder()
                .id(participant.getId())
                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .amountOwed(participant.getAmountOwed())
                .percentage(participant.getPercentage())
                .shares(participant.getShares())
                .build();
    }

    private ExpenseUserResponse toUserResponse(User user) {
        return ExpenseUserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
