package edu.cit.natividad.labangonline.shared.config;

import edu.cit.natividad.labangonline.features.admin.AdminService;
import edu.cit.natividad.labangonline.features.announcement.AnnouncementService;
import edu.cit.natividad.labangonline.features.certificate.CertificateRequestService;
import edu.cit.natividad.labangonline.features.complaint.ComplaintService;
import edu.cit.natividad.labangonline.features.user.User;
import edu.cit.natividad.labangonline.features.user.UserRepository;
import edu.cit.natividad.labangonline.features.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Component
public class CachePreloader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(CachePreloader.class);

    private final UserRepository userRepository;
    private final UserService userService;
    private final AdminService adminService;
    private final AnnouncementService announcementService;
    private final CertificateRequestService certificateRequestService;
    private final ComplaintService complaintService;

    public CachePreloader(UserRepository userRepository,
                          UserService userService,
                          AdminService adminService,
                          AnnouncementService announcementService,
                          CertificateRequestService certificateRequestService,
                          ComplaintService complaintService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.adminService = adminService;
        this.announcementService = announcementService;
        this.certificateRequestService = certificateRequestService;
        this.complaintService = complaintService;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing asynchronous database cache preloading...");
        
        CompletableFuture.runAsync(() -> {
            try {
                logger.info("Starting background cache preloading of critical datasets...");

                // 1. Preload announcements
                logger.info("Preloading announcements into server cache...");
                announcementService.getAllAnnouncements();

                // 2. Preload admin datasets
                logger.info("Preloading all users into server cache...");
                List<User> users = adminService.getAllUsers();

                logger.info("Preloading all certificate requests into server cache...");
                adminService.getAllCertificateRequests();

                logger.info("Preloading all complaints into server cache...");
                adminService.getAllComplaints();

                // 3. Preload user-specific history records (requests, complaints, profiles)
                logger.info("Preloading user-specific history and profile records for {} users...", users.size());
                for (User user : users) {
                    Long userId = user.getId();
                    userService.getUserById(userId);
                    certificateRequestService.getUserRequests(userId);
                    complaintService.getUserComplaints(userId);
                }

                logger.info("Database cache preloading completed successfully! All records instantly accessible.");
            } catch (Exception e) {
                logger.error("Failed to preload database cache: ", e);
            }
        });
    }
}
