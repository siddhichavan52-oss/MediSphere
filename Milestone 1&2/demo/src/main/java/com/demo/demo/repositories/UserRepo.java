package com.demo.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.demo.demo.models.User;

import java.util.List;

public interface UserRepo extends JpaRepository<User, Integer> {

    User findByUsername(String username);

    List<User> findByRoleIgnoreCase(String role);

}
