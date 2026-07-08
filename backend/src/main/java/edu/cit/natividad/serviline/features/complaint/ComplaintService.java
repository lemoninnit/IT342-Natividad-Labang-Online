package edu.cit.natividad.serviline.features.complaint;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import edu.cit.natividad.serviline.features.complaint.ComplaintResponseDTO;
import edu.cit.natividad.serviline.features.complaint.Complaint;
import edu.cit.natividad.serviline.features.user.User;
import edu.cit.natividad.serviline.features.complaint.ComplaintRepository;
import edu.cit.natividad.serviline.features.user.UserRepository;
import java.util.Map;

@Service
@Transactional
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintService(ComplaintRepository complaintRepository, UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    @Caching(evict = {
        @CacheEvict(value = "userComplaints", key = "#userId"),
        @CacheEvict(value = "allComplaints", allEntries = true)
    })
    public ComplaintResponseDTO submitComplaint(Long userId, Map<String, String> data) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = new Complaint();
        complaint.setUser(user);
        complaint.setIncidentType(data.get("incidentType"));
        complaint.setIncidentDate(data.get("incidentDate"));
        complaint.setIncidentTime(data.get("incidentTime"));
        complaint.setLocation(data.get("location"));
        complaint.setDescription(data.get("description"));
        complaint.setPersonsInvolved(data.get("personsInvolved"));
        complaint.setAdditionalNotes(data.get("additionalNotes"));
        complaint.setStatus(Complaint.ComplaintStatus.PENDING);

        Complaint saved = complaintRepository.save(complaint);
        return convertToResponseDTO(saved);
    }

    @Cacheable(value = "userComplaints", key = "#userId")
    public List<ComplaintResponseDTO> getUserComplaints(Long userId) {
        return complaintRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    private ComplaintResponseDTO convertToResponseDTO(Complaint complaint) {
        ComplaintResponseDTO dto = new ComplaintResponseDTO();
        dto.setId(complaint.getId());
        dto.setIncidentType(complaint.getIncidentType());
        dto.setIncidentDate(complaint.getIncidentDate());
        dto.setIncidentTime(complaint.getIncidentTime());
        dto.setLocation(complaint.getLocation());
        dto.setDescription(complaint.getDescription());
        dto.setPersonsInvolved(complaint.getPersonsInvolved());
        dto.setAdditionalNotes(complaint.getAdditionalNotes());
        dto.setStatus(complaint.getStatus().toString());
        dto.setCreatedAt(complaint.getCreatedAt());
        return dto;
    }
}
