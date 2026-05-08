package edu.cit.natividad.labangonline.features.auth;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.cit.natividad.labangonline.features.auth.LoginRequest;
import edu.cit.natividad.labangonline.features.auth.RegisterRequest;
import edu.cit.natividad.labangonline.features.user.User;
import edu.cit.natividad.labangonline.features.user.UserRepository;


@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Transactional
  public void register(RegisterRequest request) {
    String email = Optional.ofNullable(request.getEmail()).orElse("").trim().toLowerCase();
    String phone = Optional.ofNullable(request.getPhone()).orElse("").trim();

    request.setEmail(email);
    request.setPhone(phone);

    User user = new User();
    user.setFirstName(request.getFirstName().trim());
    if (request.getMiddleName() != null && !request.getMiddleName().isBlank()) {
      user.setMiddleName(request.getMiddleName().trim());
    }
    user.setLastName(request.getLastName().trim());
    user.setDob(request.getDob());
    user.setGender(request.getGender());
    user.setUsername(request.getUsername());
    user.setCivilStatus(request.getCivilStatus());
    user.setResidentConfirmed(false); // New users start as unconfirmed
    user.setStreet(request.getStreet().trim());
    user.setPurok(request.getPurok().trim());
    user.setBarangay(request.getBarangay().trim());
    user.setCity(request.getCity().trim());
    user.setProvince(request.getProvince().trim());
    user.setPostalCode(request.getPostalCode().trim());
    user.setPhoneNumber(phone);
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    user.setRole("RESIDENT");
    user.setActive(true);

    userRepository.save(user);
  }

  public LoginResult login(LoginRequest request) {
    String username = Optional.ofNullable(request.getUsername()).orElse("").trim();
    String password = Optional.ofNullable(request.getPassword()).orElse("");

    Optional<User> userOpt = userRepository.findByUsernameIgnoreCase(username)
        .filter(user -> passwordEncoder.matches(password, user.getPasswordHash()) && user.isActive());

    // Check if resident is confirmed, but let admins bypass this
    userOpt = userOpt.filter(user -> user.getRole().equals("ADMIN") || user.isResidentConfirmed());

    return userOpt.map(LoginResult::success).orElse(LoginResult.failure());
  }
}

