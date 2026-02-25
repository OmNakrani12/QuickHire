package com.example.demo.dto;

import com.example.demo.entity.User;
import java.time.LocalDateTime;

public class ChatContactDTO {

    private User user;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private long unreadCount;

    public ChatContactDTO(User user, String lastMessage,
                          LocalDateTime lastMessageTime,
                          long unreadCount) {
        this.user = user;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
        this.unreadCount = unreadCount;
    }

    public User getUser() {
        return user;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public LocalDateTime getLastMessageTime() {
        return lastMessageTime;
    }

    public long getUnreadCount() {
        return unreadCount;
    }
}