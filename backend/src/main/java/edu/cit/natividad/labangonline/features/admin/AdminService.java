package edu.cit.natividad.labangonline.features.admin;

import edu.cit.natividad.labangonline.features.certificate.AdminCertificateRequestResponseDTO;
import edu.cit.natividad.labangonline.features.certificate.CertificateRequest;
import edu.cit.natividad.labangonline.features.complaint.Complaint;
import edu.cit.natividad.labangonline.features.user.User;
import edu.cit.natividad.labangonline.features.certificate.CertificateRequestRepository;
import edu.cit.natividad.labangonline.features.complaint.ComplaintRepository;
import edu.cit.natividad.labangonline.features.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final CertificateRequestRepository certificateRequestRepository;
    private final ComplaintRepository complaintRepository;

    public AdminService(UserRepository userRepository, 
                        CertificateRequestRepository certificateRequestRepository, 
                        ComplaintRepository complaintRepository) {
        this.userRepository = userRepository;
        this.certificateRequestRepository = certificateRequestRepository;
        this.complaintRepository = complaintRepository;
    }

    // Resident Management
    public List<User> getUnconfirmedResidents() {
        return userRepository.findByResidentConfirmedFalse();
    }

    @Cacheable(value = "allUsers")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Caching(evict = {
        @CacheEvict(value = "allUsers", allEntries = true),
        @CacheEvict(value = "users", key = "#userId")
    })
    public User confirmResident(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setResidentConfirmed(true);
        return userRepository.save(user);
    }

    // Certificate Request Management
    public List<AdminCertificateRequestResponseDTO> getPendingCertificateRequests() {
        return certificateRequestRepository.findByStatusOrderByCreatedAtDesc(CertificateRequest.RequestStatus.PAID)
            .stream()
            .map(this::convertToAdminDTO)
            .collect(Collectors.toList());
    }

    @Cacheable(value = "allCertificateRequests")
    public List<AdminCertificateRequestResponseDTO> getAllCertificateRequests() {
        return certificateRequestRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::convertToAdminDTO)
            .collect(Collectors.toList());
    }

    @Caching(evict = {
        @CacheEvict(value = "allCertificateRequests", allEntries = true),
        @CacheEvict(value = "userRequests", key = "#result.user.id")
    })
    public AdminCertificateRequestResponseDTO updateCertificateStatus(Long requestId, CertificateRequest.RequestStatus status) {
        CertificateRequest request = certificateRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        request.setUpdatedAt(java.time.LocalDateTime.now());
        return convertToAdminDTO(certificateRequestRepository.save(request));
    }

    private AdminCertificateRequestResponseDTO convertToAdminDTO(CertificateRequest request) {
        AdminCertificateRequestResponseDTO dto = new AdminCertificateRequestResponseDTO();
        dto.setId(request.getId());
        dto.setCertificateType(request.getCertificateType().toString());
        dto.setPurpose(request.getPurpose());
        dto.setStatus(request.getStatus().toString());
        dto.setCreatedAt(request.getCreatedAt());
        dto.setUpdatedAt(request.getUpdatedAt());
        dto.setAttachmentPath(request.getAttachmentPath());

        User user = request.getUser();
        if (user != null) {
            AdminCertificateRequestResponseDTO.AdminUserResponseDTO userDto = new AdminCertificateRequestResponseDTO.AdminUserResponseDTO();
            userDto.setId(user.getId());
            userDto.setFirstName(user.getFirstName());
            userDto.setLastName(user.getLastName());
            userDto.setEmail(user.getEmail());
            userDto.setPhoneNumber(user.getPhoneNumber());
            userDto.setStreet(user.getStreet());
            userDto.setPurok(user.getPurok());
            userDto.setBarangay(user.getBarangay());
            userDto.setCity(user.getCity());
            userDto.setProvince(user.getProvince());
            userDto.setPostalCode(user.getPostalCode());
            userDto.setResidentConfirmed(user.isResidentConfirmed());
            dto.setUser(userDto);
        }

        if (request.getPayment() != null) {
            AdminCertificateRequestResponseDTO.PaymentResponseDTO paymentDto = new AdminCertificateRequestResponseDTO.PaymentResponseDTO();
            paymentDto.setId(request.getPayment().getId());
            paymentDto.setPaymentMethod(request.getPayment().getPaymentMethod().toString());
            paymentDto.setAmount(request.getPayment().getAmount().toPlainString());
            paymentDto.setStatus(request.getPayment().getStatus().toString());
            paymentDto.setReferenceNumber(request.getPayment().getReferenceNumber());
            paymentDto.setQrCodePath(request.getPayment().getQrCodePath());
            if (request.getPayment().getProofImage() != null) {
                paymentDto.setProofImage(Base64.getEncoder().encodeToString(request.getPayment().getProofImage()));
            }
            dto.setPayment(paymentDto);
        }

        return dto;
    }

    // Complaint Management
    @Cacheable(value = "allComplaints")
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

    @Caching(evict = {
        @CacheEvict(value = "allComplaints", allEntries = true),
        @CacheEvict(value = "userComplaints", key = "#result.user.id")
    })
    public Complaint updateComplaintStatus(Long complaintId, Complaint.ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }
}
