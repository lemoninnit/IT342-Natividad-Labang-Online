package edu.cit.natividad.labangonline.dto;

import java.io.Serializable;

public class PaymentVerificationDTO implements Serializable {

  private Long paymentId;
  private String referenceNumber;
  private String proofImage; // base64 encoded
  private String status;

  public PaymentVerificationDTO() {
  }

  public Long getPaymentId() {
    return paymentId;
  }

  public void setPaymentId(Long paymentId) {
    this.paymentId = paymentId;
  }

  public String getReferenceNumber() {
    return referenceNumber;
  }

  public void setReferenceNumber(String referenceNumber) {
    this.referenceNumber = referenceNumber;
  }

  public String getProofImage() {
    return proofImage;
  }

  public void setProofImage(String proofImage) {
    this.proofImage = proofImage;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }
}
