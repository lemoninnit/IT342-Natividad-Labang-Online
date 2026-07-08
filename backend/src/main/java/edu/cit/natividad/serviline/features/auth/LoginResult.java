package edu.cit.natividad.serviline.features.auth;

import edu.cit.natividad.serviline.features.user.User;

public class LoginResult {

  private final boolean success;
  private final User user;

  private LoginResult(boolean success, User user) {
    this.success = success;
    this.user = user;
  }

  public static LoginResult success(User user) {
    return new LoginResult(true, user);
  }

  public static LoginResult failure() {
    return new LoginResult(false, null);
  }

  public boolean isSuccess() {
    return success;
  }

  public User getUser() {
    return user;
  }
}
