package com.splitmate.balance.repository;

import com.splitmate.balance.entity.Balance;
import com.splitmate.group.entity.Group;
import com.splitmate.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BalanceRepository extends JpaRepository<Balance, Long> {

    List<Balance> findByGroup(Group group);

    List<Balance> findByFromUser(User fromUser);

    List<Balance> findByToUser(User toUser);

    Optional<Balance> findByGroupAndFromUserAndToUser(Group group, User fromUser, User toUser);
}
