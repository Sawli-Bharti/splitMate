package com.splitmate.settlement.service.impl;

import com.splitmate.balance.entity.Balance;
import com.splitmate.balance.repository.BalanceRepository;
import com.splitmate.group.entity.Group;
import com.splitmate.group.repository.GroupMemberRepository;
import com.splitmate.group.repository.GroupRepository;
import com.splitmate.settlement.dto.CreateSettlementRequest;
import com.splitmate.settlement.dto.SettlementHistoryResponse;
import com.splitmate.settlement.dto.SettlementResponse;
import com.splitmate.settlement.entity.Settlement;
import com.splitmate.settlement.repository.SettlementRepository;
import com.splitmate.settlement.service.SettlementService;
import com.splitmate.user.entity.User;
import com.splitmate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SettlementServiceImpl implements SettlementService {

    private final SettlementRepository settlementRepository;
    private final BalanceRepository balanceRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public SettlementResponse createSettlement(CreateSettlementRequest request) {
        Group group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User payer = userRepository.findById(request.getPayerId())
                .orElseThrow(() -> new RuntimeException("Payer not found"));

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (payer.getId().equals(receiver.getId())) {
            throw new RuntimeException("Payer and receiver cannot be same");
        }

        requireGroupMember(group, payer, "Payer must be a member of the group");
        requireGroupMember(group, receiver, "Receiver must be a member of the group");

        Balance balance = balanceRepository.findByGroupAndFromUserAndToUser(group, payer, receiver)
                .orElseThrow(() -> new RuntimeException("Outstanding balance not found"));

        if (request.getAmount().compareTo(balance.getAmount()) > 0) {
            throw new RuntimeException("Settlement amount exceeds outstanding balance");
        }

        Settlement settlement = Settlement.builder()
                .group(group)
                .payer(payer)
                .receiver(receiver)
                .amount(request.getAmount())
                .note(request.getNote())
                .settledAt(LocalDateTime.now())
                .build();

        Settlement savedSettlement = settlementRepository.save(settlement);
        BigDecimal remainingBalance = balance.getAmount().subtract(request.getAmount());

        if (remainingBalance.compareTo(BigDecimal.ZERO) == 0) {
            balanceRepository.delete(balance);
        } else {
            balance.setAmount(remainingBalance);
            balanceRepository.save(balance);
        }

        return SettlementResponse.builder()
                .id(savedSettlement.getId())
                .amount(savedSettlement.getAmount())
                .remainingBalance(remainingBalance)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SettlementHistoryResponse> getGroupSettlements(Long groupId, User currentUser) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        requireGroupMember(group, currentUser, "Access denied");

        return settlementRepository.findByGroupOrderBySettledAtDesc(group).stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SettlementHistoryResponse> getMySettlements(User currentUser) {
        return settlementRepository.findByPayerOrReceiverOrderBySettledAtDesc(currentUser, currentUser).stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SettlementHistoryResponse getSettlementById(Long settlementId, User currentUser) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));
        requireGroupMember(settlement.getGroup(), currentUser, "Access denied");

        return toHistoryResponse(settlement);
    }

    private void requireGroupMember(Group group, User user, String message) {
        if (!groupMemberRepository.existsByGroupAndUser(group, user)) {
            throw new RuntimeException(message);
        }
    }

    private SettlementHistoryResponse toHistoryResponse(Settlement settlement) {
        return SettlementHistoryResponse.builder()
                .id(settlement.getId())
                .groupId(settlement.getGroup().getId())
                .groupName(settlement.getGroup().getName())
                .payerId(settlement.getPayer().getId())
                .payerName(settlement.getPayer().getName())
                .receiverId(settlement.getReceiver().getId())
                .receiverName(settlement.getReceiver().getName())
                .amount(settlement.getAmount())
                .note(settlement.getNote())
                .settledAt(settlement.getSettledAt())
                .build();
    }
}
