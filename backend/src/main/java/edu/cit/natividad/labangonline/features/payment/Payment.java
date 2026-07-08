package edu.cit.natividad.serviline.features.payment;
import edu.cit.natividad.serviline.features.certificate.CertificateRequest;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Index;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payments_cert_req_id", columnList = "certificate_request_id"),
    @Index(name = "idx_payments_status", columnList = "status"),
    @Index(name = "idx_payments_created_at", columnList = "created_at DESC")
})
public class Payment {

  public enum PaymentMethod {
    GCASH,
    OVER_THE_COUNTER
  }

  public enum PaymentStatus {
    PENDING,
    PROCESSING,
    COMPLETED,
    FAILED,
    UNVERIFIED
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(optional = false)
  @JsonIgnore
  private CertificateRequest certificateRequest;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(name = "payment_method", nullable = false)
  private PaymentMethod paymentMethod;

  @NotNull
  @Column(name = "amount", nullable = false, precision = 10, scale = 2)
  private BigDecimal amount;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private PaymentStatus status = PaymentStatus.PENDING;

  @Column(name = "reference_number")
  private String referenceNumber;

  @Column(name = "proof_image", columnDefinition = "BYTEA")
  private byte[] proofImage;

  @Column(name = "qr_code_path")
  private String qrCodePath;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  @Column(name = "updated_at")
  private LocalDateTime updatedAt = LocalDateTime.now();

  public Payment() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public CertificateRequest getCertificateRequest() {
    return certificateRequest;
  }

  public void setCertificateRequest(CertificateRequest certificateRequest) {
    this.certificateRequest = certificateRequest;
  }

  public PaymentMethod getPaymentMethod() {
    return paymentMethod;
  }

  public void setPaymentMethod(PaymentMethod paymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public PaymentStatus getStatus() {
    return status;
  }

  public void setStatus(PaymentStatus status) {
    this.status = status;
  }

  public String getReferenceNumber() {
    return referenceNumber;
  }

  public void setReferenceNumber(String referenceNumber) {
    this.referenceNumber = referenceNumber;
  }

  public byte[] getProofImage() {
    return proofImage;
  }

  public void setProofImage(byte[] proofImage) {
    this.proofImage = proofImage;
  }

  public String getQrCodePath() {
    return qrCodePath;
  }

  public void setQrCodePath(String qrCodePath) {
    this.qrCodePath = qrCodePath;
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
}
