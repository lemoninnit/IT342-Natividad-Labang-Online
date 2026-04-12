package edu.cit.natividad.labangonline.service;

import edu.cit.natividad.labangonline.entity.CertificateRequest;
import edu.cit.natividad.labangonline.entity.Complaint;
import edu.cit.natividad.labangonline.entity.User;
import edu.cit.natividad.labangonline.repository.CertificateRequestRepository;
import edu.cit.natividad.labangonline.repository.ComplaintRepository;
import edu.cit.natividad.labangonline.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User confirmResident(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setResidentConfirmed(true);
        return userRepository.save(user);
    }

    // Certificate Request Management
    public List<CertificateRequest> getPendingCertificateRequests() {
        return certificateRequestRepository.findByStatusOrderByCreatedAtDesc(CertificateRequest.RequestStatus.PAID);
    }

    public List<CertificateRequest> getAllCertificateRequests() {
        return certificateRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    public CertificateRequest updateCertificateStatus(Long requestId, CertificateRequest.RequestStatus status) {
        CertificateRequest request = certificateRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        return certificateRequestRepository.save(request);
    }

    // Complaint Management
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

    public Complaint updateComplaintStatus(Long complaintId, Complaint.ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }
}
