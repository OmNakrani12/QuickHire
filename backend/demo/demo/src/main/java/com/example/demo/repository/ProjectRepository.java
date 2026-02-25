package com.example.demo.repository;

import com.example.demo.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByContractorId(Long contractorId);

    List<Project> findByStatus(String status);

    List<Project> findByContractorIdAndStatus(Long contractorId, String status);
}
