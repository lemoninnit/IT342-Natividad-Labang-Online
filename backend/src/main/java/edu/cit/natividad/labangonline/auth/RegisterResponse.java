package edu.cit.natividad.labangonline.auth;

public class RegisterResponse {

  private String status;

  public RegisterResponse() {
  }

  public RegisterResponse(String status) {
    this.status = status;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }
}

