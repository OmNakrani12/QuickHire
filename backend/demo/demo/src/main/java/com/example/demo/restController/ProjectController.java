package com.example.demo.restController;

import com.example.demo.entity.Contractor;
import com.example.demo.entity.Project;
import com.example.demo.repository.ContractorRepository;
import com.example.demo.repository.ProjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final ContractorRepository contractorRepository;

    public ProjectController(ProjectRepository projectRepository,
                             ContractorRepository contractorRepository) {
        this.projectRepository = projectRepository;
        this.contractorRepository = contractorRepository;
    }

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project) {
        if (project.getContractor() != null && project.getContractor().getId() != null) {
            Contractor contractor = contractorRepository
                    .findById(project.getContractor().getId())
                    .orElse(null);
            if (contractor == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Contractor not found"));
            }
            project.setContractor(contractor);
        }
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/contractor/{contractorId}")
    public ResponseEntity<List<Project>> getProjectsByContractor(
            @PathVariable Long contractorId) {
        return ResponseEntity.ok(projectRepository.findByContractorId(contractorId));
    }

    @GetMapping("/contractor/{contractorId}/status/{status}")
    public ResponseEntity<List<Project>> getProjectsByContractorAndStatus(
            @PathVariable Long contractorId,
            @PathVariable String status) {
        return ResponseEntity.ok(
                projectRepository.findByContractorIdAndStatus(contractorId, status));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id,
                                           @RequestBody Project updated) {
        return projectRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setDescription(updated.getDescription());
            existing.setLocation(updated.getLocation());
            existing.setStatus(updated.getStatus());
            existing.setWorkers(updated.getWorkers());
            existing.setProgress(updated.getProgress());
            existing.setBudget(updated.getBudget());
            existing.setSpent(updated.getSpent());
            existing.setDeadline(updated.getDeadline());
            existing.setSkills(updated.getSkills());
            return ResponseEntity.ok(projectRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (!projectRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
