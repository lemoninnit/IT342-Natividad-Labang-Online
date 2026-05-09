package edu.cit.natividad.labangonline.features.auth;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterRequest {

  @NotBlank
  private String firstName;

  private String middleName;

  @NotBlank
  private String lastName;

  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate dob;

  private String gender;

  private String username;

  private String civilStatus;

  @NotBlank
  private String street;

  @NotBlank
  private String purok;

  @NotBlank
  private String barangay;

  @NotBlank
  private String city;

  @NotBlank
  private String province;

  @NotBlank
  private String postalCode;

  @NotBlank
  private String phone;

  @Email
  @NotBlank
  private String email;

  @NotBlank
  private String password;

  public RegisterRequest() {
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

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}

