package edu.cit.natividad.serviline.features.announcement;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
public class Announcement {

    public enum AnnouncementType {
        GENERAL,
        EVENTS,
        ALERTS,
        MAINTENANCE
    }

    public enum PriorityLevel {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AnnouncementType type;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PriorityLevel priority = PriorityLevel.MEDIUM;

    @Column(name = "posted_by")
    private String postedBy;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "is_published")
    private boolean published = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Announcement() {
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public AnnouncementType getType() { return type; }
    public void setType(AnnouncementType type) { this.type = type; }

    public PriorityLevel getPriority() { return priority; }
    public void setPriority(PriorityLevel priority) { this.priority = priority; }

    public String getPostedBy() { return postedBy; }
    public void setPostedBy(String postedBy) { this.postedBy = postedBy; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
