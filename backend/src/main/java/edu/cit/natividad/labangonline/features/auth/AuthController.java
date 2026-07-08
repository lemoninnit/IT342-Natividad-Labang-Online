package edu.cit.natividad.serviline.features.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.natividad.serviline.features.auth.LoginRequest;
import edu.cit.natividad.serviline.features.auth.LoginResponse;
import edu.cit.natividad.serviline.features.auth.RegisterRequest;
import edu.cit.natividad.serviline.features.auth.RegisterResponse;
import edu.cit.natividad.serviline.features.user.UserRepository;
import edu.cit.natividad.serviline.features.auth.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;
  private final UserRepository userRepository;

  public AuthController(AuthService authService, UserRepository userRepository) {
    this.authService = authService;
    this.userRepository = userRepository;
  }

  @PostMapping("/register")
  public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
    String email = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();
    String phone = request.getPhone() == null ? "" : request.getPhone().trim();

    if (userRepository.existsByEmailIgnoreCase(email)) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(new RegisterResponse("EMAIL_EXISTS"));
    }

    if (userRepository.existsByPhoneNumber(phone)) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(new RegisterResponse("PHONE_EXISTS"));
    }

    authService.register(request);

    return ResponseEntity.status(HttpStatus.CREATED).body(new RegisterResponse("OK"));
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    var result = authService.login(request);
    if (!result.isSuccess()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse("INVALID_CREDENTIALS"));
    }
    return ResponseEntity.ok(new LoginResponse("OK", result.getUser()));
  }
}
