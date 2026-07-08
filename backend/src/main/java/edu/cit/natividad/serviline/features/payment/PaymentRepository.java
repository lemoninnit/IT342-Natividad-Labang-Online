package edu.cit.natividad.serviline.features.payment;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.natividad.serviline.features.payment.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
  Optional<Payment> findByCertificateRequestId(Long certificateRequestId);

  Optional<Payment> findByReferenceNumber(String referenceNumber);

  Optional<Payment> findByIdAndCertificateRequestUserId(Long paymentId, Long userId);
}
