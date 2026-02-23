package com.example.demo.repository;

import com.example.demo.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    /** All applications for a given job (used by contractor dashboard) */
    List<Application> findByJobId(Long jobId);

    /** All applications submitted by a worker (used by worker dashboard) */
    List<Application> findByWorkerId(Long workerId);
}
