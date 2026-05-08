package edu.cit.natividad.labangonline.features.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.cit.natividad.labangonline.features.payment.PaymentDTO;
import edu.cit.natividad.labangonline.features.payment.PaymentVerificationDTO;
import edu.cit.natividad.labangonline.features.certificate.CertificateRequest;
import edu.cit.natividad.labangonline.features.payment.Payment;
import edu.cit.natividad.labangonline.features.certificate.CertificateRequestRepository;
import edu.cit.natividad.labangonline.features.payment.PaymentRepository;

@Service
@Transactional
public class PaymentService {

  private final PaymentRepository paymentRepository;
  private final CertificateRequestRepository certificateRequestRepository;

  public PaymentService(
      PaymentRepository paymentRepository,
      CertificateRequestRepository certificateRequestRepository) {
    this.paymentRepository = paymentRepository;
    this.certificateRequestRepository = certificateRequestRepository;
  }

  public Payment initiatePayment(Long userId, PaymentDTO dto) {
    CertificateRequest request =
        certificateRequestRepository.findById(dto.getCertificateRequestId())
            .orElseThrow(() -> new RuntimeException("Certificate request not found"));

    if (!request.getUser().getId().equals(userId)) {
      throw new RuntimeException("Unauthorized access to certificate request");
    }

    // Check if payment already exists
    Optional<Payment> existingPayment =
        paymentRepository.findByCertificateRequestId(dto.getCertificateRequestId());
    if (existingPayment.isPresent()) {
      return existingPayment.get();
    }

    Payment payment = new Payment();
    payment.setCertificateRequest(request);
    payment.setPaymentMethod(Payment.PaymentMethod.valueOf(dto.getPaymentMethod()));
    payment.setAmount(dto.getAmount() != null ? dto.getAmount() : BigDecimal.valueOf(500));
    payment.setStatus(Payment.PaymentStatus.PENDING);
    payment.setReferenceNumber(generateReferenceNumber());

    Payment saved = paymentRepository.save(payment);
    return saved;
  }

  public Payment verifyPayment(Long userId, PaymentVerificationDTO dto) {
    if (dto.getPaymentId() == null) {
      throw new RuntimeException("Payment ID is required");
    }

    Payment payment =
        paymentRepository
            .findById(dto.getPaymentId())
            .orElseThrow(() -> new RuntimeException("Payment record not found"));

    // Ensure the payment belongs to the correct user if userId is provided
    if (userId != null && !payment.getCertificateRequest().getUser().getId().equals(userId)) {
      throw new RuntimeException("Unauthorized access to this payment record");
    }

    if (payment.getPaymentMethod() == Payment.PaymentMethod.GCASH) {
      // For GCash, validate 13 digits as requested by user
      if (dto.getReferenceNumber() == null || !dto.getReferenceNumber().matches("^[0-9]{13}$")) {
        throw new RuntimeException("Invalid 13-digit GCash reference number");
      }
      if (dto.getProofImage() == null || dto.getProofImage().isEmpty()) {
        throw new RuntimeException("GCash payment requires proof of payment image");
      }
      
      try {
        // Handle base64 string (might have prefix "data:image/jpeg;base64,")
        String base64Data = dto.getProofImage();
        if (base64Data.contains(",")) {
          base64Data = base64Data.split(",")[1];
        }
        byte[] imageBytes = Base64.getDecoder().decode(base64Data);
        payment.setProofImage(imageBytes);
      } catch (IllegalArgumentException e) {
        throw new RuntimeException("Invalid image data format");
      }
      
      payment.setStatus(Payment.PaymentStatus.PROCESSING);
    } else {
      // For OTC, allow 13-digit reference number and no image proof
      if (dto.getReferenceNumber() == null || !dto.getReferenceNumber().matches("^[0-9]{13}$")) {
        throw new RuntimeException("Invalid 13-digit reference number from receipt");
      }
      payment.setStatus(Payment.PaymentStatus.PROCESSING);
    }

    payment.setReferenceNumber(dto.getReferenceNumber()); // Store the user-provided reference
    
    CertificateRequest request = payment.getCertificateRequest();
    // Mark as PENDING to show it's awaiting admin approval
    request.setStatus(CertificateRequest.RequestStatus.PENDING);
    request.setUpdatedAt(LocalDateTime.now());

    Payment updated = paymentRepository.save(payment);
    certificateRequestRepository.save(request);

    return updated;
  }

  public Payment approvePayment(Long paymentId) {
    Payment payment = paymentRepository.findById(paymentId)
        .orElseThrow(() -> new RuntimeException("Payment not found"));

    payment.setStatus(Payment.PaymentStatus.COMPLETED);
    
    CertificateRequest request = payment.getCertificateRequest();
    request.setStatus(CertificateRequest.RequestStatus.PAID);
    request.setUpdatedAt(LocalDateTime.now());

    certificateRequestRepository.save(request);
    return paymentRepository.save(payment);
  }

  public Payment rejectPayment(Long paymentId) {
    Payment payment = paymentRepository.findById(paymentId)
        .orElseThrow(() -> new RuntimeException("Payment not found"));

    payment.setStatus(Payment.PaymentStatus.FAILED);
    
    CertificateRequest request = payment.getCertificateRequest();
    request.setStatus(CertificateRequest.RequestStatus.FAILED_PAYMENT_VERIFICATION);
    request.setUpdatedAt(LocalDateTime.now());

    certificateRequestRepository.save(request);
    return paymentRepository.save(payment);
  }

  public Payment getPaymentByCertificateRequest(Long certificateRequestId, Long userId) {
    CertificateRequest request =
        certificateRequestRepository.findById(certificateRequestId)
            .orElseThrow(() -> new RuntimeException("Certificate request not found"));

    if (!request.getUser().getId().equals(userId)) {
      throw new RuntimeException("Unauthorized access");
    }

    return paymentRepository
        .findByCertificateRequestId(certificateRequestId)
        .orElse(null);
  }

  public Payment markPaymentFailed(Long paymentId, Long userId) {
    Payment payment =
        paymentRepository
            .findByIdAndCertificateRequestUserId(paymentId, userId)
            .orElseThrow(() -> new RuntimeException("Payment not found or unauthorized"));

    payment.setStatus(Payment.PaymentStatus.FAILED);
    payment.getCertificateRequest()
        .setStatus(CertificateRequest.RequestStatus.FAILED_PAYMENT_VERIFICATION);

    Payment updated = paymentRepository.save(payment);
    certificateRequestRepository.save(payment.getCertificateRequest());

    return updated;
  }

  private String generateReferenceNumber() {
    return "REF-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
  }
}
