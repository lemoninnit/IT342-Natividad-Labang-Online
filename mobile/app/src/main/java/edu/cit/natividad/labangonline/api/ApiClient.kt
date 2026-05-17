package edu.cit.natividad.labangonline.api

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {
    // Change this to your server's IP address (e.g., "192.168.1.5")
    // 192.168.1.12 allows physical device to connect over Wi-Fi
    // Or use "10.0.2.2" if you are using an Android Emulator
    private const val SERVER_IP = "192.168.1.12" 
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

    fun getUserService(): UserApiService {
        return retrofit.create(UserApiService::class.java)
    }

    fun getCertificateService(): CertificateApiService {
        return retrofit.create(CertificateApiService::class.java)
    }

    fun getPaymentService(): PaymentApiService {
        return retrofit.create(PaymentApiService::class.java)
    }

    fun getComplaintService(): ComplaintApiService {
        return retrofit.create(ComplaintApiService::class.java)
    }

    fun getAnnouncementService(): AnnouncementApiService {
        return retrofit.create(AnnouncementApiService::class.java)
    }
}
