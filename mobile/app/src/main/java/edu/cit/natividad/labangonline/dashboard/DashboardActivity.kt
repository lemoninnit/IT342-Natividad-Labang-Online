package edu.cit.natividad.labangonline.dashboard

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import edu.cit.natividad.labangonline.api.ApiClient
import edu.cit.natividad.labangonline.api.models.Announcement
import edu.cit.natividad.labangonline.auth.LoginActivity
import edu.cit.natividad.labangonline.databinding.ActivityDashboardBinding
import kotlinx.coroutines.launch

class DashboardActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUserIdentity()
        fetchAnnouncements()

        binding.logoutButton.setOnClickListener {
            handleLogout()
        }
    }

    private fun setupUserIdentity() {
        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        val savedFullName = sharedPref.getString("full_name", null)
        val savedRole = sharedPref.getString("role", "RESIDENT")
        
        val intentName = intent.getStringExtra("USER_NAME")
        
        val displayName = intentName ?: savedFullName ?: "Lumina Resident"

        binding.userNameDisplay.text = displayName
        binding.userRoleDisplay.text = savedRole?.uppercase() ?: "RESIDENT"
    }

    private fun fetchAnnouncements() {
        binding.loadingIndicator.visibility = View.VISIBLE
        binding.announcementsList.visibility = View.GONE
        binding.emptyState.visibility = View.GONE

        lifecycleScope.launch {
            try {
                val response = ApiClient.getAuthService().getAnnouncements()
                if (response.isSuccessful && response.body() != null) {
                    val announcements = response.body()!!
                    if (announcements.isNotEmpty()) {
                        val adapter = AnnouncementAdapter(this@DashboardActivity, announcements)
                        binding.announcementsList.adapter = adapter
                        binding.announcementsList.visibility = View.VISIBLE
                    } else {
                        binding.emptyState.visibility = View.VISIBLE
                    }
                } else {
                    binding.emptyState.visibility = View.VISIBLE
                }
            } catch (e: Exception) {
                e.printStackTrace()
                binding.emptyState.visibility = View.VISIBLE
            } finally {
                binding.loadingIndicator.visibility = View.GONE
            }
        }
    }

    private fun handleLogout() {
        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        sharedPref.edit().clear().apply()
        
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
}
