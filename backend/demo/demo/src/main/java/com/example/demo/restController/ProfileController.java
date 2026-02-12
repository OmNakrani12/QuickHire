package com.example.demo;

import com.example.demo.dto.WorkerProfileUpdateDTO;
import com.example.demo.services.WorkerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workers")
public class ProfileController {

    private final WorkerService workerService;
    @Autowired
    public ProfileController(WorkerService workerService) {
        this.workerService = workerService;
    }
    
    @PatchMapping("/profile/{email}")
    public String updateProfile(@PathVariable String email,
                                @RequestBody WorkerProfileUpdateDTO dto) {
        workerService.updateProfile(email, dto);
        return "Profile updated successfully";
    }

    @GetMapping("/profile/email/{email}")
    public WorkerProfileUpdateDTO getProfile(@PathVariable String email) {
        return workerService.getProfile(email);
    }
}