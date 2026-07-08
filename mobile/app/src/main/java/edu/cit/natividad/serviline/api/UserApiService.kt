package edu.cit.natividad.serviline.api

import edu.cit.natividad.serviline.api.models.User
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PUT
import retrofit2.http.Path

interface UserApiService {
    @GET("users/{id}")
    suspend fun getUserProfile(@Path("id") id: Long): Response<User>

    @PUT("users/{id}")
    suspend fun updateUserProfile(@Path("id") id: Long, @Body user: User): Response<User>
}
