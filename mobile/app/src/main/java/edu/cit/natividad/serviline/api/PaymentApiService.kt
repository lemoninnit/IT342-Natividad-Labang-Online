package edu.cit.natividad.serviline.api

import edu.cit.natividad.serviline.api.models.PaymentDTO
import edu.cit.natividad.serviline.api.models.PaymentResponse
import edu.cit.natividad.serviline.api.models.PaymentVerificationDTO
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path

interface PaymentApiService {
    @POST("payments/initiate")
    suspend fun initiatePayment(
        @Header("X-User-Id") userId: Long,
        @Body request: PaymentDTO
    ): Response<PaymentResponse>

    @POST("payments/verify")
    suspend fun verifyPayment(
        @Header("X-User-Id") userId: Long,
        @Body request: PaymentVerificationDTO
    ): Response<PaymentResponse>

    @GET("payments/certificate-request/{certificateRequestId}")
    suspend fun getPaymentByCertificateRequest(
        @Header("X-User-Id") userId: Long,
        @Path("certificateRequestId") certificateRequestId: Long
    ): Response<PaymentResponse>
}
