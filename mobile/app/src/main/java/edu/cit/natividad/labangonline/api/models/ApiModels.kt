package edu.cit.natividad.labangonline.api.models

import com.google.gson.annotations.SerializedName

// Request Models
data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    @SerializedName("firstName")
    val firstName: String,
    @SerializedName("middleName")
    val middleName: String? = null,
    @SerializedName("lastName")
    val lastName: String,
    @SerializedName("dob")
    val dob: String,
    @SerializedName("gender")
    val gender: String,
    @SerializedName("street")
    val street: String,
    @SerializedName("purok")
    val purok: String,
    @SerializedName("barangay")
    val barangay: String,
    @SerializedName("city")
    val city: String,
    @SerializedName("province")
    val province: String,
    @SerializedName("phone")
    val phone: String,
    @SerializedName("email")
    val email: String,
    @SerializedName("password")
    val password: String
)

// Response Models
data class LoginResponse(
    @SerializedName("status")
    val status: String,
    @SerializedName("user")
    val user: User? = null
)

data class RegisterResponse(
    @SerializedName("status")
    val status: String
)

// User Model
data class User(
    @SerializedName("id")
    val id: Long,
    @SerializedName("firstName")
    val firstName: String,
    @SerializedName("middleName")
    val middleName: String?,
    @SerializedName("lastName")
    val lastName: String,
    @SerializedName("email")
    val email: String,
    @SerializedName("phoneNumber")
    val phoneNumber: String,
    @SerializedName("role")
    val role: String,
    @SerializedName("active")
    val active: Boolean,
    @SerializedName("dob")
    val dob: String?,
    @SerializedName("gender")
    val gender: String?,
    @SerializedName("street")
    val street: String,
    @SerializedName("purok")
    val purok: String,
    @SerializedName("barangay")
    val barangay: String,
    @SerializedName("city")
    val city: String,
    @SerializedName("province")
    val province: String
)
