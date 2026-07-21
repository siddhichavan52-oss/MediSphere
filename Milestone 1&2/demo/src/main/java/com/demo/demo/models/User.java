package com.demo.demo.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    @Column(nullable=false,unique = true)
    String username;
    @Column(nullable=false)
    String password;
    @Column(nullable=false,unique = true)
    String email;
    @Column(nullable=false)
    String name;
    @Column(nullable=false)
    String role;
}
