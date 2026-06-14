package com.splitmate.settlement.repository;

import com.splitmate.group.entity.Group;
import com.splitmate.settlement.entity.Settlement;
import com.splitmate.user.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SettlementRepository extends JpaRepository<Settlement, Long> {

    List<Settlement> findByGroupOrderBySettledAtDesc(Group group);

    List<Settlement> findByPayerOrReceiverOrderBySettledAtDesc(User payer, User receiver);

    List<Settlement> findByPayerOrReceiverOrderBySettledAtDesc(User payer, User receiver, Pageable pageable);

    long countByPayerOrReceiver(User payer, User receiver);
}
