package edu.cit.natividad.labangonline.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import edu.cit.natividad.labangonline.dto.ComplaintResponseDTO;
import edu.cit.natividad.labangonline.service.ComplaintService;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping("/submit")
    public ResponseEntity<ComplaintResponseDTO> submitComplaint(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, String> data) {
        try {
            ComplaintResponseDTO response = complaintService.submitComplaint(userId, data);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/my-reports")
    public ResponseEntity<List<ComplaintResponseDTO>> getMyComplaints(
            @RequestHeader("X-User-Id") Long userId) {
        try {
            List<ComplaintResponseDTO> complaints = complaintService.getUserComplaints(userId);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
