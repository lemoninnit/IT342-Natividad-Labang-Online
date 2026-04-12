package edu.cit.natividad.labangonline.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.natividad.labangonline.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

  boolean existsByEmailIgnoreCase(String email);

  boolean existsByPhoneNumber(String phoneNumber);

  Optional<User> findByEmailIgnoreCase(String email);

  Optional<User> findByUsernameIgnoreCase(String username);

  java.util.List<User> findByResidentConfirmedFalse();
}

