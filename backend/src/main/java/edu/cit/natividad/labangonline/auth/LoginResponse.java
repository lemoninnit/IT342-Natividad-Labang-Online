package edu.cit.natividad.labangonline.auth;

import edu.cit.natividad.labangonline.user.User;

public class LoginResponse {

  private String status;
  private User user;

  public LoginResponse() {
  }

  public LoginResponse(String status) {
    this.status = status;
  }

  public LoginResponse(String status, User user) {
    this.status = status;
    this.user = user;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }
}
