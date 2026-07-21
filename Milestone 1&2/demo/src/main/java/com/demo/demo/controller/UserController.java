package com.demo.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.demo.dto.LoginDto;
import com.demo.demo.models.User;
import com.demo.demo.repositories.UserRepo;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    UserRepo userRepo;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            return "Username is required";
        }
        if (userRepo.findByUsername(user.getUsername()) != null) {
            return "User already exists";
        }

        // Password stored as-is (no hashing)
        userRepo.save(user);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginDto u) {
        User user = userRepo.findByUsername(u.getUsername());
        if (user == null) {
            return "User Not Found";
        }
        // Direct string comparison (no hashing)
        if (!u.getPassword().equals(user.getPassword())) {
            return "Password Incorrect";
        }
        if (!u.getRole().equalsIgnoreCase(user.getRole())) {
            return "Role Incorrect";
        }
        return String.valueOf(user.getId());
    }

}