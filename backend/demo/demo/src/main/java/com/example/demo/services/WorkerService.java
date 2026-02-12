package com.example.demo.services;
import com.example.demo.dto.WorkerProfileUpdateDTO;
import com.example.demo.entity.User;
import com.example.demo.entity.Worker;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WorkerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class WorkerService {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;

    public WorkerService(UserRepository userRepository,
                         WorkerRepository workerRepository) {
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
    }

    @Transactional
    public void updateProfile(String email, WorkerProfileUpdateDTO dto) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Worker worker = workerRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Worker newWorker = new Worker();
                    newWorker.setUser(user);
                    return workerRepository.save(newWorker);
                });

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

        if (dto.getHourlyRate() != null)
            worker.setHourlyRate(dto.getHourlyRate());

        if (dto.getExperience() != null)
            worker.setExperience(dto.getExperience());

        if (dto.getAvailability() != null)
            worker.setAvailability(dto.getAvailability());

        if (dto.getSkills() != null)
            worker.setSkills(dto.getSkills());

        if (dto.getCertifications() != null)
            worker.setCertifications(dto.getCertifications());
    }
    public WorkerProfileUpdateDTO getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Worker worker = workerRepository.findByUserId(user.getId())
                .orElse(null);   // 🔥 No exception

        WorkerProfileUpdateDTO dto = new WorkerProfileUpdateDTO();

        // 🔹 User fields
        dto.setEmail(email);
        dto.setName(user.getName());
        dto.setPhone(user.getPhone());
        dto.setLocation(user.getLocation());
        dto.setBio(user.getBio());
        dto.setProfilePhoto(user.getProfilePhoto());

        // 🔹 Worker fields (only if exists)
        if (worker != null) {
            dto.setHourlyRate(worker.getHourlyRate());
            dto.setExperience(worker.getExperience());
            dto.setAvailability(worker.getAvailability());
            dto.setSkills(worker.getSkills());
            dto.setCertifications(worker.getCertifications());
        }

        return dto;
    }
}