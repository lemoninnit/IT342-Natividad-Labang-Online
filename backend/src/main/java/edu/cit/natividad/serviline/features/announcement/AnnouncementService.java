package edu.cit.natividad.serviline.features.announcement;

import edu.cit.natividad.serviline.features.announcement.Announcement;
import edu.cit.natividad.serviline.features.announcement.AnnouncementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    @Cacheable(value = "announcements")
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc();
    }

    @CacheEvict(value = "announcements", allEntries = true)
    public Announcement createAnnouncement(Announcement announcement) {
        announcement.setCreatedAt(LocalDateTime.now());
        announcement.setUpdatedAt(LocalDateTime.now());
        return announcementRepository.save(announcement);
    }

    @CacheEvict(value = "announcements", allEntries = true)
    public Announcement updateAnnouncement(Long id, Announcement announcementDetails) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
        
        announcement.setTitle(announcementDetails.getTitle());
        announcement.setContent(announcementDetails.getContent());
        announcement.setType(announcementDetails.getType());
        announcement.setPriority(announcementDetails.getPriority());
        announcement.setPostedBy(announcementDetails.getPostedBy());
        announcement.setExpiresAt(announcementDetails.getExpiresAt());
        announcement.setPublished(announcementDetails.isPublished());
        announcement.setUpdatedAt(LocalDateTime.now());
        
        return announcementRepository.save(announcement);
    }

    @CacheEvict(value = "announcements", allEntries = true)
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}
