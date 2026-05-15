package edu.cit.natividad.labangonline.api

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    // Change this to your server's IP address (e.g., "192.168.1.5")
    // 10.0.2.2 is the default IP to access localhost from the Android Emulator
    private const val SERVER_IP = "10.0.2.2" 
    private const val BASE_URL = "http://$SERVER_IP:8080/api/"

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .build()

    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(httpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    fun getAuthService(): AuthApiService {
        return retrofit.create(AuthApiService::class.java)
    }
}
