package com.example.demo.repository;
import com.example.demo.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    @Modifying
    @Transactional
    @Query("""
        UPDATE ChatMessage c
        SET c.read = true
        WHERE c.senderId = :senderId 
        AND c.receiverId = :receiverId
    """)
    void markAsRead(
        @Param("senderId") Long senderId,
        @Param("receiverId") Long receiverId
    );

    List<ChatMessage> findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByTimestampAsc(
        Long sender1, Long receiver1,
        Long sender2, Long receiver2
    );
    
    @Query("""
        SELECT DISTINCT 
            CASE 
                WHEN c.senderId = :userId THEN c.receiverId
                ELSE c.senderId
            END
        FROM ChatMessage c
        WHERE c.senderId = :userId OR c.receiverId = :userId
    """)
    List<Long> findContactIds(@Param("userId") Long userId);

    List<ChatMessage> findByReceiverIdAndReadFalse(Long receiverId);

    @Query("""
        SELECT COUNT(c)
        FROM ChatMessage c
        WHERE c.receiverId = :userId AND c.read = false
    """)
    Long countUnread(@Param("userId") Long userId);

    @Query("""
        SELECT c.senderId, COUNT(c)
        FROM ChatMessage c
        WHERE c.receiverId = :userId AND c.read = false
        GROUP BY c.senderId
    """)
    List<Object[]> countUnreadBySender(@Param("userId") Long userId);

    @Query("""
        SELECT c FROM ChatMessage c
        WHERE (c.senderId = :userId AND c.receiverId = :contactId)
        OR (c.senderId = :contactId AND c.receiverId = :userId)
        ORDER BY c.timestamp DESC
    """)
    List<ChatMessage> findLastMessageRaw(
        @Param("userId") Long userId,
        @Param("contactId") Long contactId
    );

    // 🔹 Count unread messages from a specific sender
    long countBySenderIdAndReceiverIdAndReadFalse(
        Long senderId,
        Long receiverId
    );

    // 🔹 Count all unread messages for a user
    long countByReceiverIdAndReadFalse(Long receiverId);
}