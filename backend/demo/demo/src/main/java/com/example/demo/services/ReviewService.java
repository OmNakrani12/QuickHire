package com.example.demo.services;

import com.example.demo.entity.Review;
import com.example.demo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review saveReview(Review review) {

        if (review.getReviewer() == null || review.getReviewee() == null) {
            throw new RuntimeException("Reviewer and Reviewee are required");
        }

        Long reviewerId = review.getReviewer().getId();
        Long revieweeId = review.getReviewee().getId();

        Review existing = reviewRepository
                .findByReviewerIdAndRevieweeId(reviewerId, revieweeId);

        if (existing != null) {
            existing.setRating(review.getRating());
            existing.setComment(review.getComment());
            existing.setType(review.getType());
            return reviewRepository.save(existing);
        }

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsForUser(Long userId) {
        return reviewRepository.findByRevieweeId(userId);
    }

    public List<Review> getReviewsByReviewer(Long userId) {
        return reviewRepository.findByReviewerId(userId);
    }

}
