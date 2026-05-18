package edu.cit.natividad.labangonline.api

import android.content.Context
import com.google.gson.Gson
import edu.cit.natividad.labangonline.api.models.User

object UserManager {
    private var currentUser: User? = null
    private val gson = Gson()

    /**
     * Set the current user and persist a JSON copy in SharedPreferences for cold starts.
     */
    fun setCurrentUser(user: User?, context: Context? = null) {
        currentUser = user
        if (context != null && user != null) {
            try {
                val sharedPref = context.getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
                val json = gson.toJson(user)
                sharedPref.edit().putString("cached_user_json", json).apply()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    /**
     * Retrieve the cached user. Checks the in-memory store first, falls back to disk, and warms memory if found.
     */
    fun getCurrentUser(context: Context? = null): User? {
        if (currentUser != null) {
            return currentUser
        }
        if (context != null) {
            try {
                val sharedPref = context.getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
                val json = sharedPref.getString("cached_user_json", null)
                if (json != null) {
                    currentUser = gson.fromJson(json, User::class.java)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        return currentUser
    }

    /**
     * Clear active session memory and persistence on logout.
     */
    fun clear(context: Context? = null) {
        currentUser = null
        if (context != null) {
            try {
                val sharedPref = context.getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
                sharedPref.edit().remove("cached_user_json").apply()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
