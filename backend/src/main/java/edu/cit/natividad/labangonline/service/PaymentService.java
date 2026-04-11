package edu.cit.natividad.labangonline.service;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.cit.natividad.labangonline.dto.PaymentDTO;
import edu.cit.natividad.labangonline.dto.PaymentVerificationDTO;
import edu.cit.natividad.labangonline.entity.CertificateRequest;
import edu.cit.natividad.labangonline.entity.Payment;
import edu.cit.natividad.labangonline.repository.CertificateRequestRepository;
import edu.cit.natividad.labangonline.repository.PaymentRepository;

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
    Payment payment =
        paymentRepository
            .findByIdAndCertificateRequestUserId(dto.getPaymentId(), userId)
            .orElseThrow(() -> new RuntimeException("Payment not found or unauthorized"));

    if (!payment.getReferenceNumber().equals(dto.getReferenceNumber())) {
      payment.setStatus(Payment.PaymentStatus.FAILED);
      paymentRepository.save(payment);
      throw new RuntimeException("Invalid reference number");
    }

    payment.setStatus(Payment.PaymentStatus.COMPLETED);
    payment.getCertificateRequest().setStatus(CertificateRequest.RequestStatus.PAID);

    Payment updated = paymentRepository.save(payment);
    certificateRequestRepository.save(payment.getCertificateRequest());

    return updated;
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
