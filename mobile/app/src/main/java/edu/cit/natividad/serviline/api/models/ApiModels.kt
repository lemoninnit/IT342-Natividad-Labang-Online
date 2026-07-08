package edu.cit.natividad.serviline.api.models

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
    @SerializedName("id") val id: Long,
    @SerializedName("firstName") val firstName: String,
    @SerializedName("middleName") val middleName: String?,
    @SerializedName("lastName") val lastName: String,
    @SerializedName("username") val username: String?,
    @SerializedName("email") val email: String,
    @SerializedName("phoneNumber") val phoneNumber: String,
    @SerializedName("role") val role: String,
    @SerializedName("active") val active: Boolean,
    @SerializedName("dob") val dob: String?,
    @SerializedName("gender") val gender: String?,
    @SerializedName("civilStatus") val civilStatus: String?,
    @SerializedName("residentConfirmed") val residentConfirmed: Boolean,
    @SerializedName("profilePicture") val profilePicture: String?, // Assuming base64 encoded string from backend
    @SerializedName("residentIdImage") val residentIdImage: String?,
    @SerializedName("street") val street: String,
    @SerializedName("purok") val purok: String,
    @SerializedName("barangay") val barangay: String,
    @SerializedName("city") val city: String,
    @SerializedName("province") val province: String,
    @SerializedName("postalCode") val postalCode: String?
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

data class CertificateRequestDTO(
    @SerializedName("certificateType") val certificateType: String,
    @SerializedName("purpose") val purpose: String,
    @SerializedName("attachmentPath") val attachmentPath: String? = null
)

data class CertificateRequestResponseDTO(
    @SerializedName("id") val id: Long,
    @SerializedName("certificateType") val certificateType: String,
    @SerializedName("purpose") val purpose: String,
    @SerializedName("status") val status: String,
    @SerializedName("createdAt") val requestDate: String?,
    @SerializedName("updatedAt") val updatedAt: String?,
    @SerializedName("remarks") val remarks: String?,
    @SerializedName("attachmentPath") val attachmentPath: String?,
    @SerializedName("payment") val payment: PaymentResponseDTO?
)

data class PaymentResponseDTO(
    @SerializedName("id") val id: Long,
    @SerializedName("paymentMethod") val paymentMethod: String,
    @SerializedName("amount") val amount: Double,
    @SerializedName("status") val status: String,
    @SerializedName("referenceNumber") val referenceNumber: String?
)

data class PaymentDTO(
    @SerializedName("certificateRequestId") val certificateRequestId: Long,
    @SerializedName("paymentMethod") val paymentMethod: String,
    @SerializedName("amount") val amount: Double,
    @SerializedName("referenceNumber") val referenceNumber: String? = null
)

data class PaymentVerificationDTO(
    @SerializedName("paymentId") val paymentId: Long,
    @SerializedName("referenceNumber") val referenceNumber: String?,
    @SerializedName("proofImage") val proofImage: String? = null,
    @SerializedName("status") val status: String? = null
)

data class PaymentResponse(
    @SerializedName("paymentId") val paymentId: Long,
    @SerializedName("referenceNumber") val referenceNumber: String?,
    @SerializedName("amount") val amount: Double?,
    @SerializedName("paymentMethod") val paymentMethod: String?,
    @SerializedName("status") val status: String?,
    @SerializedName("message") val message: String?
)

data class ComplaintResponseDTO(
    @SerializedName("id") val id: Long,
    @SerializedName("incidentType") val incidentType: String,
    @SerializedName("incidentDate") val incidentDate: String,
    @SerializedName("incidentTime") val incidentTime: String,
    @SerializedName("location") val location: String,
    @SerializedName("description") val description: String,
    @SerializedName("personsInvolved") val personsInvolved: String?,
    @SerializedName("additionalNotes") val additionalNotes: String?,
    @SerializedName("status") val status: String,
    @SerializedName("createdAt") val createdAt: String
)
