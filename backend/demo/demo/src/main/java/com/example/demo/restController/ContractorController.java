package com.example.demo.controller;

import com.example.demo.entity.Contractor;
import com.example.demo.repository.ContractorRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contractors")
@CrossOrigin
public class ContractorController {

    private final ContractorRepository contractorRepository;

    public ContractorController(ContractorRepository contractorRepository) {
        this.contractorRepository = contractorRepository;
    }

    // 🔹 Get Contractor by ID
    @GetMapping("/{id}")
    public Contractor getContractor(@PathVariable Long id) {
        return contractorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contractor not found"));
    }

    // 🔹 Get Contractor by User ID
    @GetMapping("/user/{userId}")
    public Contractor getByUserId(@PathVariable Long userId) {
        return contractorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Contractor not found"));
    }

    // 🔹 Create Contractor
    @PostMapping
    public Contractor createContractor(@RequestBody Contractor contractor) {
        return contractorRepository.save(contractor);
    }

    // 🔹 Update Contractor
    @PatchMapping("/{id}")
    public Contractor updateContractor(@PathVariable Long id,
                                       @RequestBody Contractor updatedContractor) {

        Contractor contractor = contractorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contractor not found"));

        contractor.setCompanyName(updatedContractor.getCompanyName());
        contractor.setCompanyType(updatedContractor.getCompanyType());
        contractor.setYearsInBusiness(updatedContractor.getYearsInBusiness());
        contractor.setLicenseNumber(updatedContractor.getLicenseNumber());
        contractor.setInsuranceProvider(updatedContractor.getInsuranceProvider());
        contractor.setWebsite(updatedContractor.getWebsite());

        return contractorRepository.save(contractor);
    }

    // 🔹 Delete Contractor
    @DeleteMapping("/{id}")
    public String deleteContractor(@PathVariable Long id) {
        contractorRepository.deleteById(id);
        return "Contractor deleted successfully";
    }
}