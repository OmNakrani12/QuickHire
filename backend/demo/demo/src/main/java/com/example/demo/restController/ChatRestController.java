package com.example.demo.restController;
import com.example.demo.entity.ChatMessage;
import com.example.demo.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin("*")
public class ChatRestController {

    @Autowired
    private ChatMessageRepository repository;

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
}