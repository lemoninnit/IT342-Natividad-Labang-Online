package edu.cit.natividad.serviline.features.certificate;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.natividad.serviline.features.certificate.CertificateRequestDTO;
import edu.cit.natividad.serviline.features.certificate.CertificateRequestResponseDTO;
import edu.cit.natividad.serviline.features.certificate.CertificateRequestService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/certificate-requests")
public class CertificateRequestController {

  private final CertificateRequestService certificateRequestService;

  public CertificateRequestController(CertificateRequestService certificateRequestService) {
    this.certificateRequestService = certificateRequestService;
  }

  @PostMapping("/submit")
  public ResponseEntity<CertificateRequestResponseDTO> submitRequest(
      @RequestHeader("X-User-Id") Long userId,
      @Valid @RequestBody CertificateRequestDTO dto) {
    try {
      CertificateRequestResponseDTO response = certificateRequestService.submitCertificateRequest(userId, dto);
      return ResponseEntity.status(HttpStatus.CREATED).body(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }

  @GetMapping("/my-requests")
  public ResponseEntity<List<CertificateRequestResponseDTO>> getMyRequests(
      @RequestHeader("X-User-Id") Long userId) {
    try {
      List<CertificateRequestResponseDTO> requests = certificateRequestService.getUserRequests(userId);
      return ResponseEntity.ok(requests);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/{requestId}")
  public ResponseEntity<CertificateRequestResponseDTO> getRequest(
      @RequestHeader("X-User-Id") Long userId,
      @PathVariable Long requestId) {
    try {
      CertificateRequestResponseDTO request = certificateRequestService.getRequestById(requestId, userId);
      return ResponseEntity.ok(request);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
  }

  @PutMapping("/{requestId}/status")
  public ResponseEntity<CertificateRequestResponseDTO> updateRequestStatus(
      @RequestHeader("X-User-Id") Long userId,
      @PathVariable Long requestId,
      @RequestBody java.util.Map<String, String> request) {
    try {
      String status = request.get("status");
      CertificateRequestResponseDTO response = certificateRequestService.updateRequestStatus(requestId, status, userId);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }
}
