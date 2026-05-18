package edu.cit.natividad.labangonline.features.certificate;
import edu.cit.natividad.labangonline.features.user.User;
import edu.cit.natividad.labangonline.features.payment.Payment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Index;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificate_requests", indexes = {
    @Index(name = "idx_cert_req_user_id", columnList = "user_id"),
    @Index(name = "idx_cert_req_status", columnList = "status"),
    @Index(name = "idx_cert_req_created_at", columnList = "created_at DESC")
})
public class CertificateRequest {

  public enum CertificateType {
    BARANGAY_CLEARANCE,
    RESIDENCY_CERTIFICATE,
    INDIGENCY_CERTIFICATE,
    BUSINESS_PERMIT,
    GOOD_MORAL_CHARACTER
  }

  public enum RequestStatus {
    PENDING,
    PAID,
    UNPAID,
    DONE,
    REJECTED,
    FAILED_PAYMENT_VERIFICATION
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  private User user;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(name = "certificate_type", nullable = false)
  private CertificateType certificateType;

  @NotBlank
  @Column(name = "purpose", nullable = false, columnDefinition = "TEXT")
  private String purpose;

  @Column(name = "attachment_path")
  private String attachmentPath;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private RequestStatus status = RequestStatus.PENDING;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  @Column(name = "updated_at")
  private LocalDateTime updatedAt = LocalDateTime.now();

  @OneToOne(mappedBy = "certificateRequest")
  private Payment payment;

  public CertificateRequest() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public CertificateType getCertificateType() {
    return certificateType;
  }

  public void setCertificateType(CertificateType certificateType) {
    this.certificateType = certificateType;
  }

  public String getPurpose() {
    return purpose;
  }

  public void setPurpose(String purpose) {
    this.purpose = purpose;
  }

  public String getAttachmentPath() {
    return attachmentPath;
  }

  public void setAttachmentPath(String attachmentPath) {
    this.attachmentPath = attachmentPath;
  }

  public RequestStatus getStatus() {
    return status;
  }

  public void setStatus(RequestStatus status) {
    this.status = status;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  public Payment getPayment() {
    return payment;
  }

  public void setPayment(Payment payment) {
    this.payment = payment;
  }
}
