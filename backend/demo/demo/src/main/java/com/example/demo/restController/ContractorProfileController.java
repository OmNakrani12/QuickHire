package com.example.demo;

import com.example.demo.dto.ContractorProfileUpdateDTO;
import com.example.demo.services.ContractorService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contractors")
public class ContractorProfileController {

    private final ContractorService contractorService;

    public ContractorProfileController(ContractorService contractorService) {
        this.contractorService = contractorService;
    }

    @PatchMapping("/profile/{email}")
    public String updateProfile(@PathVariable String email,
                                @RequestBody ContractorProfileUpdateDTO dto) {
        contractorService.updateProfile(email, dto);
        return "Contractor profile updated successfully";
    }

    @GetMapping("/profile/email/{email}")
    public ContractorProfileUpdateDTO getProfile(@PathVariable String email) {
        return contractorService.getProfile(email);
    }
}