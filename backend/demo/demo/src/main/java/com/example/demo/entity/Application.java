package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties({"applications", "contractor"})
    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @JsonIgnoreProperties({"skills", "certifications"})
    @ManyToOne
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @Column(nullable = false)
    private String status = "PENDING";  // PENDING | ACCEPTED | REJECTED

    @Column(length = 2000)
    private String coverNote;

    private Double proposedRate;

    private String availableFrom;

    private LocalDateTime appliedAt;

    @PrePersist
    protected void onApply() {
        appliedAt = LocalDateTime.now();
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }

    public Job getJob() { return job; }
    public void setJob(Job job) { this.job = job; }

    public Worker getWorker() { return worker; }
    public void setWorker(Worker worker) { this.worker = worker; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCoverNote() { return coverNote; }
    public void setCoverNote(String coverNote) { this.coverNote = coverNote; }

    public Double getProposedRate() { return proposedRate; }
    public void setProposedRate(Double proposedRate) { this.proposedRate = proposedRate; }

    public String getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(String availableFrom) { this.availableFrom = availableFrom; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
}