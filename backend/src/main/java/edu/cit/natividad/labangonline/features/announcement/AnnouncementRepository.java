package edu.cit.natividad.serviline.features.announcement;

import edu.cit.natividad.serviline.features.announcement.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findAllByOrderByCreatedAtDesc();
}
