package edu.cit.natividad.serviline.features.certificate;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CertificateRequestResponseDTO implements Serializable {

  private Long id;
  private String certificateType;
  private String purpose;
  private String status;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private String attachmentPath;
  private PaymentResponseDTO payment;

  public CertificateRequestResponseDTO() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getCertificateType() {
    return certificateType;
  }

  public void setCertificateType(String certificateType) {
    this.certificateType = certificateType;
  }

  public String getPurpose() {
    return purpose;
  }

  public void setPurpose(String purpose) {
    this.purpose = purpose;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
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

  public String getAttachmentPath() {
    return attachmentPath;
  }

  public void setAttachmentPath(String attachmentPath) {
    this.attachmentPath = attachmentPath;
  }

  public PaymentResponseDTO getPayment() {
    return payment;
  }

  public void setPayment(PaymentResponseDTO payment) {
    this.payment = payment;
  }

  public static class PaymentResponseDTO implements Serializable {
    private Long id;
    private String paymentMethod;
    private BigDecimal amount;
    private String status;
    private String referenceNumber;
    private String qrCodePath;

    public PaymentResponseDTO() {
    }

    public Long getId() {
      return id;
    }

    public void setId(Long id) {
      this.id = id;
    }

    public String getPaymentMethod() {
      return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
      this.paymentMethod = paymentMethod;
    }

    public BigDecimal getAmount() {
      return amount;
    }

    public void setAmount(BigDecimal amount) {
      this.amount = amount;
    }

    public String getStatus() {
      return status;
    }

    public void setStatus(String status) {
      this.status = status;
    }

    public String getReferenceNumber() {
      return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
      this.referenceNumber = referenceNumber;
    }

    public String getQrCodePath() {
      return qrCodePath;
    }

    public void setQrCodePath(String qrCodePath) {
      this.qrCodePath = qrCodePath;
    }
  }
}
