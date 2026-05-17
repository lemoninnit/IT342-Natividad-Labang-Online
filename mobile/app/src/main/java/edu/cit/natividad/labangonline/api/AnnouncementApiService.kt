package edu.cit.natividad.labangonline.api

import edu.cit.natividad.labangonline.api.models.Announcement
import retrofit2.Response
import retrofit2.http.GET

interface AnnouncementApiService {
    @GET("announcements")
    suspend fun getAllAnnouncements(): Response<List<Announcement>>
}
