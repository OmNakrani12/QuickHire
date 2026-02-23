package com.example.demo.restController;

import com.example.demo.dto.ApplicationRequestDTO;
import com.example.demo.entity.Application;
import com.example.demo.entity.Job;
import com.example.demo.entity.Worker;
import com.example.demo.repository.ApplicationRepository;
import com.example.demo.repository.JobRepository;
import com.example.demo.repository.WorkerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final WorkerRepository workerRepository;

    public JobController(JobRepository jobRepository,
                         ApplicationRepository applicationRepository,
                         WorkerRepository workerRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.workerRepository = workerRepository;
    }

    // ── Create job ───────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        Job savedJob = jobRepository.save(job);
        return ResponseEntity.ok(savedJob);
    }

    // ── Get job by ID ────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Get all jobs ─────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAll());
    }

    // ── Worker applies for a job ─────────────────────────────────────────────
    @PostMapping("/{jobId}/apply")
    public ResponseEntity<?> applyForJob(
            @PathVariable Long jobId,
            @RequestBody ApplicationRequestDTO dto) {

        Job job = jobRepository.findById(jobId).orElse(null);
        if (job == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Job not found"));
        }

        Worker worker = workerRepository.findById(dto.getWorkerId()).orElse(null);
        if (worker == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Worker not found"));
        }

        // Prevent duplicate applications
        List<Application> existing = applicationRepository.findByJobId(jobId);
        boolean alreadyApplied = existing.stream()
                .anyMatch(a -> a.getWorker().getId().equals(dto.getWorkerId()));
        if (alreadyApplied) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "You have already applied for this job"));
        }

        Application application = new Application();
        application.setJob(job);
        application.setWorker(worker);
        application.setCoverNote(dto.getCoverNote());
        application.setProposedRate(dto.getProposedRate());
        application.setAvailableFrom(dto.getAvailableFrom());
        application.setStatus("PENDING");

        applicationRepository.save(application);

        return ResponseEntity.ok(Map.of("message", "Application submitted successfully"));
    }

    // ── Get all applications for a job (for contractor) ──────────────────────
    @GetMapping("/{jobId}/applications")
    public ResponseEntity<List<Application>> getApplicationsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationRepository.findByJobId(jobId));
    }

    // ── Get all applications by a worker ─────────────────────────────────────
    @GetMapping("/applications/worker/{workerId}")
    public ResponseEntity<List<Application>> getApplicationsByWorker(@PathVariable Long workerId) {
        return ResponseEntity.ok(applicationRepository.findByWorkerId(workerId));
    }
}