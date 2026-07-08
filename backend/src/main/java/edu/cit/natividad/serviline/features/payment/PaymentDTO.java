package edu.cit.natividad.serviline.features.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;

public class PaymentDTO implements Serializable {

  @NotNull(message = "Certificate request ID is required")
  private Long certificateRequestId;

  @NotBlank(message = "Payment method is required")
  private String paymentMethod;

  @NotNull(message = "Amount is required")
  private BigDecimal amount;

  private String referenceNumber;

  public PaymentDTO() {
  }

  public Long getCertificateRequestId() {
    return certificateRequestId;
  }

  public void setCertificateRequestId(Long certificateRequestId) {
    this.certificateRequestId = certificateRequestId;
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

  public String getReferenceNumber() {
    return referenceNumber;
  }

  public void setReferenceNumber(String referenceNumber) {
    this.referenceNumber = referenceNumber;
  }
}
