package edu.cit.natividad.labangonline.controller;

import java.util.HashMap;
import java.util.Map;

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

import edu.cit.natividad.labangonline.dto.PaymentDTO;
import edu.cit.natividad.labangonline.dto.PaymentVerificationDTO;
import edu.cit.natividad.labangonline.entity.Payment;
import edu.cit.natividad.labangonline.service.PaymentService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

  private final PaymentService paymentService;

  public PaymentController(PaymentService paymentService) {
    this.paymentService = paymentService;
  }

  @PostMapping("/initiate")
  public ResponseEntity<Map<String, Object>> initiatePayment(
      @RequestHeader("X-User-Id") Long userId,
      @Valid @RequestBody PaymentDTO dto) {
    try {
      Payment payment = paymentService.initiatePayment(userId, dto);
      Map<String, Object> response = new HashMap<>();
      response.put("paymentId", payment.getId());
      response.put("referenceNumber", payment.getReferenceNumber());
      response.put("amount", payment.getAmount());
      response.put("paymentMethod", payment.getPaymentMethod().toString());
      response.put("status", payment.getStatus().toString());
      return ResponseEntity.status(HttpStatus.CREATED).body(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }

  @PostMapping("/verify")
  public ResponseEntity<Map<String, Object>> verifyPayment(
      @RequestHeader("X-User-Id") Long userId,
      @Valid @RequestBody PaymentVerificationDTO dto) {
    try {
      Payment payment = paymentService.verifyPayment(userId, dto);
      Map<String, Object> response = new HashMap<>();
      response.put("paymentId", payment.getId());
      response.put("status", payment.getStatus().toString());
      response.put("message", "Payment verified successfully");
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> errorResponse = new HashMap<>();
      errorResponse.put("error", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
  }

  @GetMapping("/certificate-request/{certificateRequestId}")
  public ResponseEntity<Map<String, Object>> getPaymentByCertificateRequest(
      @RequestHeader("X-User-Id") Long userId,
      @PathVariable Long certificateRequestId) {
    try {
      Payment payment = paymentService.getPaymentByCertificateRequest(certificateRequestId, userId);
      if (payment == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }
      Map<String, Object> response = new HashMap<>();
      response.put("paymentId", payment.getId());
      response.put("referenceNumber", payment.getReferenceNumber());
      response.put("amount", payment.getAmount());
      response.put("paymentMethod", payment.getPaymentMethod().toString());
      response.put("status", payment.getStatus().toString());
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/{paymentId}/failed")
  public ResponseEntity<Map<String, String>> markPaymentFailed(
      @RequestHeader("X-User-Id") Long userId,
      @PathVariable Long paymentId) {
    try {
      paymentService.markPaymentFailed(paymentId, userId);
      Map<String, String> response = new HashMap<>();
      response.put("message", "Payment marked as failed");
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
  }
}
