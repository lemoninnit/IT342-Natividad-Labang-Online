package edu.cit.natividad.labangonline.features.certificate;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CertificateRequestDTO implements Serializable {

  @NotNull(message = "Certificate type is required")
  private String certificateType;

  @NotBlank(message = "Purpose is required")
  private String purpose;

  private String attachmentPath;

  public CertificateRequestDTO() {
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

  public String getAttachmentPath() {
    return attachmentPath;
  }

  public void setAttachmentPath(String attachmentPath) {
    this.attachmentPath = attachmentPath;
  }
}
