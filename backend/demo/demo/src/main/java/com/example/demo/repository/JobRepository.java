package com.example.demo.repository;

import com.example.demo.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {
    
}