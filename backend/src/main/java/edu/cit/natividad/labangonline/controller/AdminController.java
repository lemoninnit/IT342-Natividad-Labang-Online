package edu.cit.natividad.labangonline.controller;

import edu.cit.natividad.labangonline.dto.AdminCertificateRequestResponseDTO;
import edu.cit.natividad.labangonline.entity.CertificateRequest;
import edu.cit.natividad.labangonline.entity.Complaint;
import edu.cit.natividad.labangonline.entity.User;
import edu.cit.natividad.labangonline.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Resident Management
    @GetMapping("/users/unconfirmed")
    public ResponseEntity<List<User>> getUnconfirmedResidents() {
        return ResponseEntity.ok(adminService.getUnconfirmedResidents());
    }

    @GetMapping("/users/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/confirm")
    public ResponseEntity<User> confirmResident(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(adminService.confirmResident(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Certificate Request Management
    @GetMapping("/certificates/all")
    public ResponseEntity<List<AdminCertificateRequestResponseDTO>> getAllCertificates() {
        return ResponseEntity.ok(adminService.getAllCertificateRequests());
    }

    @PutMapping("/certificates/{id}/status")
    public ResponseEntity<AdminCertificateRequestResponseDTO> updateCertificateStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> body) {
        try {
            CertificateRequest.RequestStatus status = CertificateRequest.RequestStatus.valueOf(body.get("status"));
            return ResponseEntity.ok(adminService.updateCertificateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Complaint Management
    @GetMapping("/complaints/all")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(adminService.getAllComplaints());
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> body) {
        try {
            Complaint.ComplaintStatus status = Complaint.ComplaintStatus.valueOf(body.get("status"));
            return ResponseEntity.ok(adminService.updateComplaintStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
