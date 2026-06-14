package com.splitmate.chat.service;

import com.splitmate.chat.dto.ChatMessageResponse;
import com.splitmate.chat.dto.DeleteMessageRequest;
import com.splitmate.chat.dto.EditMessageRequest;
import com.splitmate.chat.dto.SendMessageRequest;
import com.splitmate.user.entity.User;

import java.util.List;

public interface ChatService {

    ChatMessageResponse sendMessage(SendMessageRequest request, User currentUser);

    ChatMessageResponse editMessage(EditMessageRequest request, User currentUser);

    ChatMessageResponse deleteMessage(DeleteMessageRequest request, User currentUser);

    List<ChatMessageResponse> getGroupMessages(Long groupId, User currentUser);
}
