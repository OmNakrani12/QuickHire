package com.example.demo.repository;

import com.example.demo.entity.Contractor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContractorRepository extends JpaRepository<Contractor, Long> {
    Optional<Contractor> findByUserId(Long userId);
    Optional<Contractor> findByLicenseNumber(String licenseNumber);
}