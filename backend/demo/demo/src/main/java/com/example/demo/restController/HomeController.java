package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;

@RestController
public class HomeController {

    private final DataSource dataSource;

    public HomeController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/db-test")
    public String testDbConnection() {
        try (Connection connection = dataSource.getConnection()) {
            return "✅ Database connected successfully!";
        } catch (Exception e) {
            return "❌ Database connection failed: " + e.getMessage();
        }
    }
}