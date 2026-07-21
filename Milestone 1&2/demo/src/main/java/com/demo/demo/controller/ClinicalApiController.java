package com.demo.demo.controller;

import com.demo.demo.models.Appointment;
import com.demo.demo.models.User;
import com.demo.demo.repositories.UserRepo;
import com.demo.demo.repositories.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/clinical")
@CrossOrigin(origins = "*")
public class ClinicalApiController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepo userRepo;

    // --- FETCH ALL ACTIVE SYSTEM PRODUCERS ---
    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        return ResponseEntity.ok(userRepo.findByRoleIgnoreCase("Doctor"));
    }

    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // --- PATIENT CHANNEL LOOKUPS (Via ID string) ---
    @GetMapping("/patient/appointments/{patientId}")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable int patientId) {
        Optional<User> userOpt = userRepo.findById(patientId);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(appointmentRepository.findByPatient(userOpt.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/appointments/book")
    public ResponseEntity<?> bookAppointment(@RequestBody Map<String, Object> payload) {
        if (payload.get("patientId") == null || payload.get("doctorId") == null) {
            return ResponseEntity.badRequest().body("patientId and doctorId are required.");
        }

        int patientId = Integer.parseInt(payload.get("patientId").toString());
        int doctorId = Integer.parseInt(payload.get("doctorId").toString());
        
        Optional<User> patientOpt = userRepo.findById(patientId);
        Optional<User> doctorOpt = userRepo.findById(doctorId);

        if (patientOpt.isEmpty() || doctorOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Patient or Doctor user node not located.");
        }

        User patient = patientOpt.get();
        User doctor = doctorOpt.get();

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setTime((String) payload.get("time"));
        // Was silently dropped before, which is why the Admin dashboard's
        // date-filtered schedule never showed anything.
        appointment.setDate((String) payload.get("date"));
        appointment.setReason((String) payload.get("reason"));

        // Generate dynamic queue tracking indices
        long existingWaitingCount = appointmentRepository.countByDoctorAndStatus(doctor, "Waiting");
        appointment.setQueueNumber((int) existingWaitingCount + 1);

        Appointment saved = appointmentRepository.save(appointment);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/appointments/{id}/pay")
    public ResponseEntity<Appointment> processPayment(@PathVariable Long id) {
        Optional<Appointment> appOpt = appointmentRepository.findById(id);
        if (appOpt.isPresent()) {
            Appointment app = appOpt.get();
            app.setPaymentStatus("Paid");
            return ResponseEntity.ok(appointmentRepository.save(app));
        }
        return ResponseEntity.notFound().build();
    }

    // --- ADMIN TELEMETRY PIPELINES ---
    @PutMapping("/appointments/{id}/checkin")
    public ResponseEntity<Appointment> checkInPatient(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Appointment> appOpt = appointmentRepository.findById(id);
        if (appOpt.isPresent()) {
            Appointment app = appOpt.get();
            app.setStatus("Checked In");
            app.setRoomNumber(payload.get("roomNumber"));
            return ResponseEntity.ok(appointmentRepository.save(app));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/appointments/{id}/finalize-bill")
    public ResponseEntity<Appointment> finalizeBill(@PathVariable Long id, @RequestBody Map<String, Double> payload) {
        Optional<Appointment> appOpt = appointmentRepository.findById(id);
        if (appOpt.isPresent()) {
            Appointment app = appOpt.get();
            app.setBillingAmount(payload.get("finalBill"));
            return ResponseEntity.ok(appointmentRepository.save(app));
        }
        return ResponseEntity.notFound().build();
    }

    // --- DOCTOR MEDICAL ENTRY DESK ---
    @PostMapping("/ehr/prescribe")
    public ResponseEntity<Appointment> submitPrescription(@RequestBody Map<String, Object> payload) {
        Long appointmentId = Long.valueOf(payload.get("appointmentId").toString());
        Optional<Appointment> appOpt = appointmentRepository.findById(appointmentId);
        
        if (appOpt.isPresent()) {
            Appointment app = appOpt.get();
            app.setConditionDiagnosed((String) payload.get("condition"));
            app.setPrescription((String) payload.get("prescription"));
            app.setBillingCodes((String) payload.get("billingCodes"));
            app.setStatus("Completed");
            return ResponseEntity.ok(appointmentRepository.save(app));
        }
        return ResponseEntity.notFound().build();
    }
}
