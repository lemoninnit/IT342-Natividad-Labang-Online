package edu.cit.natividad.labangonline.api.models

import com.google.gson.annotations.SerializedName

// Request Models
data class LoginRequest(
    @SerializedName("username")
    val username: String,
    @SerializedName("password")
    val password: String
)

data class RegisterRequest(
    @SerializedName("firstName")
    val firstName: String,
    @SerializedName("middleName")
    val middleName: String? = null,
    @SerializedName("lastName")
    val lastName: String,
    @SerializedName("username")
    val username: String,
    @SerializedName("dob")
    val dob: String,
    @SerializedName("civilStatus")
    val civilStatus: String,
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
    @SerializedName("postalCode")
    val postalCode: String,
    @SerializedName("phone")
    val phone: String,
    @SerializedName("email")
    val email: String,
    @SerializedName("password")
    val password: String
)

// Response Models
data class LoginResponse(
    @SerializedName("token")
    val token: String,
    @SerializedName("user")
    val user: UserDto
)

data class UserDto(
    @SerializedName("id")
    val id: Long,
    @SerializedName("username")
    val username: String,
    @SerializedName("firstName")
    val firstName: String,
    @SerializedName("lastName")
    val lastName: String,
    @SerializedName("email")
    val email: String,
    @SerializedName("role")
    val role: String,
    @SerializedName("active")
    val active: Boolean
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

// Announcement Model
data class Announcement(
    @SerializedName("id")
    val id: Long,
    @SerializedName("title")
    val title: String,
    @SerializedName("content")
    val content: String,
    @SerializedName("type")
    val type: String,
    @SerializedName("priority")
    val priority: String,
    @SerializedName("postedBy")
    val postedBy: String,
    @SerializedName("createdAt")
    val createdAt: String
)
