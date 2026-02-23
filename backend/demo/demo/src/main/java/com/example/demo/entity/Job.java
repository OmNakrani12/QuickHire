package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import com.example.demo.entity.Contractor;
import com.example.demo.entity.Application;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String title;

    @Column(nullable = true)
    private String location;

    @Column(nullable = true)
    private Double payRate;

    @Column(nullable = true)
    private String duration;

    @Column(nullable = true, length = 1000)
    private String description;

    private String skillsRequired;

    @Column(nullable = true)
    private String status = "OPEN";

    private Integer requiredWorkers;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "contractor_id", nullable = true)
    private Contractor contractor;

    @JsonIgnore
    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL)
    private List<Application> applications;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getPayRate() { return payRate; }
    public void setPayRate(Double payRate) { this.payRate = payRate; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSkillsRequired() { return skillsRequired; }
    public void setSkillsRequired(String skillsRequired) { this.skillsRequired = skillsRequired; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getRequiredWorkers() { return requiredWorkers; }
    public void setRequiredWorkers(Integer requiredWorkers) { this.requiredWorkers = requiredWorkers; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public Contractor getContractor() { return contractor; }
    public void setContractor(Contractor contractor) { this.contractor = contractor; }

    public List<Application> getApplications() { return applications; }
    public void setApplications(List<Application> applications) { this.applications = applications; }
}