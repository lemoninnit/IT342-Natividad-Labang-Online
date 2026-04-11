package edu.cit.natividad.labangonline.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.natividad.labangonline.entity.CertificateRequest;

@Repository
public interface CertificateRequestRepository
    extends JpaRepository<CertificateRequest, Long> {
  List<CertificateRequest> findByUserId(Long userId);

  List<CertificateRequest> findByUserIdOrderByCreatedAtDesc(Long userId);

  CertificateRequest findByIdAndUserId(Long id, Long userId);
}
