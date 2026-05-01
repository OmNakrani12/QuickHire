package com.example.demo.restController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.demo.services.CloudinaryService;


@RestController
@RequestMapping("/api/upload")
public class CloudinaryController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        return cloudinaryService.uploadFile(file);
    }

    @GetMapping("/test")
    public String test() {
        return "Upload API Working";
    }
}