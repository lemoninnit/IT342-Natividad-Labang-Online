package com.natividad.LabangOnline.auth;

import com.natividad.LabangOnline.user.User;
import com.natividad.LabangOnline.user.UserRepository;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    user.setStreet(request.getStreet().trim());
    user.setPurok(request.getPurok().trim());
    user.setBarangay(request.getBarangay().trim());
    user.setCity(request.getCity().trim());
    user.setProvince(request.getProvince().trim());
    user.setPhoneNumber(phone);
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    user.setRole("resident");
    user.setActive(true);

    userRepository.save(user);
  }
}

