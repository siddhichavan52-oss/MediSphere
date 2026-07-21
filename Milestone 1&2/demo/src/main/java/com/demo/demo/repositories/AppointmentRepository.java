package com.demo.demo.repositories;

import com.demo.demo.models.Appointment;
import com.demo.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    // Fetches live entries mapped strictly to the logged-in User references
    List<Appointment> findByPatient(User patient);
    List<Appointment> findByDoctor(User doctor);
    long countByDoctorAndStatus(User doctor, String status);
}