package com.splitmate.group.repository;

import com.splitmate.group.entity.Group;
import com.splitmate.group.entity.GroupMember;
import com.splitmate.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {

    List<GroupMember> findByGroup(Group group);

    Optional<GroupMember> findByGroupAndUser(Group group, User user);

    boolean existsByGroupAndUser(Group group, User user);

    List<GroupMember> findByUser(User user);

    void deleteByGroupAndUser(Group group, User user);
}
