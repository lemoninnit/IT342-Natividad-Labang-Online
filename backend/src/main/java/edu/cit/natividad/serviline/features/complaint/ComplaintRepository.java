package edu.cit.natividad.serviline.features.complaint;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import edu.cit.natividad.serviline.features.complaint.Complaint;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Complaint> findAllByOrderByCreatedAtDesc();
}
