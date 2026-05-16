package edu.cit.natividad.labangonline.dashboard

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import edu.cit.natividad.labangonline.auth.LoginActivity
import edu.cit.natividad.labangonline.databinding.ActivityDashboardBinding
import edu.cit.natividad.labangonline.utils.setupBottomNavigation

class DashboardActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupUserIdentity()

        setupBottomNavigation()
    }

    private fun setupUserIdentity() {
        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        val savedFullName = sharedPref.getString("full_name", null)
        
        val intentName = intent.getStringExtra("USER_NAME")
        
        val displayName = intentName ?: savedFullName ?: "Lenon Lee Natividad"

        // Update the Profile layout UI elements
        binding.userNameDisplay.text = displayName
        binding.tvFullName.text = displayName
    }

    // Kept the handleLogout function for when you want to bind it to a new button
    private fun handleLogout() {
        val sharedPref = getSharedPreferences("labangonline_prefs", Context.MODE_PRIVATE)
        sharedPref.edit().clear().apply()
        
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
}
