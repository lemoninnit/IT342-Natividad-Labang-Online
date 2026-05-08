package edu.cit.natividad.labangonline.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminCertificateRequestResponseDTO implements Serializable {

  private Long id;
  private String certificateType;
  private String purpose;
  private String status;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private String attachmentPath;
  private AdminUserResponseDTO user;
  private PaymentResponseDTO payment;

  public AdminCertificateRequestResponseDTO() {
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

  public AdminUserResponseDTO getUser() {
    return user;
  }

  public void setUser(AdminUserResponseDTO user) {
    this.user = user;
  }

  public PaymentResponseDTO getPayment() {
    return payment;
  }

  public void setPayment(PaymentResponseDTO payment) {
    this.payment = payment;
  }

  public static class AdminUserResponseDTO implements Serializable {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String street;
    private String purok;
    private String barangay;
    private String city;
    private String province;
    private String postalCode;
    private boolean residentConfirmed;

    public AdminUserResponseDTO() {
    }

    public Long getId() {
      return id;
    }

    public void setId(Long id) {
      this.id = id;
    }

    public String getFirstName() {
      return firstName;
    }

    public void setFirstName(String firstName) {
      this.firstName = firstName;
    }

    public String getLastName() {
      return lastName;
    }

    public void setLastName(String lastName) {
      this.lastName = lastName;
    }

    public String getEmail() {
      return email;
    }

    public void setEmail(String email) {
      this.email = email;
    }

    public String getPhoneNumber() {
      return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
      this.phoneNumber = phoneNumber;
    }

    public String getStreet() {
      return street;
    }

    public void setStreet(String street) {
      this.street = street;
    }

    public String getPurok() {
      return purok;
    }

    public void setPurok(String purok) {
      this.purok = purok;
    }

    public String getBarangay() {
      return barangay;
    }

    public void setBarangay(String barangay) {
      this.barangay = barangay;
    }

    public String getCity() {
      return city;
    }

    public void setCity(String city) {
      this.city = city;
    }

    public String getProvince() {
      return province;
    }

    public void setProvince(String province) {
      this.province = province;
    }

    public String getPostalCode() {
      return postalCode;
    }

    public void setPostalCode(String postalCode) {
      this.postalCode = postalCode;
    }

    public boolean isResidentConfirmed() {
      return residentConfirmed;
    }

    public void setResidentConfirmed(boolean residentConfirmed) {
      this.residentConfirmed = residentConfirmed;
    }
  }

  public static class PaymentResponseDTO implements Serializable {
    private Long id;
    private String paymentMethod;
    private String amount;
    private String status;
    private String referenceNumber;
    private String qrCodePath;
    private String proofImage;

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

    public String getAmount() {
      return amount;
    }

    public void setAmount(String amount) {
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

    public String getProofImage() {
      return proofImage;
    }

    public void setProofImage(String proofImage) {
      this.proofImage = proofImage;
    }
  }
}
