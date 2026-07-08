package edu.cit.natividad.serviline.features.certificate;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

import edu.cit.natividad.serviline.features.certificate.CertificateRequestDTO;
import edu.cit.natividad.serviline.features.certificate.CertificateRequestResponseDTO;
import edu.cit.natividad.serviline.features.certificate.CertificateRequest;
import edu.cit.natividad.serviline.features.user.User;
import edu.cit.natividad.serviline.features.certificate.CertificateRequestRepository;
import edu.cit.natividad.serviline.features.user.UserRepository;

@Service
@Transactional
public class CertificateRequestService {

  private final CertificateRequestRepository certificateRequestRepository;
  private final UserRepository userRepository;

  public CertificateRequestService(
      CertificateRequestRepository certificateRequestRepository,
      UserRepository userRepository) {
    this.certificateRequestRepository = certificateRequestRepository;
    this.userRepository = userRepository;
  }

  @Caching(evict = {
      @CacheEvict(value = "userRequests", key = "#userId"),
      @CacheEvict(value = "allCertificateRequests", allEntries = true)
  })
  public CertificateRequestResponseDTO submitCertificateRequest(
      Long userId, CertificateRequestDTO dto) {
    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

    CertificateRequest request = new CertificateRequest();
    request.setUser(user);
    request.setCertificateType(
        CertificateRequest.CertificateType.valueOf(dto.getCertificateType()));
    request.setPurpose(dto.getPurpose());
    request.setAttachmentPath(dto.getAttachmentPath());
    request.setStatus(CertificateRequest.RequestStatus.PENDING);

    CertificateRequest saved = certificateRequestRepository.save(request);
    return convertToResponseDTO(saved);
  }

  @Cacheable(value = "userRequests", key = "#userId")
  public List<CertificateRequestResponseDTO> getUserRequests(Long userId) {
    return certificateRequestRepository
        .findByUserIdOrderByCreatedAtDesc(userId)
        .stream()
        .map(this::convertToResponseDTO)
        .collect(Collectors.toList());
  }

  public CertificateRequestResponseDTO getRequestById(Long requestId, Long userId) {
    CertificateRequest request =
        certificateRequestRepository.findByIdAndUserId(requestId, userId);
    if (request == null) {
      throw new RuntimeException("Request not found");
    }
    return convertToResponseDTO(request);
  }

  @Caching(evict = {
      @CacheEvict(value = "userRequests", key = "#userId"),
      @CacheEvict(value = "allCertificateRequests", allEntries = true)
  })
  public CertificateRequestResponseDTO updateRequestStatus(
      Long requestId, String status, Long userId) {
    CertificateRequest request =
        certificateRequestRepository.findByIdAndUserId(requestId, userId);
    if (request == null) {
      throw new RuntimeException("Request not found");
    }
    request.setStatus(CertificateRequest.RequestStatus.valueOf(status));
    CertificateRequest updated = certificateRequestRepository.save(request);
    return convertToResponseDTO(updated);
  }

  private CertificateRequestResponseDTO convertToResponseDTO(CertificateRequest request) {
    CertificateRequestResponseDTO dto = new CertificateRequestResponseDTO();
    dto.setId(request.getId());
    dto.setCertificateType(request.getCertificateType().toString());
    dto.setPurpose(request.getPurpose());
    dto.setStatus(request.getStatus().toString());
    dto.setCreatedAt(request.getCreatedAt());
    dto.setUpdatedAt(request.getUpdatedAt());
    dto.setAttachmentPath(request.getAttachmentPath());

    if (request.getPayment() != null) {
      CertificateRequestResponseDTO.PaymentResponseDTO paymentDTO =
          new CertificateRequestResponseDTO.PaymentResponseDTO();
      paymentDTO.setId(request.getPayment().getId());
      paymentDTO.setPaymentMethod(request.getPayment().getPaymentMethod().toString());
      paymentDTO.setAmount(request.getPayment().getAmount());
      paymentDTO.setStatus(request.getPayment().getStatus().toString());
      paymentDTO.setReferenceNumber(request.getPayment().getReferenceNumber());
      paymentDTO.setQrCodePath(request.getPayment().getQrCodePath());
      dto.setPayment(paymentDTO);
    }

    return dto;
  }
}
