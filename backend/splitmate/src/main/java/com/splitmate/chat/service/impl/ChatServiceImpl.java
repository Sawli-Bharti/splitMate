package com.splitmate.chat.service.impl;

import com.splitmate.chat.dto.ChatMessageResponse;
import com.splitmate.chat.dto.DeleteMessageRequest;
import com.splitmate.chat.dto.EditMessageRequest;
import com.splitmate.chat.dto.SendMessageRequest;
import com.splitmate.chat.entity.ChatMessage;
import com.splitmate.chat.repository.ChatMessageRepository;
import com.splitmate.chat.service.ChatService;
import com.splitmate.group.entity.Group;
import com.splitmate.group.repository.GroupMemberRepository;
import com.splitmate.group.repository.GroupRepository;
import com.splitmate.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private static final String DELETED_MESSAGE = "Message deleted";

    private final ChatMessageRepository chatMessageRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;

    @Override
    @Transactional
    public ChatMessageResponse sendMessage(SendMessageRequest request, User currentUser) {
        Group group = getGroupOrThrow(request.getGroupId());
        requireGroupMember(group, currentUser);

        ChatMessage chatMessage = ChatMessage.builder()
                .group(group)
                .sender(currentUser)
                .message(request.getMessage())
                .edited(false)
                .deleted(false)
                .build();

        return toResponse(chatMessageRepository.save(chatMessage));
    }

    @Override
    @Transactional
    public ChatMessageResponse editMessage(EditMessageRequest request, User currentUser) {
        ChatMessage chatMessage = getMessageOrThrow(request.getMessageId());
        requireSender(chatMessage, currentUser);

        if (chatMessage.isDeleted()) {
            throw new RuntimeException("Deleted message cannot be edited");
        }

        chatMessage.setMessage(request.getMessage());
        chatMessage.setEdited(true);

        return toResponse(chatMessageRepository.save(chatMessage));
    }

    @Override
    @Transactional
    public ChatMessageResponse deleteMessage(DeleteMessageRequest request, User currentUser) {
        ChatMessage chatMessage = getMessageOrThrow(request.getMessageId());
        requireSender(chatMessage, currentUser);

        chatMessage.setMessage(DELETED_MESSAGE);
        chatMessage.setDeleted(true);

        return toResponse(chatMessageRepository.save(chatMessage));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getGroupMessages(Long groupId, User currentUser) {
        Group group = getGroupOrThrow(groupId);
        requireGroupMember(group, currentUser);

        return chatMessageRepository.findTop50ByGroupOrderByCreatedAtDesc(group).stream()
                .sorted(Comparator.comparing(ChatMessage::getCreatedAt))
                .map(this::toResponse)
                .toList();
    }

    private Group getGroupOrThrow(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
    }

    private ChatMessage getMessageOrThrow(Long messageId) {
        return chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
    }

    private void requireGroupMember(Group group, User user) {
        if (!groupMemberRepository.existsByGroupAndUser(group, user)) {
            throw new RuntimeException("Access denied");
        }
    }

    private void requireSender(ChatMessage chatMessage, User currentUser) {
        requireGroupMember(chatMessage.getGroup(), currentUser);

        if (!chatMessage.getSender().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only sender can modify this message");
        }
    }

    private ChatMessageResponse toResponse(ChatMessage chatMessage) {
        return ChatMessageResponse.builder()
                .id(chatMessage.getId())
                .groupId(chatMessage.getGroup().getId())
                .senderId(chatMessage.getSender().getId())
                .senderName(chatMessage.getSender().getName())
                .message(chatMessage.getMessage())
                .isEdited(chatMessage.isEdited())
                .isDeleted(chatMessage.isDeleted())
                .createdAt(chatMessage.getCreatedAt())
                .build();
    }
}
