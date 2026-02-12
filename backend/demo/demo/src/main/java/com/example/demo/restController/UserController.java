package com.example.demo;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.OPTIONS})
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ Get user by ID
    @GetMapping("/id/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // ✅ Get user by EMAIL
    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    // ✅ Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Create user
    @PostMapping
    public User saveUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // ✅ Partial update
    @PatchMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        User existingUser = userRepository.findById(id).orElse(null);

        if (existingUser != null) {
            if (user.getName() != null)
                existingUser.setName(user.getName());

            if (user.getPhone() != null)
                existingUser.setPhone(user.getPhone());

            if (user.getRole() != null)
                existingUser.setRole(user.getRole());

            if(user.getLocation() != null)
                existingUser.setLocation(user.getLocation());

            if(user.getBio() != null)
                existingUser.setBio(user.getBio());

            return userRepository.save(existingUser);
        }
        return existingUser;
    }
}