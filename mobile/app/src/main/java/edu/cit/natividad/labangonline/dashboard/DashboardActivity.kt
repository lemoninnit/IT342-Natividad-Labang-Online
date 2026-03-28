package edu.cit.natividad.labangonline.dashboard

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import edu.cit.natividad.labangonline.auth.LoginActivity
import edu.cit.natividad.labangonline.databinding.ActivityDashboardBinding

class DashboardActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val userName = intent.getStringExtra("USER_NAME").takeIf { !it.isNullOrBlank() }
        binding.userNameDisplay.text = userName ?: "Labang Online Community"

        binding.logoutButton.setOnClickListener {
            handleLogout()
        }
    }

    private fun handleLogout() {
        // Clear session/user data if needed
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
}
