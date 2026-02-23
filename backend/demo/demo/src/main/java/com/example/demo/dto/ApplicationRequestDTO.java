package com.example.demo.dto;

public class ApplicationRequestDTO {

    private Long workerId;
    private String coverNote;
    private Double proposedRate;
    private String availableFrom;

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getWorkerId() { return workerId; }
    public void setWorkerId(Long workerId) { this.workerId = workerId; }

    public String getCoverNote() { return coverNote; }
    public void setCoverNote(String coverNote) { this.coverNote = coverNote; }

    public Double getProposedRate() { return proposedRate; }
    public void setProposedRate(Double proposedRate) { this.proposedRate = proposedRate; }

    public String getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(String availableFrom) { this.availableFrom = availableFrom; }
}
