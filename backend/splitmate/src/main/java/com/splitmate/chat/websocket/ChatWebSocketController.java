package com.splitmate.chat.websocket;

import com.splitmate.chat.dto.ChatMessageResponse;
import com.splitmate.chat.dto.DeleteMessageRequest;
import com.splitmate.chat.dto.EditMessageRequest;
import com.splitmate.chat.dto.SendMessageRequest;
import com.splitmate.chat.service.ChatService;
import com.splitmate.user.entity.User;
import com.splitmate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatService chatService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/send")
    public void sendMessage(SendMessageRequest request, Principal principal) {
        ChatMessageResponse response = chatService.sendMessage(request, getCurrentUser(principal));
        broadcast(response);
    }

    @MessageMapping("/chat/edit")
    public void editMessage(EditMessageRequest request, Principal principal) {
        ChatMessageResponse response = chatService.editMessage(request, getCurrentUser(principal));
        broadcast(response);
    }

    @MessageMapping("/chat/delete")
    public void deleteMessage(DeleteMessageRequest request, Principal principal) {
        ChatMessageResponse response = chatService.deleteMessage(request, getCurrentUser(principal));
        broadcast(response);
    }

    private User getCurrentUser(Principal principal) {
        if (principal == null) {
            throw new RuntimeException("Unauthenticated websocket user");
        }

        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void broadcast(ChatMessageResponse response) {
        messagingTemplate.convertAndSend("/topic/group/" + response.getGroupId(), response);
    }
}
