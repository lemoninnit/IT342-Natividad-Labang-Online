package edu.cit.natividad.labangonline.features.user;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Index;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_email", columnList = "email"),
    @Index(name = "idx_users_username", columnList = "username"),
    @Index(name = "idx_users_phone", columnList = "phone_number")
})
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(max = 100)
  @Column(name = "first_name", nullable = false, length = 100)
  private String firstName;

  @Size(max = 100)
  @Column(name = "middle_name", length = 100)
  private String middleName;

  @NotBlank
  @Size(max = 100)
  @Column(name = "last_name", nullable = false, length = 100)
  private String lastName;

  @Column(name = "date_of_birth")
  private LocalDate dob;

  @Size(max = 50)
  @Column(name = "gender", length = 50)
  private String gender;

  @Size(max = 100)
  @Column(name = "username", length = 100, unique = true)
  private String username;

  @Size(max = 50)
  @Column(name = "civil_status", length = 50)
  private String civilStatus;

  @Column(name = "resident_confirmed", nullable = false)
  private boolean residentConfirmed = false;

  @Column(name = "resident_id_url", length = 255)
  private String residentIdUrl;

  @Column(name = "profile_picture")
  private byte[] profilePicture;

  @Column(name = "resident_id_image")
  private byte[] residentIdImage;

  @NotBlank
  @Size(max = 255)
  @Column(name = "street_address", nullable = false, length = 255)
  private String street;

  @NotBlank
  @Size(max = 100)
  @Column(name = "purok", nullable = false, length = 100)
  private String purok;

  @NotBlank
  @Size(max = 100)
  @Column(name = "barangay", nullable = false, length = 100)
  private String barangay;

  @NotBlank
  @Size(max = 100)
  @Column(name = "city", nullable = false, length = 100)
  private String city;

  @NotBlank
  @Size(max = 100)
  @Column(name = "province", nullable = false, length = 100)
  private String province;

  @NotBlank
  @Size(max = 20)
  @Column(name = "postal_code", nullable = false, length = 20)
  private String postalCode;

  @NotBlank
  @Size(max = 20)
  @Column(name = "phone_number", nullable = false, length = 20)
  private String phoneNumber;

  @Email
  @NotBlank
  @Size(max = 255)
  @Column(name = "email", nullable = false, unique = true, length = 255)
  private String email;

  @NotBlank
  @Size(max = 255)
  @Column(name = "password_hash", nullable = false, length = 255)
  private String passwordHash;

  @NotBlank
  @Size(max = 50)
  @Column(name = "role", nullable = false, length = 50)
  private String role;

  @Column(name = "is_active", nullable = false)
  private boolean active = true;

  public User() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getMiddleName() {
    return middleName;
  }

  public void setMiddleName(String middleName) {
    this.middleName = middleName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public LocalDate getDob() {
    return dob;
  }

  public void setDob(LocalDate dob) {
    this.dob = dob;
  }

  public String getGender() {
    return gender;
  }

  public void setGender(String gender) {
    this.gender = gender;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getCivilStatus() {
    return civilStatus;
  }

  public void setCivilStatus(String civilStatus) {
    this.civilStatus = civilStatus;
  }

  public boolean isResidentConfirmed() {
    return residentConfirmed;
  }

  public void setResidentConfirmed(boolean residentConfirmed) {
    this.residentConfirmed = residentConfirmed;
  }

  public String getResidentIdUrl() {
    return residentIdUrl;
  }

  public void setResidentIdUrl(String residentIdUrl) {
    this.residentIdUrl = residentIdUrl;
  }

  public String getStreet() {
    return street;
  }

  public void setStreet(String street) {
    this.street = street;
  }

  public String getPurok() {
    return purok;
  }

  public void setPurok(String purok) {
    this.purok = purok;
  }

  public String getBarangay() {
    return barangay;
  }

  public void setBarangay(String barangay) {
    this.barangay = barangay;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getProvince() {
    return province;
  }

  public void setProvince(String province) {
    this.province = province;
  }

  public String getPostalCode() {
    return postalCode;
  }

  public void setPostalCode(String postalCode) {
    this.postalCode = postalCode;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public byte[] getProfilePicture() {
    return profilePicture;
  }

  public void setProfilePicture(byte[] profilePicture) {
    this.profilePicture = profilePicture;
  }

  public byte[] getResidentIdImage() {
    return residentIdImage;
  }

  public void setResidentIdImage(byte[] residentIdImage) {
    this.residentIdImage = residentIdImage;
  }
}

