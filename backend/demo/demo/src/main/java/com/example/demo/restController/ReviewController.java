package com.example.demo.restController;

import com.example.demo.entity.Review;
import com.example.demo.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public Review createReview(@RequestBody Review review) {
        return reviewService.saveReview(review);
    }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsForUser(@PathVariable Long userId) {
        return reviewService.getReviewsForUser(userId);
    }

    @GetMapping("/reviewer/{userId}")
    public List<Review> getReviewsByReviewer(@PathVariable Long userId) {
        return reviewService.getReviewsByReviewer(userId);
    }
}
