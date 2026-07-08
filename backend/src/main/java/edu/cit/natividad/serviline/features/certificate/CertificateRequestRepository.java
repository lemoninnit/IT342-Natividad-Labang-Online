package edu.cit.natividad.serviline.features.certificate;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.natividad.serviline.features.certificate.CertificateRequest;

@Repository
public interface CertificateRequestRepository
    extends JpaRepository<CertificateRequest, Long> {
  List<CertificateRequest> findByUserId(Long userId);

  List<CertificateRequest> findByUserIdOrderByCreatedAtDesc(Long userId);

  CertificateRequest findByIdAndUserId(Long id, Long userId);

  List<CertificateRequest> findByStatusOrderByCreatedAtDesc(CertificateRequest.RequestStatus status);
  
  List<CertificateRequest> findAllByOrderByCreatedAtDesc();
}
