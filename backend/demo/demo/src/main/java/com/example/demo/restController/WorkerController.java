package com.example.demo.controller;

import com.example.demo.entity.Worker;
import com.example.demo.repository.WorkerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.OPTIONS})
public class WorkerController {

    private final WorkerRepository workerRepository;

    public WorkerController(WorkerRepository workerRepository) {
        this.workerRepository = workerRepository;
    }

    // ===============================
    // 🔹 GET WORKER BY ID
    // ===============================
    @GetMapping("/{id}")
    public ResponseEntity<Worker> getWorker(@PathVariable Long id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        return ResponseEntity.ok(worker);
    }

    // ===============================
    // 🔹 GET WORKER BY USER ID
    // ===============================
    @GetMapping("/user/{userId}")
    public ResponseEntity<Worker> getWorkerByUserId(@PathVariable Long userId) {
        Worker worker = workerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Worker not found"));
        return ResponseEntity.ok(worker);
    }

    // ===============================
    // 🔹 GET ALL WORKERS
    // ===============================
    @GetMapping
    public ResponseEntity<List<Worker>> getAllWorkers() {
        return ResponseEntity.ok(workerRepository.findAll());
    }

    // ===============================
    // 🔹 CREATE WORKER
    // ===============================
    @PostMapping
    public ResponseEntity<Worker> createWorker(@RequestBody Worker worker) {
        Worker savedWorker = workerRepository.save(worker);
        return ResponseEntity.ok(savedWorker);
    }

    // ===============================
    // 🔹 PATCH UPDATE WORKER
    // ===============================
    @PatchMapping("/{id}")
    public ResponseEntity<Worker> updateWorker(
            @PathVariable Long id,
            @RequestBody Worker updatedWorker) {

        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        // PATCH-safe updates
        if (updatedWorker.getSkills() != null)
            worker.setSkills(updatedWorker.getSkills());

        if (updatedWorker.getCertifications() != null)
            worker.setCertifications(updatedWorker.getCertifications());

        if (updatedWorker.getExperience() != null)
            worker.setExperience(updatedWorker.getExperience());

        if (updatedWorker.getHourlyRate() != null)
            worker.setHourlyRate(updatedWorker.getHourlyRate());

        if (updatedWorker.getAvailability() != null)
            worker.setAvailability(updatedWorker.getAvailability());

        Worker savedWorker = workerRepository.save(worker);

        return ResponseEntity.ok(savedWorker);
    }

    // ===============================
    // 🔹 DELETE WORKER
    // ===============================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorker(@PathVariable Long id) {

        if (!workerRepository.existsById(id)) {
            throw new RuntimeException("Worker not found");
        }

        workerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}