package com.example.demo.services;

import com.example.demo.dto.ContractorProfileUpdateDTO;
import com.example.demo.entity.User;
import com.example.demo.entity.Contractor;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ContractorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContractorService {

    private final UserRepository userRepository;
    private final ContractorRepository contractorRepository;

    public ContractorService(UserRepository userRepository,
                             ContractorRepository contractorRepository) {
        this.userRepository = userRepository;
        this.contractorRepository = contractorRepository;
    }

    @Transactional
    public void updateProfile(String email, ContractorProfileUpdateDTO dto) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contractor contractor = contractorRepository.findByUserId(user.getId())
                .orElse(null);

        if (contractor == null) {
            contractor = new Contractor();
            contractor.setUser(user);
        }

        // 🔹 Update User fields
        if (dto.getName() != null)
            user.setName(dto.getName());

        if (dto.getPhone() != null)
            user.setPhone(dto.getPhone());

        if (dto.getLocation() != null)
            user.setLocation(dto.getLocation());

        if (dto.getBio() != null)
            user.setBio(dto.getBio());

        if (dto.getProfilePhoto() != null)
            user.setProfilePhoto(dto.getProfilePhoto());

        // 🔹 Update Contractor fields
        if (dto.getCompanyName() != null)
            contractor.setCompanyName(dto.getCompanyName());

        if (dto.getCompanyType() != null)
            contractor.setCompanyType(dto.getCompanyType());

        if (dto.getYearsInBusiness() != null)
            contractor.setYearsInBusiness(dto.getYearsInBusiness());

        if (dto.getLicenseNumber() != null)
            contractor.setLicenseNumber(dto.getLicenseNumber());

        if (dto.getInsuranceProvider() != null)
            contractor.setInsuranceProvider(dto.getInsuranceProvider());

        if (dto.getWebsite() != null)
            contractor.setWebsite(dto.getWebsite());

        // 🔥 SAVE AFTER SETTING VALUES
        contractorRepository.save(contractor);
    }

    public ContractorProfileUpdateDTO getProfile(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contractor contractor = contractorRepository.findByUserId(user.getId())
                .orElse(null);

        ContractorProfileUpdateDTO dto = new ContractorProfileUpdateDTO();

        // 🔹 User fields
        dto.setEmail(email);
        dto.setName(user.getName());
        dto.setPhone(user.getPhone());
        dto.setLocation(user.getLocation());
        dto.setBio(user.getBio());
        dto.setProfilePhoto(user.getProfilePhoto());

        // 🔹 Contractor fields
        if (contractor != null) {
            dto.setCompanyName(contractor.getCompanyName());
            dto.setCompanyType(contractor.getCompanyType());
            dto.setYearsInBusiness(contractor.getYearsInBusiness());
            dto.setLicenseNumber(contractor.getLicenseNumber());
            dto.setInsuranceProvider(contractor.getInsuranceProvider());
            dto.setWebsite(contractor.getWebsite());
        }

        return dto;
    }
}