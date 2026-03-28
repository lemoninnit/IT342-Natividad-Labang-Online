package edu.cit.natividad.labangonline.api

import edu.cit.natividad.labangonline.api.models.LoginRequest
import edu.cit.natividad.labangonline.api.models.LoginResponse
import edu.cit.natividad.labangonline.api.models.RegisterRequest
import edu.cit.natividad.labangonline.api.models.RegisterResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<RegisterResponse>

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
}
