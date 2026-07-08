package edu.cit.natividad.serviline.api

import edu.cit.natividad.serviline.api.models.ComplaintResponseDTO
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

interface ComplaintApiService {
    @POST("complaints/submit")
    suspend fun submitComplaint(
        @Header("X-User-Id") userId: Long,
        @Body data: Map<String, String>
    ): Response<ComplaintResponseDTO>

    @GET("complaints/my-reports")
    suspend fun getMyComplaints(
        @Header("X-User-Id") userId: Long
    ): Response<List<ComplaintResponseDTO>>
}
