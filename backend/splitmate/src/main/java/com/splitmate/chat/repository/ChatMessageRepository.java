package com.splitmate.chat.repository;

import com.splitmate.chat.entity.ChatMessage;
import com.splitmate.group.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByGroupOrderByCreatedAtAsc(Group group);

    List<ChatMessage> findTop50ByGroupOrderByCreatedAtDesc(Group group);
}
