package com.example.demo.repository;

import com.example.demo.entity.Job;
import com.example.demo.entity.Contractor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    // Find all jobs by contractor
    List<Job> findByContractor(Contractor contractor);

    // Find jobs by status (OPEN / CLOSED)
    List<Job> findByStatus(String status);

    // Find jobs by location
    List<Job> findByLocation(String location);

    // Search by title keyword
    List<Job> findByTitleContainingIgnoreCase(String keyword);

    // Search by skills
    List<Job> findBySkillsRequiredContainingIgnoreCase(String skill);

}