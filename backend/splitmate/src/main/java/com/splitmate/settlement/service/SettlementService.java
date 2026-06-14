package com.splitmate.settlement.service;

import com.splitmate.settlement.dto.CreateSettlementRequest;
import com.splitmate.settlement.dto.SettlementHistoryResponse;
import com.splitmate.settlement.dto.SettlementResponse;
import com.splitmate.user.entity.User;

import java.util.List;

public interface SettlementService {

    SettlementResponse createSettlement(CreateSettlementRequest request);

    List<SettlementHistoryResponse> getGroupSettlements(Long groupId, User currentUser);

    List<SettlementHistoryResponse> getMySettlements(User currentUser);

    SettlementHistoryResponse getSettlementById(Long settlementId, User currentUser);
}
