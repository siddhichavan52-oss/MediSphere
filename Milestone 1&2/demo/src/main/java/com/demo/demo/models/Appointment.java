package com.demo.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Connects directly back to your existing User framework
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;

    private String time;
    private String date; // YYYY-MM-DD, used by Admin's date-filtered schedule
    private String reason;
    private String status = "Waiting"; // Waiting, Checked In, In Progress, Completed
    private String roomNumber;
    private Integer queueNumber;
    
    @Column(columnDefinition = "TEXT")
    private String prescription;
    private String conditionDiagnosed;
    private String billingCodes;
    
    private Double billingAmount = 150.00; 
    private String paymentStatus = "Unpaid"; // Unpaid, Paid
}