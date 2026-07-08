package edu.cit.natividad.serviline.api

import edu.cit.natividad.serviline.api.models.Announcement
import retrofit2.Response
import retrofit2.http.GET

interface AnnouncementApiService {
    @GET("announcements")
    suspend fun getAllAnnouncements(): Response<List<Announcement>>
}
