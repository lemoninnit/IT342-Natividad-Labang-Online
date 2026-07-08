package edu.cit.natividad.serviline.api

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import edu.cit.natividad.serviline.BuildConfig

object ApiClient {
    private val BASE_URL = BuildConfig.API_URL

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
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
