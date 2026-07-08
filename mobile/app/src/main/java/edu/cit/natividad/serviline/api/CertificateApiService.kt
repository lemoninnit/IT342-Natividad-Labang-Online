package edu.cit.natividad.serviline.api

import edu.cit.natividad.serviline.api.models.CertificateRequestDTO
import edu.cit.natividad.serviline.api.models.CertificateRequestResponseDTO
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path

interface CertificateApiService {
    @POST("certificate-requests/submit")
    suspend fun submitRequest(
        @Header("X-User-Id") userId: Long,
        @Body request: CertificateRequestDTO
    ): Response<CertificateRequestResponseDTO>

    @GET("certificate-requests/my-requests")
    suspend fun getMyRequests(
        @Header("X-User-Id") userId: Long
    ): Response<List<CertificateRequestResponseDTO>>
}
