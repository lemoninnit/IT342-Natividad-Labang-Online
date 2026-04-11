package edu.cit.natividad.labangonline.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.cit.natividad.labangonline.dto.CertificateRequestDTO;
import edu.cit.natividad.labangonline.dto.CertificateRequestResponseDTO;
import edu.cit.natividad.labangonline.entity.CertificateRequest;
import edu.cit.natividad.labangonline.entity.User;
import edu.cit.natividad.labangonline.repository.CertificateRequestRepository;
import edu.cit.natividad.labangonline.repository.UserRepository;

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
