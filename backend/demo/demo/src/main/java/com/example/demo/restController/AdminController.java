package com.example.demo.restController;

import com.example.demo.entity.Contractor;
import com.example.demo.entity.Job;
import com.example.demo.entity.User;
import com.example.demo.entity.Worker;
import com.example.demo.repository.ApplicationRepository;
import com.example.demo.repository.ContractorRepository;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WorkerRepository;
import com.example.demo.repository.ReviewRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final ContractorRepository contractorRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final ReviewRepository reviewRepository;

    public AdminController(UserRepository userRepository, WorkerRepository workerRepository,
                           ContractorRepository contractorRepository, JobRepository jobRepository,
                           ApplicationRepository applicationRepository, ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.contractorRepository = contractorRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.reviewRepository = reviewRepository;
    }

    @PutMapping("/users/{id}/ban")
    public ResponseEntity<?> toggleBanStatus(@PathVariable Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            boolean currentStatus = user.getIsBanned() != null ? user.getIsBanned() : false;
            user.setIsBanned(!currentStatus);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "User ban status updated", "isBanned", user.getIsBanned()));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            
            // Delete associated reviews
            reviewRepository.deleteAll(reviewRepository.findByRevieweeId(user.getId()));
            reviewRepository.deleteAll(reviewRepository.findByReviewerId(user.getId()));
            
            if ("worker".equalsIgnoreCase(user.getRole())) {
                Optional<Worker> worker = workerRepository.findByUserId(user.getId());
                if (worker.isPresent()) {
                    applicationRepository.deleteAll(applicationRepository.findByWorkerId(worker.get().getId()));
                    workerRepository.delete(worker.get());
                }
            } else if ("contractor".equalsIgnoreCase(user.getRole())) {
                Optional<Contractor> contractor = contractorRepository.findByUserId(user.getId());
                if (contractor.isPresent()) {
                    List<Job> jobs = jobRepository.findByContractorId(contractor.get().getId());
                    for (Job job : jobs) {
                        applicationRepository.deleteAll(applicationRepository.findByJobId(job.getId()));
                        jobRepository.delete(job);
                    }
                    contractorRepository.delete(contractor.get());
                }
            }
            
            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
