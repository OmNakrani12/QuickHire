package com.example.demo.restController;

import com.example.demo.entity.ChatMessage;
import com.example.demo.entity.User;
import com.example.demo.repository.ChatMessageRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.ChatContactDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin("*")
public class ChatRestController {

    @Autowired
    private ChatMessageRepository repository;

    @Autowired
    private UserRepository userRepository;

    // ✅ 1. Get full chat between two users
    @GetMapping
    public List<ChatMessage> getChat(
            @RequestParam Long senderId,
            @RequestParam Long receiverId) {

        return repository
                .findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByTimestampAsc(
                        senderId, receiverId,
                        receiverId, senderId
                );
    }

    // ✅ 2. Get contact list (users you have chatted with)
    @GetMapping("/{userId}/contacts")
    public List<ChatContactDTO> getContacts(@PathVariable Long userId) {

        List<Long> contactIds = repository.findContactIds(userId);

        return contactIds.stream()
            .map(contactId -> {

                User user = userRepository.findById(contactId).orElse(null);

                if (user == null) {
                    return null;
                }

                // 🔹 Get last message (already sorted DESC in query)
                List<ChatMessage> messages =
                        repository.findLastMessageRaw(userId, contactId);

                ChatMessage lastMsg =
                        messages.isEmpty() ? null : messages.get(0);

                String lastMessage =
                        lastMsg != null ? lastMsg.getContent() : "";

                var lastTime =
                        lastMsg != null ? lastMsg.getTimestamp() : null;

                long unread =
                        repository.countBySenderIdAndReceiverIdAndReadFalse(
                                contactId, userId
                        );

                return new ChatContactDTO(
                        user,
                        lastMessage,
                        lastTime,
                        unread
                );
            })
            .filter(dto -> dto != null)
            .sorted((a, b) -> {
                if (a.getLastMessageTime() == null) return 1;
                if (b.getLastMessageTime() == null) return -1;
                return b.getLastMessageTime()
                        .compareTo(a.getLastMessageTime());
            })
            .toList();
    }

    // ✅ 3. Get unread messages for a user
    @GetMapping("/{userId}/unread")
    public List<ChatMessage> getUnreadMessages(@PathVariable Long userId) {
        return repository.findByReceiverIdAndReadFalse(userId);
    }

    // ✅ 4. Get unread message count
    @GetMapping("/{userId}/unread-count")
    public long getUnreadCount(@PathVariable Long userId) {
        return repository.countByReceiverIdAndReadFalse(userId);
    }

    // ✅ 5. Mark messages as read (when opening chat)
    @PutMapping("/mark-read")
    public void markMessagesAsRead(
            @RequestParam Long senderId,
            @RequestParam Long receiverId) {

        repository.markAsRead(senderId, receiverId);
    }
}